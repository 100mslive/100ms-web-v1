import React from 'react';
import { Spin, notification } from 'antd';
import { Controls } from './components/Controls';
import { Client, LocalStream, RemoteStream } from '@100mslive/hmsvideo-web';
import '../styles/css/conference.scss';
import { Gallery } from './components/Conference/gallery';
import { Pinned } from './components/Conference/pinned';
import PeerState, { onRoomStateChange } from './utils/state';

const modes = {
  GALLERY: 'GALLERY',
  PINNED: 'PINNED',
};

class Conference extends React.Component {
  constructor() {
    super();
    this.state = {
      streams: [],
      localStream: null,
      localScreen: null,
      audioMuted: false,
      videoMuted: false,
      mode: modes.GALLERY,
      pinned: false,
    };
  }

  componentDidMount = () => {
    const { client } = this.props;
    client.on('stream-add', this._handleAddStream);
    client.on('stream-remove', this._handleRemoveStream);
    this.roomStateUnsubscribe = onRoomStateChange(
      client.rid,
      peers => {
        console.log('CHANGED VALUES: ', peers);
        const streamsMap = peers.reduce((a, c) => {
          return { ...a, ...c.streams };
        }, {});

        const newStreams = this.state.streams.map(stream => {
          return { ...stream, ...streamsMap[stream.mid] };
        });

        this.setState({ streams: newStreams });
      },

      console.error
    );
  };

  updateLocalPeerState = () => {
    console.log('Updating state');
    this.peerState = new PeerState({
      mid: this.state.localStream.mid,
      uid: this.props.client.uid,
      rid: this.props.client.rid,
    });

    console.info('New peerState created', this.peerState);

    this.peerState.update({
      audioEnabled: true,
      videoEnabled: true,
    });

    this.peerState.onRequest(request => {
      console.log('REQUEST', request);
      const isMuted = this.state.audioMuted;
      if (request.mute) {
        if (isMuted) return;
        console.log('Muting');
        this.muteMediaTrack('audio', false);
      } else {
        if (!isMuted) return;
        console.log('Unmuting');
        this.muteMediaTrack('audio', true);
      }
    });
  };

