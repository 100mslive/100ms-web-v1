import React, { Component }  from 'react';

const AppContext = React.createContext();

class AppContextProvider extends Component {
  state = {
    loginInfo: {
      roomName: '',
      roomId: '',
      displayName: '',
      role: '',
      env: '',
      shouldApplyConstraints: false
    },
    settings: {
      selectedAudioDevice: '',
      selectedVideoDevice: '',
      resolution: 'qvga',
      bandwidth: 256,
      codec: 'vp8',
      frameRate: 20,
      isDevMode: false, 
      shouldApplyConstraints: false
    }
  };
  render() {
    return (
      <AppContext.Provider value={{
        loginInfo: this.state.loginInfo,
        settings: this.state.settings,
        setSettings: settings => {
          this.setState({
            settings: { ...this.state.settings, ...settings }
          })
        },
        setLoginInfo: loginInfo => {
          this.setState({
            loginInfo: loginInfo
          })
        }
      }}>
        { this.props.children } 
      </AppContext.Provider>
    )
  }
};

export { AppContext, AppContextProvider };
