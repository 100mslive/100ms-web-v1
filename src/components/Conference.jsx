import { notification } from 'antd';
import React from 'react';
import { AppContext } from '../stores/AppContext';
import { Gallery } from './Conference/gallery';
import { Pinned } from './Conference/pinned';
import { Controls } from './Controls';
// import PeerState, { onRoomStateChange } from '../utils/state';

const modes = {
  GALLERY: 'GALLERY',
  PINNED: 'PINNED',
};

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: [],
      streamInfo: [],
      localStream: null,
      localScreen: null,
      audioMuted: false,
      videoMuted: false,
      mode: modes.GALLERY,
      pinned: false,
      localStreamError: null,
    };
  }

  componentDidMount = () => {
    const { client } = this.props;
    client.on('stream-add', this._handleAddStream);
    client.on('stream-remove', this._handleRemoveStream);
  };

  componentWillUnmount = () => {
    const { client } = this.props;
    if (client) {
      client.off('stream-add', this._handleAddStream);
      client.off('stream-remove', this._handleRemoveStream);
    }
  };

  cleanUp = async () => {
    let { localStream, localScreen, streams } = this.state;
    await this.setState({ localStream: null, localScreen: null, streams: [] });

    await this._unpublish(localStream);
    await this._unpublish(localScreen);
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
      // this.peerState && this.peerState.update({ audioEnabled: enabled });
    } else if (type === 'video') {
      this.setState({ videoMuted: !enabled });
      // this.peerState && this.peerState.update({ videoEnabled: enabled });
    }
  };

  handleLocalStream = async () => {
    let { localStream } = this.state;
    const {
      client,
      settings,
      localVideoEnabled,
      localAudioEnabled,
    } = this.props;

    console.log('SETTINGS:', settings);

    client
      .getLocalStream({
        codec: settings.codec.toUpperCase(),
        resolution: settings.resolution,
        bitrate: settings.bandwidth,
        frameRate: settings.frameRate,
        shouldPublishAudio: localAudioEnabled,
        shouldPublishVideo: localVideoEnabled,
        advancedMediaConstraints: {
          video: {
            deviceId: settings.selectedVideoDevice,
          },
          audio: {
            deviceId: settings.selectedAudioDevice,
          },
        },
      })
      .then(localStream => {
        return client.publish(localStream, client.rid);
      })
      .then(localStream => {
        this.setState({ localStream });
        !localAudioEnabled &&
          this.muteMediaTrack('audio', this.state.audioMuted);
        !localVideoEnabled &&
          this.muteMediaTrack('video', this.state.videoMuted);
      })
      .catch(error => {
        this.props.setLocalStreamError(error);
      });
  };

  handleScreenSharing = async enabled => {
    let { localScreen } = this.state;
    const { client, settings } = this.props;
    if (enabled) {
      localScreen = await client.getLocalScreen({
        bitrate: 0,
        codec: settings.codec.toUpperCase(),
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
    try {
      let stream = await client.subscribe(streamInfo.mid, room);
      stream.info = { name: peer.name }; // @NOTE: Just because stream is expected to have info in this format at the moment by the UI
      if ((this.state.streamInfo, stream.mid)) {
        streams.push({
          mid: stream.mid,
          stream,
          sid: streamInfo.mid,
          ...this.state.streamInfo[stream.mid],
        });
      } else {
        streams.push({ mid: stream.mid, stream, sid: streamInfo.mid });
      }

      this.setState({ streams });
    } catch (error) {
      this._notification(`ERROR: Error in subscribing`, error.message);
      this.props.cleanUp();
    }
  };

  _handleRemoveStream = async (room, peer, streamInfo) => {
    // `room` might be used later in future
    let streams = this.state.streams;
    streams = streams.filter(item => item.sid !== streamInfo.mid);
    this.setState({ streams });
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
    // this.peerState && this.peerState.setRequest(uid, request);
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
    const { client, role } = this.props;
    const {
      streams,
      localStream,
      localScreen,
      audioMuted,
      videoMuted,
    } = this.state;
    const id = client ? client.uid : null;
    let videoCount = streams.length;
    if (localStream) videoCount++;
    if (localScreen) videoCount++;

    if (client)
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
          <AppContext.Consumer>
            {context => (
              <Controls
                role={role}
                isMuted={this.state.audioMuted}
                isCameraOn={!this.state.videoMuted}
                screenSharingEnabled={context.roomState.screenSharingEnabled}
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
                hasUnreadMessages={this.props.hasUnreadMessages}
              />
            )}
          </AppContext.Consumer>
        </>
      );
    return <></>;
  };
}
export default Conference;
