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
  message,
} from 'antd';
const { confirm } = Modal;
const { Header, Content, Sider } = Layout;
import MediaSettings from './settings';
import ChatFeed from './chat/index';
import Message from './chat/message';
import bLogo from '../public/100ms-logo-on-black.png';
import { AppContextProvider, AppContext } from './stores/AppContext';
import '../styles/css/app.scss';

import LoginForm from './LoginForm';
import Conference from './Conference';
import { HMSClient, HMSPeer, HMSClientConfig } from '@100mslive/hmsvideo-web';
import { ENVS, ROLES } from './constants';
import { dependencies } from '../package.json';
import { getRequest } from './utils';

const sdkVersion = dependencies['@100mslive/hmsvideo-web'].substring(1);
console.info(`Using hmsvideo-web SDK version ${sdkVersion}`);

async function getToken({ room_id, user_name, role = 'guest', env }) {
  const endpoint = process.env.TOKEN_ENDPOINT;
  const { token } = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ room_id, user_name, env, role }),
  })
    .then(response => response.json())
    .catch(err => console.log('Error client token: ', err));
  return token;
}

class OldAppUI extends React.Component {
  constructor(props) {
    super(props);
    props.setClient(null);
    props.setRoomState({
      isConnected: false,
    });
    if (!props.settings.codec) {
      props.setSettings({
        selectedAudioDevice: '',
        selectedVideoDevice: '',
        resolution: 'qvga',
        bandwidth: 256,
        codec: 'vp8',
        frameRate: 20,
        isDevMode: true,
      });
    }
  }

  _cleanUp = async () => {
    window.history.pushState(
      {},
      '100ms',
      `${window.location.protocol}//${window.location.host}`
    );
    await this.conference.cleanUp();
    await this.props.client.disconnect();
    this.props.setClient(null);
    this.props.setRoomState({
      isConnected: false,
    });
    this.props.setRoomState({
      login: false,
    });
  };