  pollForMid = count => {
    //if(this.state.localStream.mid) console.log("Count is", count);
    if (this.state.localStream.mid) {
      console.log('Stream Mid is', this.state.localStream.mid);
      this.updateLocalPeerState();
    }
    if (!this.state.localStream.mid)
      setTimeout(() => {
        this.pollForMid(count + 1);
      }, 250);
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.localStream && this.state.localStream) {
      this.pollForMid(0);
      console.log('Got stream', this.state.localStream.mid);
    }
  }

  componentWillUnmount = () => {
    const { client } = this.props;
    client.off('stream-add', this._handleAddStream);
    client.off('stream-remove', this._handleRemoveStream);
    this.roomStateUnsubscribe && this.roomStateUnsubscribe();
  };

  cleanUp = async () => {
    let { localStream, localScreen, streams } = this.state;
    await this.setState({ localStream: null, localScreen: null, streams: [] });

    // streams.forEach(async item => {
    //   await this.client.unsubscribe(item.stream,this.client.rid);
    // });

    await this._unpublish(localStream);
    // this.peerStateUnsubscribe();
    this.peerState.delete();
  };

  // @TODO: Move this to utils or core lib
  tuneLocalStream = participantCount => {
    if (!this.state.localStream) return;

    const MAX_INCOMING_BITRATE = 1600;
    const outgoing_bitrate = MAX_INCOMING_BITRATE / participantCount;
    console.log(this.state.localStream.getVideoTracks()[0].getConstraints());
    if (outgoing_bitrate < MAX_INCOMING_BITRATE) {
      this.state.localStream.getVideoTracks()[0].applyConstraints({
        ...this.state.localStream.getVideoTracks()[0].getConstraints(),
        frameRate: 10, // Min framerate
        // Do something more to get the bandwidth to `outgoing_bitrate`
      });
    } else {
      this.state.localStream.getVideoTracks()[0].applyConstraints({
        ...this.state.localStream.getVideoTracks()[0].getConstraints(),
        frameRate: 20, // Reset to default
      });
    }
  };

  _notification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: 'bottomRight',
    });
  };

  _unpublish = async stream => {
    const { client } = this.props;
    if (stream) {
      await this._stopMediaStream(stream);
      await client.unpublish(stream, client.rid);
    }
  };

  muteMediaTrack = (type, enabled) => {
    let { localStream } = this.state;
    if (!localStream) {
      return;
    }
    if (enabled) {
      localStream.unmute(type);
    } else {
      localStream.mute(type);
    }

    if (type === 'audio') {
      this.setState({ audioMuted: !enabled });
      this.peerState && this.peerState.update({ audioEnabled: enabled });
    } else if (type === 'video') {
      this.setState({ videoMuted: !enabled });
      this.peerState && this.peerState.update({ videoEnabled: enabled });
    }
  };

  handleLocalStream = async enabled => {
    let { localStream } = this.state;
    const { client, settings } = this.props;
    console.log('Settings===========');
    console.log(settings);

    try {
      if (enabled) {
        // let videoOptions = {
        //   deviceId: settings.selectedVideoDevice,
        //   frameRate: 20,
        // };
        // // @TODO: This is a kludge. Clean this up
        // if (settings.resolution === 'qqvga') {
        //   videoOptions = {
        //     ...videoOptions,
        //     ...{
        //       width: { ideal: 160 },
        //       height: { ideal: 90 },
        //       frameRate: { ideal: 15 },
        //     },
        //   };
        // }
        localStream = await client.getLocalStream({
          codec: settings.codec.toUpperCase(),
          resolution: settings.resolution,
          bitrate: settings.bandwidth,
          frameRate: settings.frameRate,
          shouldPublishAudio: true,
          shouldPublishVideo: true,
        });
        console.log({ settings });
        await client.publish(localStream, client.rid);
      } else {
        if (localStream) {
          this._unpublish(localStream);
          localStream = null;
        }
      }
      console.log('local stream', localStream.getTracks());
      this.setState({ localStream });
    } catch (e) {
      console.log('handleLocalStream error => ' + e);
      // this._notification("publish/unpublish failed!", e);
    }

    //Check audio only conference
    this.muteMediaTrack('video', this.props.localVideoEnabled);
  };

  handleScreenSharing = async enabled => {
    let { localScreen } = this.state;
    const { client, settings } = this.props;
    if (enabled) {
      localScreen = await client.getLocalScreen({
        bitrate: 300,
        codec: settings.codec.toUpperCase(),
        resolution: 'hd',
        frameRate: 10,
      });
      localScreen.getVideoTracks().forEach(track => {
        if ('contentHint' in track) {
          track.contentHint = 'text';
        }
      });
      console.log({ localScreen });
      await client.publish(localScreen, client.rid);
      let track = localScreen.getVideoTracks()[0];
      if (track) {
        track.addEventListener('ended', () => {
          this.handleScreenSharing(false);
        });
      }
    } else {
      if (localScreen) {
        this._unpublish(localScreen);
        localScreen = null;
        if (
          this.state.mode === modes.PINNED &&
          this.state.pinned === client.uid + '-screen'
        ) {
          this.setState({
            mode: modes.GALLERY,
          });
        }
      }
    }
    this.setState({ localScreen });
  };

  _stopMediaStream = async stream => {
    let tracks = stream.getTracks();
    for (let i = 0, len = tracks.length; i < len; i++) {
      await tracks[i].stop();
    }
  };

  _handleAddStream = async (room, peer, streamInfo) => {
    const { client } = this.props;
    let streams = this.state.streams;
    let stream = await client.subscribe(streamInfo.mid, room);
    stream.info = { name: peer.name }; // @NOTE: Just because stream is expected to have info in this format at the moment by the UI
    streams.push({ mid: stream.mid, stream, sid: streamInfo.mid });
    this.setState({ streams });
    this.tuneLocalStream(streams.length);
  };

  _handleRemoveStream = async (room, streamInfo) => {
    // `room` might be used later in future
    let streams = this.state.streams;
    streams = streams.filter(item => item.sid !== streamInfo.mid);
    this.setState({ streams });
    this.tuneLocalStream(streams.length);
    if (
      this.state.mode === modes.PINNED &&
      this.state.pinned === streamInfo.mid
    ) {
      this.setState({
        mode: modes.GALLERY,
      });
    }
  };

  _onRequest = (uid, request) => {
    this.peerState.setRequest(uid, request);
  };

  _onChangeVideoPosition = data => {
    let id = data.id;
    let index = data.index;
    console.log('_onChangeVideoPosition id:' + id + '  index:' + index);

    if (index == 0) {
      return;
    }

    const streams = this.state.streams;
    let first = 0;
    let big = 0;
    for (let i = 0; i < streams.length; i++) {
      let item = streams[i];
      if (item.mid == id) {
        big = i;
        break;
      }
    }

    let c = streams[first];
    streams[first] = streams[big];
    streams[big] = c;

    this.setState({ streams: streams });
  };

  render = () => {
    const { client } = this.props;
    const {
      streams,
      localStream,
      localScreen,
      audioMuted,
      videoMuted,
    } = this.state;
    const id = client.uid;
    let videoCount = streams.length;
    if (localStream) videoCount++;
    if (localScreen) videoCount++;

    return (
      <>
        {this.state.mode === modes.PINNED ? (
          <Pinned
            streams={streams}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            videoCount={videoCount}
            localStream={localStream}
            localScreen={localScreen}
            client={client}
            id={id}
            loginInfo={this.props.loginInfo}
            pinned={this.state.pinned}
            onUnpin={() => {
              this.setState({
                mode: modes.GALLERY,
              });
            }}
            onRequest={this._onRequest}
          />
        ) : (
          <Gallery
            streams={streams}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            videoCount={videoCount}
            localStream={localStream}
            localScreen={localScreen}
            client={client}
            id={id}
            loginInfo={this.props.loginInfo}
            onPin={streamId => {
              this.setState({
                mode: modes.PINNED,
                pinned: streamId,
              });
            }}
            onRequest={this._onRequest}
          />
        )}
        <Controls
          isMuted={this.state.audioMuted}
          isCameraOn={!this.state.videoMuted}
          isScreenSharing={this.props.isScreenSharing}
          onScreenToggle={this.props.onScreenToggle}
          onLeave={this.props.onLeave}
          onMicToggle={() => {
            this.muteMediaTrack('audio', this.state.audioMuted);
          }}
          onCamToggle={() => {
            this.muteMediaTrack('video', this.state.videoMuted);
          }}
          onChatToggle={this.props.onChatToggle}
          isChatOpen={this.props.isChatOpen}
          loginInfo={this.props.loginInfo}
        />
      </>
    );
  };
}
export default Conference;
