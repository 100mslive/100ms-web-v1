import React from 'react';
import {
  Layout,
  Button,
  Modal,
  Icon,
  notification,
  Card,
  Spin,
  Tooltip,
} from 'antd';
const { confirm } = Modal;
const { Header, Content, Sider } = Layout;
import { reactLocalStorage } from 'reactjs-localstorage';
import MediaSettings from './settings';
import ChatFeed from './chat/index';
import Message from './chat/message';
import bLogo from '../public/100ms-logo-on-black.png';
import '../styles/css/app.scss';

import LoginForm from './LoginForm';
import Conference from './Conference';
import {
  Client,
  HMSClient,
  HMSPeer,
  HMSClientConfig,
} from '@100mslive/hmsvideo-web';

async function getToken(env, roomId) {
  const endpoint = process.env.TOKEN_ENDPOINT;
  const { token } = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ room_id: roomId, peer_id: 'demo', env }),
  })
    .then(response => response.json())
    .catch(err => console.log('Error client token: ', err));
  return token;
}

class App extends React.Component {
  constructor() {
    super();
    this.client = null;
    this.state = {
      login: false,
      loading: false,
      localAudioEnabled: true,
      localVideoEnabled: true,
      screenSharingEnabled: false,
      collapsed: true,
      isFullScreen: false,
      vidFit: false,
      loginInfo: {},
      messages: [],
    };

    this._settings = {
      selectedAudioDevice: '',
      selectedVideoDevice: '',
      resolution: 'qvga',
      bandwidth: 256,
      codec: 'vp8',
      frameRate: 20,
      isDevMode: true,
    };

    let settings = reactLocalStorage.getObject('settings');
    if (settings.codec !== undefined) {
      this._settings = { ...this._settings, ...settings };
    }
  }

  _cleanUp = async () => {
    window.history.pushState(
      {},
      '100ms',
      `${window.location.protocol}//${window.location.host}`
    );
    await this.conference.cleanUp();
    await this.client.disconnect();
    this.client = null;
  };