  _notification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: 'bottomRight',
    });
  };

  _createClient = async ({ userName, env, roomId, role }) => {
    let url = `wss://${env}.${process.env.SFU_HOST || window.location.host}`;
    let authToken = await getToken({
      env,
      room_id: roomId,
      user_name: userName,
      role,
    });

    console.log(`%cTOKEN IS: ${authToken}`, 'color: orange');

    console.log('Websocket URL', url);

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

  _handleJoin = async () => {
    this.props.setRoomState({
      loading: true,
    });
    this.hideMessage = () => {};
    //TODO this should reflect in initialization as well

    ![ROLES.LIVE_RECORD, ROLES.VIEWER].includes(this.role) &&
      this._onMediaSettingsChanged(
        this.props.settings.selectedAudioDevice,
        this.props.settings.selectedVideoDevice,
        this.props.settings.resolution,
        this.props.settings.bandwidth,
        this.props.settings.codec,
        this.props.settings.frameRate,
        this.props.settings.isDevMode
      );

    let client = await this._createClient({
      userName: this.props.loginInfo.displayName,
      env: this.props.loginInfo.env,
      roomId: this.props.loginInfo.roomId,
      role: this.props.loginInfo.role,
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
      console.log('on connect called');
      if (this.props.roomState.isConnected) return;
      console.log('connected!');
      this._handleTransportOpen();
    });

    client.on('disconnect', () => {
      console.log('disconnected!');
      this.props.setRoomState({
        loading: false,
      });
    });

    client.on('stream-add', (room, peer, streamInfo) => {
      console.log(
        'stream-add',
        JSON.stringify({ room, peer, streamInfo }, null, 2)
      );
    });

    client.on('stream-remove', (room, peer, streamInfo) => {
      console.log(
        'stream-remove',
        JSON.stringify({ room, peer, streamInfo }, null, 2)
      );
    });

    client.on('broadcast', (room, peer, message) => {
      console.log('broadcast: ', room, peer.name, message);
      this._onMessageReceived(peer.name, message);
    });

    client.on('disconnected', async () => {
      console.log(`%c[APP] TEARING DOWN`, 'color:#fc0');
      location.reload();
    });

    this.props.setClient(client);
  };

  _handleTransportOpen = async () => {
    this.props.setRoomState({
      isConnected: true,
    });
    try {
      await this.props.client.join(this.props.loginInfo.roomId).catch(error => {
        console.log('JOIN ERROR:', error);
      });
      let redirectURL = `${window.location.protocol}//${window.location.host}/?room=${this.props.loginInfo.roomId}&env=${this.props.loginInfo.env}&role=${this.props.loginInfo.role}`;

      window.history.pushState({}, '100ms', redirectURL);

      this.props.setRoomState({
        login: true,
        loading: false,
      });

      this._notification(
        'Connected!',
        `Welcome to the ${this.props.loginInfo.roomName || '100ms'} room => ${
          this.props.loginInfo.roomId
        }`
      );

      // Local video & audio are disabled for the 'live-record'
      // and 'viewer' roles. Their local stream is also not published.
      if (
        ![ROLES.LIVE_RECORD, ROLES.VIEWER].includes(this.props.loginInfo.role)
      ) {
        await this.conference.handleLocalStream();
      }
    } catch (error) {
      console.error('HANDLE THIS ERROR: ', error);
    }
  };

  _handleLeave = async () => {
    let this2 = this;
    confirm({
      title: 'Leave Now?',
      content: 'Do you want to leave the room?',
      async onOk() {
        await this2._cleanUp();
        this2.props.setRoomState({ login: false });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  _handleAudioTrackEnabled = enabled => {
    this.props.setRoomState({
      localAudioEnabled: enabled,
    });
    this.conference.muteMediaTrack('audio', enabled);
  };

  _handleVideoTrackEnabled = enabled => {
    this.props.setRoomState({
      localVideoEnabled: enabled,
    });
    this.conference.muteMediaTrack('video', enabled);
  };

  _handleScreenSharing = enabled => {
    this.props.setRoomState({
      screenSharingEnabled: enabled,
    });
    this.conference.handleScreenSharing(enabled);
  };

  _onRef = ref => {
    this.conference = ref;
  };

  _openOrCloseLeftContainer = collapsed => {
    this.props.setRoomState({
      collapsed: collapsed,
    });
  };

  _onVidFitClickHandler = () => {
    this.props.setRoomState({
      vidFit: !this.props.roomState.vidFit,
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

      this.props.setRoomState({ isFullScreen: false });
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

      this.props.setRoomState({ isFullScreen: true });
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
    this.props.setSettings({
      selectedAudioDevice,
      selectedVideoDevice,
      resolution,
      bandwidth,
      codec,
      frameRate,
      isDevMode,
    });
    const constraints = {
      frameRate: frameRate,
      bitrate: bandwidth,
      resolution: resolution,
      advancedMediaConstraints: {
        audio: {
          deviceId: selectedAudioDevice,
        },
        video: {
          deviceId: selectedVideoDevice,
        },
      },
    };
    if (reloadPage) {
      this.props.client &&
        this.props.client.applyConstraints(
          constraints,
          this.props.client.local
        );
    }
  };

  _onMessageReceived = (from, message) => {
    console.log('Received message:' + from + ':' + message);
    let messages = this.props.roomState.messages;
    let uid = 1;
    messages.push(new Message({ id: uid, message: message, senderName: from }));
    let hasUnreadMessages = false;
    if (this.props.roomState.collapsed) {
      hasUnreadMessages = true;
    }
    this.props.setRoomState({ messages, hasUnreadMessages });
  };

  _onSendMessage = data => {
    console.log('Send message:' + data);
    var info = {
      senderName: this.props.loginInfo.displayName,
      msg: data,
    };
    this.props.client.broadcast(info, this.props.client.rid);
    let messages = this.props.roomState.messages;
    let uid = 0;
    messages.push(new Message({ id: uid, message: data, senderName: 'me' }));
    this.props.setRoomState({ messages });
  };

  isValidParams() {
    const validRoomPattern = /^[a-zA-Z0-9-.:_]*$/g;
    const validRoles = Object.values(ROLES);
    const validEnvs = Object.values(ENVS);
    try {
      const params = getRequest();

      if (params.role && !validRoles.includes(params.role.toLowerCase())) {
        return [false, 'Role'];
      } else if (params.env && !validEnvs.includes(params.env.toLowerCase())) {
        return [false, 'environment'];
      } else if (params.room && !validRoomPattern.test(params.room)) {
        return [false, 'Room ID'];
      } else {
        return [true, null];
      }
    } catch (error) {
      if (error instanceof URIError) {
        return [false, 'URL'];
      }
    }
  }

  render() {
    const {
      login,
      loading,
      localAudioEnabled,
      localVideoEnabled,
      screenSharingEnabled,
      collapsed,
      vidFit,
    } = this.props.roomState;

    const isValidParams = this.isValidParams()[0];

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
              settings={this.props.settings}
              isLoggedIn={login}
            />
          </div>
        </Header>

        <Content className="app-center-layout">
          {!isValidParams ? (
            <div
              className="min-h-screen flex items-center justify-center w-full py-8 px-4 sm:px-6 lg:px-8"
              style={{ backgroundColor: '#1a1619' }}
            >
              <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100">
                <div className="">
                  <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    100ms Conference
                  </h2>

                  <p className="mt-2 text-center text-sm leading-5 text-gray-600 mb-2">
                    The requested {this.isValidParams()[1]} is invalid. Please
                    verify your credentials.
                  </p>

                  <button
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150 ease-in-out"
                    onClick={() => {
                      this._cleanUp();
                      location.reload();
                    }}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          ) : login ? (
            <Layout className="app-content-layout">
              <Sider
                width={320}
                collapsedWidth={0}
                trigger={null}
                collapsible
                collapsed={this.props.roomState.collapsed}
                style={{ backgroundColor: '#1a1619' }}
              >
                <div className="left-container">
                  <ChatFeed
                    messages={this.props.roomState.messages}
                    onSendMessage={this._onSendMessage}
                    onClose={() => this._openOrCloseLeftContainer(!collapsed)}
                  />
                </div>
              </Sider>
              <Layout className="app-right-layout">
                <Content style={{ flex: 1, position: 'relative' }}>
                  <div>
                    <AppContext.Consumer>
                      {context => (
                        <Conference
                          roomName={this.props.loginInfo.roomName}
                          roomId={this.props.loginInfo.roomId}
                          collapsed={this.props.roomState.collapsed}
                          client={context.client}
                          settings={context.settings}
                          localAudioEnabled={localAudioEnabled}
                          localVideoEnabled={localVideoEnabled}
                          vidFit={vidFit}
                          loginInfo={this.props.loginInfo}
                          ref={ref => {
                            this.conference = ref;
                          }}
                          onScreenToggle={() =>
                            this._handleScreenSharing(!screenSharingEnabled)
                          }
                          onLeave={this._handleLeave}
                          onChatToggle={() => {
                            console.log("COLLAPSED", collapsed)
                            if (collapsed) {
                              this.props.setRoomState({
                                hasUnreadMessages: false,
                              });
                            }
                            this._openOrCloseLeftContainer(!collapsed);
                          }}
                          isChatOpen={!this.props.roomState.collapsed}
                          cleanUp={this._cleanUp}
                          role={this.props.loginInfo.role}
                          hasUnreadMessages={
                            this.props.roomState.hasUnreadMessages
                          }
                        />
                      )}
                    </AppContext.Consumer>
                  </div>
                </Content>
              </Layout>
            </Layout>
          ) : loading ? (
            <Spin size="large" tip="Connecting..." />
          ) : (
            <div className="relative w-full mt-16">
              <AppContext.Consumer>
                {context => (
                  <LoginForm
                    settings={context.settings}
                    loginInfo={context.loginInfo}
                    setSettings={context.setSettings}
                    setLoginInfo={context.setLoginInfo}
                    handleLogin={this._handleJoin}
                    createClient={this._createClient}
                    client={context.client}
                    setClient={context.setClient}
                    roomState={context.roomState}
                    setRoomState={context.setRoomState}
                  />
                )}
              </AppContext.Consumer>
            </div>
          )}
        </Content>
      </Layout>
    );
  }
}

class OldApp extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <OldAppUI
            settings={context.settings}
            roomState={context.roomState}
            loginInfo={context.loginInfo}
            setSettings={context.setSettings}
            setLoginInfo={context.setLoginInfo}
            setRoomState={context.setRoomState}
            setClient={context.setClient}
            client={context.client}
          />
        )}
      </AppContext.Consumer>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <AppContextProvider>
        <OldApp />
      </AppContextProvider>
    );
  }
}

export default App;
