import React, { Component } from 'react';

const AppContext = React.createContext();

class AppContextProvider extends Component {
  state = {
    client: null,
    screen: 'CONFERENCE',
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
          roomState: this.state.roomState,
          setSettings: settings => {
            this.setState({
              settings: { ...this.state.settings, ...settings },
            });
          },
          setLoginInfo: loginInfo => {
            this.setState({
              loginInfo: { ...this.state.loginInfo, ...loginInfo },
            });
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