  _notification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: 'bottomRight',
    });
  };

  _createClient = async ({ userName, env = 'staging', roomId }) => {
    let url = `wss://${env}.brytecam.com`;
    let authToken = await getToken(env, roomId);

    console.log(`%cTOKEN IS: ${authToken}`, 'color: orange');

    try {
      let peer = new HMSPeer(userName, authToken);

      let config = new HMSClientConfig({
        endpoint: url,
      });

      return new HMSClient(peer, config);
    } catch (err) {
      console.error('ERROR: ', err);
      alert('Invalid token');
    }
  };

  _handleJoin = async values => {
    this.setState({ loading: true });
    let settings = this._settings;
    this.roomName = values.roomName;
    this.roomId = values.roomId;
    settings.selectedVideoDevice = values.selectedVideoDevice;
    settings.selectedAudioDevice = values.selectedAudioDevice;
    //TODO this should reflect in initialization as well

    this._onMediaSettingsChanged(
      settings.selectedAudioDevice,
      settings.selectedVideoDevice,
      settings.resolution,
      settings.bandwidth,
      settings.codec,
      settings.frameRate,
      settings.isDevMode
    );

    let client = await this._createClient({
      userName: values.displayName,
      env: values.env ? values.env : 'staging',
      roomId: values.roomId,
    });
    client.connect().catch(error => {
      alert(error.message);
    });

    window.onunload = async () => {
      await this._cleanUp();
    };

    client.on('peer-join', (room, peer) => {
      this._notification('Peer Join', `peer => ${peer.name} joined ${room}!`);
    });

    client.on('peer-leave', (room, peer) => {
      this._notification('Peer Leave', `peer => ${peer.name} left ${room}!`);
    });

    client.on('connect', () => {
      console.log('connected!');
      this._handleTransportOpen(values);
    });

    client.on('disconnect', () => {
      console.log('disconnected!');
      this.setState({
        loading: false,
      });
    });

    client.on('stream-add', (room, streamInfo) => {
      console.log('stream-add %s,%s!', room, streamInfo.mid);
    });

    client.on('stream-remove', (room, streamInfo) => {
      console.log(`stream-remove: ${room}, ${streamInfo.mid}`);
    });

    client.on('broadcast', (room, peer, message) => {
      console.log('broadcast: ', room, peer.name, message);
      this._onMessageReceived(peer.name, message);
    });

    this.client = client;
  };

  _handleTransportOpen = async values => {
    reactLocalStorage.remove('loginInfo');
    reactLocalStorage.setObject('loginInfo', values);
    try {
      await this.client.join(values.roomId);
      //TODO ugly hack
      let redirectURL = process.env.INTERNAL
        ? `${window.location.protocol}//${window.location.host}/?room=${values.roomId}&env=${values.env}`
        : `${window.location.protocol}//${window.location.host}/?room=${values.roomId}`;
      window.history.pushState({}, '100ms', redirectURL);
      this.setState({
        login: true,
        loading: false,
        loginInfo: values,
        localVideoEnabled: !values.audioOnly,
        localAudioEnabled: !values.videoOnly,
      });

      this._notification(
        'Connected!',
        'Welcome to the brytecam room => ' + values.roomId
      );
      await this.conference.handleLocalStream(true);
      // this.client.local.transport.pc.getStats().then(console.log)
    } catch (error) {
      console.error('HANDLE THIS ERROR: ', error);
    }
  };

  _handleLeave = async () => {
    let client = this.client;
    let this2 = this;
    confirm({
      title: 'Leave Now?',
      content: 'Do you want to leave the room?',
      async onOk() {
        await this2._cleanUp();
        this2.setState({ login: false });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  _handleAudioTrackEnabled = enabled => {
    this.setState({
      localAudioEnabled: enabled,
    });
    this.conference.muteMediaTrack('audio', enabled);
  };

  _handleVideoTrackEnabled = enabled => {
    this.setState({
      localVideoEnabled: enabled,
    });
    this.conference.muteMediaTrack('video', enabled);
  };

  _handleScreenSharing = enabled => {
    this.setState({
      screenSharingEnabled: enabled,
    });
    this.conference.handleScreenSharing(enabled);
  };

  _onRef = ref => {
    this.conference = ref;
  };

  _openOrCloseLeftContainer = collapsed => {
    this.setState({
      collapsed: collapsed,
    });
  };

  _onVidFitClickHandler = () => {
    this.setState({
      vidFit: !this.state.vidFit,
    });
  };

  _onFullScreenClickHandler = () => {
    let docElm = document.documentElement;

    if (this._fullscreenState()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      this.setState({ isFullScreen: false });
    } else {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }

      this.setState({ isFullScreen: true });
    }
  };

  _fullscreenState = () => {
    return (
      document.fullscreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      false
    );
  };

  _onMediaSettingsChanged = (
    selectedAudioDevice,
    selectedVideoDevice,
    resolution,
    bandwidth,
    codec,
    frameRate,
    isDevMode,
    reloadPage = false
  ) => {
    this._settings = {
      selectedAudioDevice,
      selectedVideoDevice,
      resolution,
      bandwidth,
      codec,
      frameRate,
      isDevMode,
    };
    reactLocalStorage.setObject('settings', this._settings);
    const constraints = {
      frameRate: frameRate,
      bitrate: bandwidth,
      resolution: resolution,
    };
    if (reloadPage) {
      this.client && this.client.applyConstraints(constraints);
    }
  };

  _onMessageReceived = (from, message) => {
    console.log('Received message:' + from + ':' + message);
    let messages = this.state.messages;
    let uid = 1;
    messages.push(new Message({ id: uid, message: message, senderName: from }));
    this.setState({ messages });
  };

  _onSendMessage = data => {
    console.log('Send message:' + data);
    var info = {
      senderName: this.state.loginInfo.displayName,
      msg: data,
    };
    this.client.broadcast(info, this.client.rid);
    let messages = this.state.messages;
    let uid = 0;
    messages.push(new Message({ id: uid, message: data, senderName: 'me' }));
    this.setState({ messages });
  };

  render() {
    const {
      login,
      loading,
      localAudioEnabled,
      localVideoEnabled,
      screenSharingEnabled,
      collapsed,
      vidFit,
    } = this.state;
    return (
      <Layout className="app-layout">
        <Header
          className="app-header"
          style={{
            backgroundColor: '#1a1619',
            zIndex: '10',
            padding: '0 0',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div className="app-header-left">
            <a href="https://100ms.live/" target="_blank">
              <img src={bLogo} className="h-8" />
            </a>
          </div>
          <div className="app-header-right">
            <MediaSettings
              onMediaSettingsChanged={this._onMediaSettingsChanged}
              settings={this._settings}
              isLoggedIn={login}
            />
          </div>
        </Header>

        <Content className="app-center-layout">
          {login ? (
            <Layout className="app-content-layout">
              <Sider
                width={320}
                collapsedWidth={0}
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
                style={{ backgroundColor: '#1a1619' }}
              >
                <div className="left-container">
                  <ChatFeed
                    messages={this.state.messages}
                    onSendMessage={this._onSendMessage}
                  />
                </div>
              </Sider>
              <Layout className="app-right-layout">
                <Content style={{ flex: 1, position: 'relative' }}>
                  <div>
                    <Conference
                      roomName={this.roomName}
                      roomId={this.roomId}
                      collapsed={this.state.collapsed}
                      client={this.client}
                      settings={this._settings}
                      localAudioEnabled={localAudioEnabled}
                      localVideoEnabled={localVideoEnabled}
                      vidFit={vidFit}
                      loginInfo={this.state.loginInfo}
                      ref={ref => {
                        this.conference = ref;
                      }}
                      isScreenSharing={screenSharingEnabled}
                      onScreenToggle={() =>
                        this._handleScreenSharing(!screenSharingEnabled)
                      }
                      onLeave={this._handleLeave}
                      onChatToggle={() =>
                        this._openOrCloseLeftContainer(!collapsed)
                      }
                      isChatOpen={!this.state.collapsed}
                    />
                  </div>
                </Content>
              </Layout>
            </Layout>
          ) : loading ? (
            <Spin size="large" tip="Connecting..." />
          ) : (
            <div className="relative w-full mt-16">
              <LoginForm
                handleLogin={this._handleJoin}
                createClient={this._createClient}
              />
            </div>
          )}
        </Content>
      </Layout>
    );
  }
}

export default App;
