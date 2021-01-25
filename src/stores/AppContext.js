import React, { Component } from 'react';
import { getLocalStreamException } from '../utils';

const AppContext = React.createContext();

class AppContextProvider extends Component {
  state = {
    client: null,
    localStreamError: null,
    loginInfo: {
      roomName: '',
      roomId: '',
      displayName: '',
      role: '',
      env: '',
    },
    settings: {
      selectedAudioDevice: '',
      selectedVideoDevice: '',
      resolution: 'qvga',
      bandwidth: 256,
      codec: 'vp8',
      frameRate: 20,
      isDevMode: false,
      shouldApplyConstraints: false,
    },
    roomState: {
      isConnected: false,
      login: false,
      loading: false,
      localAudioEnabled: true,
      localVideoEnabled: true,
      screenSharingEnabled: false,
      collapsed: true,
      isFullScreen: false,
      vidFit: false,
      messages: [],
      hasUnreadMessages: false,
    },
  };
  render() {
    return (
      <AppContext.Provider
        value={{
          loginInfo: this.state.loginInfo,
          settings: this.state.settings,
          client: this.state.client,
          localStreamError: this.state.localStreamError,
          roomState: this.state.roomState,
          setLocalStreamError: error => {
            this.setState({ localStreamError: getLocalStreamException(error) });
          },
          setSettings: (settings, cb) => {
            this.setState(
              {
                settings: { ...this.state.settings, ...settings },
              },
              () => {
                cb && cb();
              }
            );
          },
          setLoginInfo: loginInfo => {
            this.setState({
              loginInfo: { ...this.state.loginInfo, ...loginInfo },
            });
            if (loginInfo.displayName) {
              localStorage.setItem(
                'loginInfo.displayName',
                loginInfo.displayName
              );
            }
          },
          setClient: client => {
            this.setState({
              client: client,
            });
          },
          setRoomState: roomState => {
            this.setState({
              roomState: { ...this.state.roomState, ...roomState },
            });
          },
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppContext, AppContextProvider };
