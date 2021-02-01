exports.ids = [8];
exports.modules = {

/***/ "X7BR":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ROLES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ENVS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return envMapping; });
const ROLES = {
  HOST: 'host',
  GUEST: 'guest',
  LIVE_RECORD: 'live-record',
  VIEWER: 'viewer'
};
const ENVS = {
  QA: 'qa-in',
  PROD: 'prod-in',
  STAGING: 'staging-in',
  DEV3: 'dev3-in'
};
const envMapping = {
  'staging-in': 'STAGING_IN',
  'qa-in': 'QA_IN',
  'dev3-in': 'QA_IN',
  'prod-in': 'PROD_IN'
};

/***/ }),

/***/ "kiQV":
/***/ (function(module) {

module.exports = JSON.parse("{\"a\":{\"@100mslive/hmsvideo-web\":\"^0.9.14\",\"@material-ui/core\":\"^4.11.0\",\"antd\":\"^3.26.16\",\"axios\":\"^0.21.1\",\"babel-plugin-add-react-displayname\":\"0.0.5\",\"bowser\":\"^2.11.0\",\"copy-webpack-plugin\":\"^5.0.5\",\"dotenv\":\"^8.2.0\",\"formik\":\"^2.1.7\",\"jsonwebtoken\":\"^8.5.1\",\"mdi-react\":\"^6.4.0\",\"next\":\"^10.0.5\",\"react\":\"^16.13.1\",\"react-container-dimensions\":\"^1.4.1\",\"react-dom\":\"^16.13.1\",\"react-mdi\":\"^0.5.7\",\"react-router\":\"^5.0.1\",\"rect-scaler\":\"^1.0.0\",\"uuid4\":\"^2.0.2\"}}");

/***/ }),

/***/ "xYwX":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__("cDcd");
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);

// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__("Exp3");

// EXTERNAL MODULE: external "@material-ui/core/InputLabel"
var InputLabel_ = __webpack_require__("zOcm");
var InputLabel_default = /*#__PURE__*/__webpack_require__.n(InputLabel_);

// EXTERNAL MODULE: external "@material-ui/core/MenuItem"
var MenuItem_ = __webpack_require__("x54t");
var MenuItem_default = /*#__PURE__*/__webpack_require__.n(MenuItem_);

// EXTERNAL MODULE: external "@material-ui/core/FormControl"
var FormControl_ = __webpack_require__("lWoh");
var FormControl_default = /*#__PURE__*/__webpack_require__.n(FormControl_);

// EXTERNAL MODULE: external "@material-ui/core/Select"
var Select_ = __webpack_require__("OdWO");
var Select_default = /*#__PURE__*/__webpack_require__.n(Select_);

// EXTERNAL MODULE: external "bowser"
var external_bowser_ = __webpack_require__("Ai3W");
var external_bowser_default = /*#__PURE__*/__webpack_require__.n(external_bowser_);

// CONCATENATED MODULE: ./src/utils/index.js
var __jsx = external_react_default.a.createElement;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }








const closeMediaStream = function (stream) {
  if (!stream) {
    return;
  }

  if (MediaStreamTrack && MediaStreamTrack.prototype && MediaStreamTrack.prototype.stop) {
    var tracks, i, len;

    if (stream.getTracks) {
      tracks = stream.getTracks();

      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    } else {
      tracks = stream.getAudioTracks();

      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }

      tracks = stream.getVideoTracks();

      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    } // Deprecated by the spec, but still in use.

  } else if (typeof stream.stop === 'function') {
    console.log('closeMediaStream() | calling stop() on the MediaStream');
    stream.stop();
  }
}; // Attach a media stream to an element.


const attachMediaStream = function (element, stream) {
  element.srcObject = stream;
};

const updateInputDevices = () => {
  return new Promise((pResolve, pReject) => {
    let videoDevices = [];
    let audioDevices = [];
    let audioOutputDevices = [];
    navigator.mediaDevices.enumerateDevices().then(devices => {
      for (let device of devices) {
        if (device.kind === 'videoinput') {
          videoDevices.push(device);
        } else if (device.kind === 'audioinput') {
          audioDevices.push(device);
        } else if (device.kind === 'audiooutput') {
          audioOutputDevices.push(device);
        }
      }
    }).then(() => {
      let data = {
        videoDevices,
        audioDevices,
        audioOutputDevices
      };
      pResolve(data);
    });
  });
};

const SingleSelect = (_ref) => {
  let {
    field,
    form
  } = _ref,
      props = _objectWithoutProperties(_ref, ["field", "form"]);

  //TODO specific input for devices
  const {
    name,
    label
  } = field;
  const {
    options,
    updateDevice
  } = props;
  const {
    setFieldValue
  } = form;
  return __jsx(FormControl_default.a, {
    variant: "outlined"
  }, __jsx(InputLabel_default.a, {
    id: "demo-simple-select-outlined-label"
  }, label), __jsx(Select_default.a, {
    labelId: "demo-simple-select-outlined-label",
    id: "demo-simple-select-outlined",
    value: form.values[name],
    label: label,
    renderValue: value => options.find(device => device.deviceId === value).label
  }, options && options.map((option, index) => __jsx("div", {
    onClick: e => {
      e.preventDefault();
      setFieldValue(name, option.deviceId);
      updateDevice(name, option.deviceId);
    },
    key: index
  }, __jsx(MenuItem_default.a, {
    key: index,
    value: option.deviceId
  }, option.label)))));
};

const getRequest = () => {
  let url = location.search;
  let theRequest = new Object();

  if (url.indexOf('?') != -1) {
    let str = url.substr(1);
    let strs = str.split('&');

    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
  }

  return theRequest;
};

const deviceSupport = () => {
  const browser = external_bowser_default.a.getParser(window.navigator.userAgent);

  if (browser.getOS().name == 'iOS') {
    return {
      supported: false,
      failureCause: 'iOS'
    };
  } else if (browser.getBrowserName() != 'Chrome') {
    return {
      supported: false,
      failureCause: 'browser'
    };
  }

  return {
    supported: true,
    failureCause: null
  }; //TODO replace with firebase

  const isValidBrowser = browser.satisfies({
    //TODO add precise versions after checking with browserstack
    windows: {
      'internet explorer': '>10',
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44'
    },
    linux: {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44'
    },
    macos: {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44'
    },
    ios: {
      safari: '>9999',
      firefox: '>9999',
      opera: '>9999',
      chrome: '>9999'
    },
    android: {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44'
    },
    'Chrome OS': {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44'
    }
  });
  return isValidBrowser;
};

let localStreamErrors = new Map(); //required track is missing

localStreamErrors.set('NotFoundError', {
  title: 'Camera/Microphone not detected!',
  message: 'We were unable to detect any camera/microphone devices. Please connect and try again.'
}); //webcam or mic are already in use

localStreamErrors.set('NotReadableError', {
  title: 'Camera/Microphone not accessible!',
  message: 'Please close any other application using camera/microphone and try again.'
}); //constraints can not be satisfied by avb. devices

localStreamErrors.set('OverconstrainedError', {
  title: 'Invalid Audio/Video constraints',
  message: 'The constraints provided for audio/video cannot be met.'
}); //permission denied in browser

localStreamErrors.set('NotAllowedError', {
  title: 'Permission Denied!',
  message: 'Please grant camera/microphone permissions in the address bar or site settings and try again.'
}); // returning null continues the call without error modal.

localStreamErrors.set('TypeError', null);

const getLocalStreamException = error => {
  let errorMessage = null;

  if (localStreamErrors.has(error.name)) {
    errorMessage = localStreamErrors.get(error.name);
  } else {
    //other errors
    errorMessage = {
      title: 'Unable to access camera/microphone!',
      message: 'Please switch your device and try again.'
    };
  }

  console.log('LocalStream error: ', _objectSpread({
    error: error.name
  }, errorMessage));
  return errorMessage;
};

const getUserMedia = constraints => {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  } // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.


  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface

      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      } // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise


      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  } else {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
};

function getPermissionStatus() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const audio = devices.some(val => val.kind === 'audioinput' && val.label !== '');
      const video = devices.some(val => val.kind === 'videoinput' && val.label !== '');

      if (audio && video) {
        resolve(true);
      }

      reject();
    }).catch(err => reject(error));
  });
}


// CONCATENATED MODULE: ./src/components/Settings/soundmeter.js
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 // Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.

class SoundMeter {
  constructor(context) {
    this.context = context;
    this.instant = 0.0; //this.slow = 0.0;
    //this.clip = 0.0;

    this.script = context.createScriptProcessor(2048, 1, 1);
    var that = this;

    this.script.onaudioprocess = function (event) {
      var input = event.inputBuffer.getChannelData(0);
      var i;
      var sum = 0.0;
      var clipcount = 0;

      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];

        if (Math.abs(input[i]) > 0.99) {
          clipcount += 1;
        }
      }

      that.instant = Math.sqrt(sum / input.length); //that.slow = 0.95 * that.slow + 0.05 * that.instant;
      //that.clip = clipcount / input.length;
    };
  }

  connectToSource(stream) {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script); // necessary to make sample run, but should not be.

    this.script.connect(this.context.destination);
  }

  stop() {
    this.mic.disconnect();
    this.script.disconnect();
  }

}
// CONCATENATED MODULE: ./src/components/Settings/index.js
var Settings_jsx = external_react_default.a.createElement;

function Settings_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function Settings_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Settings_ownKeys(Object(source), true).forEach(function (key) { Settings_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Settings_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Settings_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const Option = external_antd_["Select"].Option;
class Settings_MediaSettings extends external_react_default.a.Component {
  constructor(props) {
    super(props);

    Settings_defineProperty(this, "setDeviceState", () => {
      updateInputDevices().then(data => {
        if (this.state.selectedAudioDevice === '' && data.audioDevices.length > 0) {
          this.setState({
            selectedAudioDevice: data.audioDevices[0].deviceId
          });
        }

        if (this.state.selectedVideoDevice === '' && data.videoDevices.length > 0) {
          this.setState({
            selectedVideoDevice: data.videoDevices[0].deviceId
          });
        }

        this.setState({
          videoDevices: data.videoDevices,
          audioDevices: data.audioDevices,
          audioOutputDevices: data.audioOutputDevices
        });
        this.state.audioDevices.map((device, index) => {
          if (this.state.selectedAudioDevice == device.deviceId) {
            console.log('Selected audioDevice::' + JSON.stringify(device));
          }
        });
        this.state.videoDevices.map((device, index) => {
          if (this.state.selectedVideoDevice == device.deviceId) {
            console.log('Selected videoDevice::' + JSON.stringify(device));
          }
        });
      });
    });

    Settings_defineProperty(this, "soundMeterProcess", () => {
      var val = window.soundMeter.instant.toFixed(2) * 348 + 1;
      this.setState({
        audioLevel: val
      });
      if (this.state.visible) setTimeout(this.soundMeterProcess, 100);
    });

    Settings_defineProperty(this, "startPreview", () => {
      if (window.stream) {
        closeMediaStream(window.stream);
      }

      let videoElement = this.refs['previewVideo'];
      let audioSource = this.state.selectedAudioDevice;
      let videoSource = this.state.selectedVideoDevice;
      this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
      let soundMeterProcess = this.soundMeterProcess;
      let constraints = {
        audio: {
          deviceId: audioSource ? {
            exact: audioSource
          } : undefined
        },
        video: {
          deviceId: videoSource ? {
            exact: videoSource
          } : undefined
        }
      };
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        window.stream = stream; // make stream available to console
        //videoElement.srcObject = stream;

        attachMediaStream(videoElement, stream);
        soundMeter.connectToSource(stream);
        setTimeout(soundMeterProcess, 100);
        this.setDeviceState();
      }).catch(error => {
        this.props.setLocalStreamError(error);
      });
    });

    Settings_defineProperty(this, "stopPreview", () => {
      if (window.stream) {
        closeMediaStream(window.stream);
      }
    });

    Settings_defineProperty(this, "showModal", () => {
      this.setState({
        visible: true
      });
      setTimeout(this.startPreview, 100);
    });

    Settings_defineProperty(this, "handleOk", e => {
      this.setState({
        visible: false
      });
      this.stopPreview();

      if (this.props.onMediaSettingsChanged !== undefined) {
        this.props.onMediaSettingsChanged(this.state.selectedAudioDevice, this.state.selectedVideoDevice, this.state.resolution, this.state.bandwidth, this.state.codec, this.state.frameRate, this.state.isDevMode, true);
      }
    });

    Settings_defineProperty(this, "handleCancel", e => {
      let settings = this.props.settings;
      this.setState(Settings_objectSpread(Settings_objectSpread({}, settings), {}, {
        visible: false
      }));
      this.stopPreview();
    });

    Settings_defineProperty(this, "handleAudioDeviceChange", e => {
      this.setState({
        selectedAudioDevice: e
      });
      setTimeout(this.startPreview, 100);
    });

    Settings_defineProperty(this, "handleVideoDeviceChange", e => {
      this.setState({
        selectedVideoDevice: e
      });
      setTimeout(this.startPreview, 100);
    });

    Settings_defineProperty(this, "handleResolutionChange", e => {
      this.setState({
        resolution: e
      });
    });

    Settings_defineProperty(this, "handleVideoCodeChange", e => {
      this.setState({
        codec: e
      });
    });

    Settings_defineProperty(this, "handleBandWidthChange", e => {
      this.setState({
        bandwidth: e
      });
    });

    Settings_defineProperty(this, "handleFrameRateChange", e => {
      this.setState({
        frameRate: e
      });
    });

    Settings_defineProperty(this, "handleDevChange", checked => {
      this.setState({
        isDevMode: checked
      });
    });

    let _settings = props.settings;
    this.state = {
      visible: false,
      videoDevices: [],
      audioDevices: [],
      audioOutputDevices: [],
      resolution: _settings.resolution,
      bandwidth: _settings.bandwidth,
      selectedAudioDevice: _settings.selectedAudioDevice,
      selectedVideoDevice: _settings.selectedVideoDevice,
      codec: _settings.codec,
      isDevMode: _settings.isDevMode,
      frameRate: _settings.frameRate
    };

    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.audioContext = new AudioContext();
    } catch (e) {
      console.log('Web Audio API not supported.');
    }
  }

  componentDidMount() {
    this.setDeviceState();
  }

  componentWillUnmount() {}

  render() {
    return Settings_jsx("div", null, Settings_jsx(external_antd_["Tooltip"], {
      title: "System setup"
    }, Settings_jsx(external_antd_["Button"], {
      shape: "circle",
      icon: "setting",
      ghost: true,
      onClick: this.showModal
    })), Settings_jsx(external_antd_["Modal"], {
      title: "Settings",
      visible: this.state.visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      okText: "Ok",
      cancelText: "Cancel"
    }, Settings_jsx("div", {
      className: "settings-item"
    }, Settings_jsx("span", {
      className: "settings-item-left"
    }, "Micphone"), Settings_jsx("div", {
      className: "settings-item-right"
    }, Settings_jsx(external_antd_["Select"], {
      value: this.state.selectedAudioDevice,
      style: {
        width: 350
      },
      onChange: this.handleAudioDeviceChange
    }, this.state.audioDevices.map((device, index) => {
      return Settings_jsx(Option, {
        value: device.deviceId,
        key: device.deviceId
      }, device.label);
    })), Settings_jsx("div", {
      ref: "progressbar",
      style: {
        width: this.state.audioLevel + 'px',
        height: '10px',
        backgroundColor: '#8dc63f',
        marginTop: '20px'
      }
    }))), Settings_jsx("div", {
      className: "settings-item"
    }, Settings_jsx("span", {
      className: "settings-item-left"
    }, "Camera"), Settings_jsx("div", {
      className: "settings-item-right"
    }, Settings_jsx(external_antd_["Select"], {
      value: this.state.selectedVideoDevice,
      style: {
        width: 350
      },
      onChange: this.handleVideoDeviceChange
    }, this.state.videoDevices.map((device, index) => {
      return Settings_jsx(Option, {
        value: device.deviceId,
        key: device.deviceId
      }, device.label);
    })), Settings_jsx("div", {
      className: "settings-video-container"
    }, Settings_jsx("video", {
      id: "previewVideo",
      ref: "previewVideo",
      autoPlay: true,
      playsInline: true,
      muted: true,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    })))), Settings_jsx("div", {
      className: "settings-item"
    }, Settings_jsx("span", {
      className: "settings-item-left"
    }, "Resolution"), Settings_jsx("div", {
      className: "settings-item-right"
    }, Settings_jsx(external_antd_["Select"], {
      style: {
        width: 350
      },
      value: this.state.resolution,
      onChange: this.handleResolutionChange
    }, Settings_jsx(Option, {
      value: "qqvga"
    }, "QQVGA(160x90)"), Settings_jsx(Option, {
      value: "qvga"
    }, "QVGA(320x180)"), Settings_jsx(Option, {
      value: "vga"
    }, "VGA(640x360)"), Settings_jsx(Option, {
      value: "shd"
    }, "SHD(960x540)"), Settings_jsx(Option, {
      value: "hd"
    }, "HD(1280x720)")))), !this.props.isLoggedIn && Settings_jsx("div", {
      className: "settings-item"
    }, Settings_jsx("span", {
      className: "settings-item-left"
    }, "Codec"), Settings_jsx("div", {
      className: "settings-item-right"
    }, Settings_jsx(external_antd_["Select"], {
      style: {
        width: 350
      },
      value: this.state.codec,
      onChange: this.handleVideoCodeChange
    }, Settings_jsx(Option, {
      value: "h264"
    }, "H264"), Settings_jsx(Option, {
      value: "vp8"
    }, "VP8"), Settings_jsx(Option, {
      value: "vp9"
    }, "VP9")))), Settings_jsx("div", {
      className: "settings-item"
    }, Settings_jsx("span", {
      className: "settings-item-left"
    }, "Bitrate"), Settings_jsx("div", {
      className: "settings-item-right"
    }, Settings_jsx(external_antd_["Select"], {
      style: {
        width: 350
      },
      value: this.state.bandwidth,
      onChange: this.handleBandWidthChange
    }, Settings_jsx(Option, {
      value: "100"
    }, "Lowest(100kbps)"), Settings_jsx(Option, {
      value: "256"
    }, "Low(256kbps)"), Settings_jsx(Option, {
      value: "512"
    }, "Medium(512kbps)"), Settings_jsx(Option, {
      value: "1024"
    }, "High(1Mbps)"), Settings_jsx(Option, {
      value: "4096"
    }, "Lan(4Mbps)")))), Settings_jsx("div", {
      className: "settings-item"
    }, Settings_jsx("span", {
      className: "settings-item-left"
    }, "Frame Rate"), Settings_jsx("div", {
      className: "settings-item-right"
    }, Settings_jsx(external_antd_["InputNumber"], {
      min: 1,
      max: 30,
      defaultValue: this.state.frameRate,
      onChange: this.handleFrameRateChange
    })))));
  }

}
// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__("faye");
var external_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_react_dom_);

// EXTERNAL MODULE: external "mdi-react/UserIcon"
var UserIcon_ = __webpack_require__("QuFg");
var UserIcon_default = /*#__PURE__*/__webpack_require__.n(UserIcon_);

// CONCATENATED MODULE: ./src/components/Chat/chatbubble.js
var chatbubble_jsx = external_react_default.a.createElement;



class chatbubble_ChatBubble extends external_react_["Component"] {
  constructor(props) {
    super();
    this.state = {
      message: props.message
    };
  }

  componentDidMount() {}

  render() {
    if (this.props.message.id == 1) {
      return chatbubble_jsx("div", {
        className: "bubble-left"
      }, chatbubble_jsx("div", {
        className: "bubble-head"
      }, chatbubble_jsx(external_antd_["Icon"], {
        component: UserIcon_default.a
      })), chatbubble_jsx("div", {
        className: "bubble-msg"
      }, chatbubble_jsx("p", {
        className: "sender-name"
      }, this.props.message.senderName), chatbubble_jsx("div", {
        className: "bubble-msgword"
      }, chatbubble_jsx("p", {
        className: "pl"
      }, this.props.message.message))));
    } else if (this.props.message.id == 0) {
      return chatbubble_jsx("div", {
        className: "bubble-right"
      }, chatbubble_jsx("div", {
        className: "bubble-msg"
      }, chatbubble_jsx("p", {
        style: {
          textAlign: 'right'
        },
        className: "sender-name"
      }, this.props.message.senderName), chatbubble_jsx("div", {
        className: "bubble-msgword"
      }, chatbubble_jsx("p", {
        className: "pr"
      }, this.props.message.message))), chatbubble_jsx("div", {
        className: "bubble-head"
      }, chatbubble_jsx(external_antd_["Icon"], {
        component: UserIcon_default.a
      })));
    } else if (this.props.message.id == 2) {
      return chatbubble_jsx("div", {
        className: "bubble-middle"
      }, chatbubble_jsx("div", {
        className: "bubble-msg"
      }, chatbubble_jsx("div", {
        className: "bubble-msgword-middle"
      }, chatbubble_jsx("p", {
        className: "pm"
      }, this.props.message.message))));
    }
  }

}
// CONCATENATED MODULE: ./src/components/Chat/chatinput.js
var chatinput_jsx = external_react_default.a.createElement;

function chatinput_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class chatinput_ChatInput extends external_react_["Component"] {
  constructor(props) {
    super(props);

    chatinput_defineProperty(this, "onInputChange", event => {
      this.setState({
        inputMessage: event.target.value
      });
    });

    chatinput_defineProperty(this, "onBtnSendHandler", event => {
      this.sendMessage();
    });

    chatinput_defineProperty(this, "onInputKeyUp", event => {
      if (event.keyCode == 13) {
        this.sendMessage();
      }
    });

    chatinput_defineProperty(this, "sendMessage", () => {
      let msg = this.state.inputMessage;

      if (msg.length === 0) {
        return;
      }

      if (msg.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
        return;
      }

      this.props.onSendMessage(msg);
      this.setState({
        inputMessage: ''
      });
    });

    this.state = {
      inputMessage: ''
    };
  }

  render() {
    return chatinput_jsx("div", {
      className: "chat-input"
    }, chatinput_jsx(external_antd_["Input"], {
      placeholder: "Please input message",
      onChange: this.onInputChange,
      onPressEnter: this.onInputKeyUp,
      value: this.state.inputMessage
    }), chatinput_jsx(external_antd_["Button"], {
      style: {
        marginLeft: '4px'
      },
      icon: "message",
      onClick: this.onBtnSendHandler
    }));
  }

}
// CONCATENATED MODULE: ./src/components/Chat/index.js
var Chat_jsx = external_react_default.a.createElement;




class Chat_ChatFeed extends external_react_["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages || []
    };
  }

  _scrollToBottom() {
    const {
      chat
    } = this.refs;

    if (chat !== undefined) {
      const scrollHeight = chat.scrollHeight;
      const height = chat.clientHeight;
      const maxScrollTop = scrollHeight - height;
      external_react_dom_default.a.findDOMNode(chat).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }

  _renderGroup(messages, index, id) {
    var group = [];

    for (var i = index; messages[i] ? messages[i].id == id : false; i--) {
      group.push(messages[i]);
    }

    var message_nodes = group.reverse().map((curr, index) => {
      return Chat_jsx(chatbubble_ChatBubble, {
        key: Math.random().toString(36),
        message: curr
      });
    });
    return Chat_jsx("div", {
      key: Math.random().toString(36),
      className: "chatbubble-wrapper"
    }, message_nodes);
  }

  _renderMessages(messages) {
    var message_nodes = messages.map((curr, index) => {
      // Find diff in message type or no more messages
      if ((messages[index + 1] ? false : true) || messages[index + 1].id != curr.id) {
        return this._renderGroup(messages, index, curr.id);
      }
    }); // return nodes

    return message_nodes;
  }

  render() {
    window.setTimeout(() => {
      this._scrollToBottom();
    }, 10);
    const messages = [{
      id: 0,
      message: 'hello every one',
      senderName: 'kevin kang'
    }];
    return Chat_jsx("div", {
      id: "chat-panel",
      className: "flex flex-1 flex-col max-h-full",
      style: {
        backgroundColor: '#000000'
      }
    }, Chat_jsx("div", {
      className: "border-b border-gray-800 h-10 flex items-center justify-between pr-3"
    }, Chat_jsx("span", {
      className: "title-chat"
    }, "Chat"), Chat_jsx("button", {
      className: "text-white text-xl",
      onClick: this.props.onClose
    }, "\xD7")), Chat_jsx("div", {
      ref: "chat",
      className: "chat-history"
    }, Chat_jsx("div", null, this._renderMessages(this.props.messages))), Chat_jsx(chatinput_ChatInput, {
      onSendMessage: this.props.onSendMessage
    }));
  }

}
// CONCATENATED MODULE: ./src/components/Chat/message.js
class Message {
  constructor(messageData) {
    this.id = messageData.id;
    this.message = messageData.message;
    this.senderName = messageData.senderName || undefined;
  }

}
// CONCATENATED MODULE: ./src/stores/AppContext.js
var AppContext_jsx = external_react_default.a.createElement;

function AppContext_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function AppContext_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { AppContext_ownKeys(Object(source), true).forEach(function (key) { AppContext_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { AppContext_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function AppContext_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const AppContext = /*#__PURE__*/external_react_default.a.createContext();

class AppContext_AppContextProvider extends external_react_["Component"] {
  constructor(...args) {
    super(...args);

    AppContext_defineProperty(this, "state", {
      client: null,
      localStreamError: null,
      loginInfo: {
        roomName: '',
        roomId: '',
        displayName: '',
        role: '',
        env: ''
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
        hasUnreadMessages: false
      }
    });
  }

  render() {
    return AppContext_jsx(AppContext.Provider, {
      value: {
        loginInfo: this.state.loginInfo,
        settings: this.state.settings,
        client: this.state.client,
        localStreamError: this.state.localStreamError,
        roomState: this.state.roomState,
        setLocalStreamError: error => {
          this.setState({
            localStreamError: getLocalStreamException(error)
          });
        },
        setSettings: (settings, cb) => {
          this.setState({
            settings: AppContext_objectSpread(AppContext_objectSpread({}, this.state.settings), settings)
          }, () => {
            cb && cb();
          });
        },
        setLoginInfo: loginInfo => {
          this.setState({
            loginInfo: AppContext_objectSpread(AppContext_objectSpread({}, this.state.loginInfo), loginInfo)
          });

          if (loginInfo.displayName) {
            localStorage.setItem('loginInfo.displayName', loginInfo.displayName);
          }
        },
        setClient: client => {
          this.setState({
            client: client
          });
        },
        setRoomState: roomState => {
          this.setState({
            roomState: AppContext_objectSpread(AppContext_objectSpread({}, this.state.roomState), roomState)
          });
        }
      }
    }, this.props.children);
  }

}


// EXTERNAL MODULE: external "formik"
var external_formik_ = __webpack_require__("QxnH");

// EXTERNAL MODULE: external "@100mslive/hmsvideo-web"
var hmsvideo_web_ = __webpack_require__("5AsJ");

// EXTERNAL MODULE: external "mdi-react/ArrowLeftIcon"
var ArrowLeftIcon_ = __webpack_require__("A44f");
var ArrowLeftIcon_default = /*#__PURE__*/__webpack_require__.n(ArrowLeftIcon_);

// EXTERNAL MODULE: ./src/constants.js
var constants = __webpack_require__("X7BR");

// CONCATENATED MODULE: ./src/components/LoginTextField.jsx
var LoginTextField_jsx = external_react_default.a.createElement;


function LoginTextField({
  label,
  name,
  className,
  placeholder,
  errors,
  touched,
  as,
  children
}) {
  return LoginTextField_jsx(external_react_default.a.Fragment, null, LoginTextField_jsx(external_formik_["Field"], {
    label: label,
    name: name,
    as: as,
    className: `rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5
          ${errors && touched ? 'border-red-500' : 'border-gray-300'}
          ${className}`,
    placeholder: placeholder
  }, children), errors && touched && LoginTextField_jsx(external_formik_["ErrorMessage"], {
    name: name,
    component: "div",
    className: "text-red-500 mt-1 mb-2"
  }));
}
// CONCATENATED MODULE: ./src/components/LoginForm.jsx
var LoginForm_jsx = external_react_default.a.createElement;

function LoginForm_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











class LoginForm_LoginForm extends external_react_default.a.Component {
  constructor(props) {
    super(props);

    LoginForm_defineProperty(this, "componentDidMount", async () => {
      console.log(`%c[APP] Role=${this.props.loginInfo.role}`);
      this.setState({
        isSupported: deviceSupport().supported
      });
      await this.updatePermission();
      console.log({
        permissionGranted: this.state.permissionGranted
      }); //const { form } = this.props;

      console.log('window.location:' + window.location);
      console.log('url:' + window.location.protocol + window.location.host + '  ' + window.location.pathname + window.location.query); // if (!this.props.settings.codec) {
      //   this.props.setSettings({
      //     selectedAudioDevice: '',
      //     selectedVideoDevice: '',
      //     // selectedAudioOutputDevice: "",
      //     resolution: 'qvga',
      //     bandwidth: 256,
      //     codec: 'vp8',
      //     isDevMode: true,
      //   });
      // }

      if (this.props.loginInfo.role === constants["b" /* ROLES */].LIVE_RECORD && this.props.loginInfo.roomId !== '') {
        console.log(`%c[APP] Skipping audio & video permission promt for the live-record bot`, 'color: blue');
        const handleLogin = this.props.handleLogin;
        this.props.setLoginInfo({
          displayName: null,
          role: constants["b" /* ROLES */].LIVE_RECORD
        });
        handleLogin();
        return;
      } // ToDo: Show a confirmation dialog for ROLES.VIEWER


      this.setState({
        permissionText: 'We will need your permission to use your webcam and microphone.'
      });

      if (getRequest() && getRequest().hasOwnProperty('room') && this.props.loginInfo.displayName !== '' && this.props.loginInfo.roomId !== '' && this.props.loginInfo.env !== '') {
        if (this.state.permissionGranted) {
          console.log('Showing preview');
          this.startPreview(true);
        } else {
          this.setState({
            formStage: 'PERMISSION'
          });
        }
      } else {
        let formStage = 'ROOM';
        console.log(`[FormStage: ${formStage}]`);

        if (this.props.loginInfo.roomId != '') {
          formStage = 'JOIN_ROOM';
        }

        this.setState({
          formStage: formStage
        });
      }
    });

    LoginForm_defineProperty(this, "componentWillUnmount", () => {
      this._cleanup();
    });

    LoginForm_defineProperty(this, "_notification", (message, description, type = 'info') => {
      if (type == 'info') {
        external_antd_["notification"].info({
          message: message,
          description: description,
          placement: 'bottomRight'
        });
      } else if (type == 'error') {
        external_antd_["notification"].error({
          message: message,
          description: description,
          placement: 'bottomRight'
        });
      }
    });

    LoginForm_defineProperty(this, "_stopMediaStream", async stream => {
      let tracks = stream.getTracks();

      for (let i = 0, len = tracks.length; i < len; i++) {
        await tracks[i].stop();
      }
    });

    LoginForm_defineProperty(this, "_cleanup", async () => {
      if (this.stream) {
        await this._stopMediaStream(this.stream);
        await this.client.unpublish(this.stream, this.client.rid);
      }

      if (this.client) await this.client.leave();
    });

    LoginForm_defineProperty(this, "updateDeviceList", callback => {
      updateInputDevices().then(data => {
        if (this.props.settings.selectedAudioDevice === '' && data.audioDevices.length > 0) {
          this.props.setSettings({
            selectedAudioDevice: data.audioDevices[0].deviceId
          });
        }

        if (this.props.settings.selectedVideoDevice === '' && data.videoDevices.length > 0) {
          this.props.setSettings({
            selectedVideoDevice: data.videoDevices[0].deviceId
          });
        } // if (
        //   this.state.settings.selectedAudioOutputDevice === "" &&
        //   data.audioOutputDevices.length > 0
        // ) {
        //   console.log("setting output device")
        //   this.state.settings.selectedAudioOutputDevice =
        //     data.audioOutputDevices[0].deviceId
        // }


        this.setState({
          videoDevices: data.videoDevices,
          audioDevices: data.audioDevices,
          audioOutputDevices: data.audioOutputDevices
        });

        if (callback) {
          callback();
        }
      });
    });

    LoginForm_defineProperty(this, "handleCreateSubmit", async values => {
      const endpoint = process.env.NEXT_PUBLIC_CREATE_ROOM_ENDPOINT || '/api/room';
      console.log('endpoint', endpoint);
      console.log('Create Room values: ', values);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          room_name: values.roomName,
          recording_info: {
            enabled: values.isRecording
          },
          env: values.env
        })
      }).catch(err => {
        console.log('Error', err);
      });
      console.log('Response: ', response);

      if (response.status != 200) {
        const data = await response.json();

        this._notification('Error', data.message, 'error');
      } else {
        const roomEntry = await response.json();
        console.log('response:', roomEntry);
        values.roomId = roomEntry.id;

        this._notification('Room Created', `Room Id: ${values.roomId} Room Name: ${values.roomName}`);

        this.handleNameSubmit(values);
      }
    });

    LoginForm_defineProperty(this, "handleJoinSubmit", values => {
      // TODO: How to get roomName from roomId
      this.handleNameSubmit(values);
    });

    LoginForm_defineProperty(this, "handleNameSubmit", values => {
      console.log(this.state.permissionGranted);
      this.props.setLoginInfo({
        roomId: values.roomId
      });

      if (values.roomName) {
        this.props.setLoginInfo({
          roomName: values.roomName
        });
      }

      if (values.role) {
        this.props.setLoginInfo({
          role: values.role
        });
      }

      if (values.env) {
        this.props.setLoginInfo({
          env: values.env
        });
      }

      if (values.displayName) {
        this.props.setLoginInfo({
          displayName: values.displayName
        });
      }

      if (this.props.loginInfo.role === constants["b" /* ROLES */].VIEWER) {
        this.props.handleLogin();
      } else if (this.state.permissionGranted) {
        console.log('Showing preview');
        this.startPreview(true);
      } else {
        this.setState({
          formValues: values,
          formStage: 'PERMISSION'
        });
      }
    });

    LoginForm_defineProperty(this, "handleSubmit", values => {
      const handleLogin = this.props.handleLogin;
      console.log('Values in handleSubmit: ', values);
      console.log('this.props.loginInfo.roomId in handleSubmit: ', this.props.loginInfo.roomId);
      if (values.role) this.props.setLoginInfo({
        role: values.role
      });
      if (this.state.formValues) this.props.setLoginInfo({
        displayName: this.state.formValues.displayName || localStorage.getItem('loginInfo.displayName') || '',
        roomName: this.state.formValues.roomName,
        env: this.state.formValues.env
      });
      handleLogin();
    });

    LoginForm_defineProperty(this, "updatePermission", async () => {
      await getPermissionStatus().then(permission => {
        if (permission) {
          this.setState({
            permissionGranted: true
          });
        } else {
          this.setState({
            permissionGranted: false
          });
        }
      }).catch(error => {
        console.log({
          permissionError: error
        });
        this.setState({
          permissionGranted: false
        });
      });
    });

    LoginForm_defineProperty(this, "soundMeterProcess", () => {
      var val = window.soundMeter.instant.toFixed(2) * 700 + 1;
      this.setState({
        audioLevel: val
      }); //      if (this.state.visible)

      setTimeout(this.soundMeterProcess, 100);
    });

    LoginForm_defineProperty(this, "startPreview", (permissionTestMode = false) => {
      closeMediaStream(window.stream);
      let audioSource = this.props.settings.selectedAudioDevice;
      let videoSource = this.props.settings.selectedVideoDevice;
      let videoElement, soundMeterProcess;

      if (!permissionTestMode) {
        videoElement = document.getElementById('previewVideo'); // this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
        // soundMeterProcess = this.soundMeterProcess;
      }

      let constraints = {
        audio: !this.props.roomState.localAudioEnabled ? true : {
          deviceId: audioSource ? {
            exact: audioSource
          } : undefined
        },
        video: !this.props.roomState.localVideoEnabled ? true : {
          deviceId: videoSource ? {
            exact: videoSource
          } : undefined
        }
      };
      getUserMedia(constraints).then(stream => {
        if (!permissionTestMode) {
          window.stream = stream; // make stream available to console
          //videoElement.srcObject = stream;

          attachMediaStream(videoElement, stream); //TODO this throws an error when audio only is chosen. Handle it
          // if (this.props.roomState.localAudioEnabled) {
          //   soundMeter.connectToSource(stream);
          //   setTimeout(soundMeterProcess, 100);
          // }
        }

        return navigator.mediaDevices.enumerateDevices(); // Refresh button list in case labels have become available
      }).then(devices => {
        //TODO combine with updateInputDevices
        let videoDevices = [];
        let audioDevices = [];
        let audioOutputDevices = [];

        for (let device of devices) {
          if (device.kind === 'videoinput') {
            videoDevices.push(device);
          } else if (device.kind === 'audioinput') {
            audioDevices.push(device);
          } else if (device.kind === 'audiooutput') {
            audioOutputDevices.push(device);
          }
        }

        let data = {
          videoDevices,
          audioDevices,
          audioOutputDevices
        };

        if (this.props.settings.selectedAudioDevice === '' && data.audioDevices.length > 0) {
          this.props.setSettings({
            selectedAudioDevice: data.audioDevices[0].deviceId
          });
        }

        if (this.props.settings.selectedVideoDevice === '' && data.videoDevices.length > 0) {
          this.props.setSettings({
            selectedVideoDevice: data.videoDevices[0].deviceId
          });
        }

        this.setState({
          audioDevices: data.audioDevices,
          videoDevices: data.videoDevices,
          permissionGranted: true,
          formStage: 'PREVIEW'
        });
      }).catch(error => {
        //TODO - look for only permission error. Rest of the errors should be handled
        this.props.setLocalStreamError(error);
        this.setState({
          permissionGranted: false,
          permissionText: "You won't be able to access the meeting unless you grant camera and mic permissions"
        });
      });
    });

    LoginForm_defineProperty(this, "updateDevice", (name, value) => {
      this.props.setSettings({
        [name]: value
      }, () => {
        this.startPreview(false);
      });
    });

    this.state = {
      formStage: 'ROOM',
      permissionGranted: false,
      isSupported: deviceSupport().supported
    };
    let role = '';
    let roomId = '';
    let env = "prod-in" || false;
    let displayName = localStorage.getItem('loginInfo.displayName') || props.loginInfo.displayName || '';

    if (getRequest() && getRequest().hasOwnProperty('role')) {
      role = getRequest().role;
    }

    if (getRequest() && getRequest().hasOwnProperty('room')) {
      roomId = getRequest().room;
    }

    if (getRequest() && getRequest().hasOwnProperty('env')) {
      env = getRequest().env;
    }

    this.props.setLoginInfo({
      role,
      roomId,
      env,
      displayName
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.formStage || this.state.formStage) && prevState.formStage !== this.state.formStage) {
      if (this.state.formStage === 'PREVIEW') {
        this.startPreview(false); //console.log("Start preview called from state change componentDidUpdate preview check")
      }
    }
  }

  render() {
    console.log(this.state.formStage);
    const showEnv = !Boolean("prod-in");
    const showRoleSelect = Boolean("prod-in");
    return LoginForm_jsx(external_react_default.a.Fragment, null, this.state.isSupported && LoginForm_jsx("div", {
      className: "relative z-0"
    }, this.state.formStage && this.state.formStage === 'ROOM' && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx("div", {
      className: " flex items-center justify-center w-full px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#1a1619',
        minHeight: 'calc(100vh - 64px)'
      }
    }, LoginForm_jsx("div", {
      className: "overflow-hidden justify-right items-right shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100"
    }, LoginForm_jsx("h2", {
      className: "mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 mb-2"
    }, "100ms Conference"), LoginForm_jsx("div", {
      className: "mt-6 space-y-2"
    }, LoginForm_jsx("button", {
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150 ease-in-out",
      onClick: () => {
        this.setState({
          formStage: 'CREATE_ROOM'
        });
      }
    }, "Create Room"), LoginForm_jsx("button", {
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-700 hover:border-indigo-700 focus:outline-none border-indigo-600 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out",
      onClick: () => {
        this.setState({
          formStage: 'JOIN_ROOM'
        });
      }
    }, "Join Room"))))), !this.props.loginInfo.roomId && this.state.formStage && this.state.formStage === 'CREATE_ROOM' && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx(external_formik_["Formik"], {
      initialValues: {
        roomName: '',
        displayName: this.props.loginInfo.displayName,
        env: "prod-in" || false,
        role: 'Host',
        isRecording: false
      },
      validate: values => {
        const errors = {};

        if (!values.displayName) {
          errors.displayName = 'Required';
        }

        if (!values.roomName) {
          errors.roomName = 'Required';
        }

        const validRoomPattern = /^[a-zA-Z0-9-.:_]*$/g;

        if (!validRoomPattern.test(values.roomName)) {
          errors.roomName = 'Accepted characters are a-z, A-Z, 0-9, . - : _';
        }

        if (showEnv && !values.env) {
          errors.env = 'Required';
        }

        return errors;
      },
      onSubmit: values => {
        this.setState({
          formValues: values
        });
        this.handleCreateSubmit(values);
      }
    }, ({
      errors,
      touched,
      initialValues
    }) => LoginForm_jsx(external_formik_["Form"], null, LoginForm_jsx("div", {
      className: " flex items-center justify-center w-full px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#1a1619',
        minHeight: 'calc(100vh - 64px)'
      }
    }, LoginForm_jsx("div", {
      className: "overflow-hidden shadow rounded-lg max-w-sm w-full px-4 p-6 bg-gray-100"
    }, LoginForm_jsx("div", null, LoginForm_jsx("h2", {
      className: "text-center justify-center items-center text-3xl leading-9 font-extrabold text-gray-900 mb-2"
    }, initialValues && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx(ArrowLeftIcon_default.a, {
      className: "text-gray-700 hover:text-black",
      onClick: () => {
        this.setState({
          formStage: 'ROOM'
        });
        this.props.setLoginInfo({
          roomId: ''
        });
      }
    }), "100ms Conference"))), LoginForm_jsx("div", {
      className: "rounded-m"
    }, LoginForm_jsx("div", null, LoginForm_jsx(LoginTextField, {
      label: "Room Name",
      name: "roomName",
      className: "rounded-t-md",
      placeholder: "Room Name",
      errors: errors.roomName,
      touched: touched.roomName
    })), LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues && LoginForm_jsx(LoginTextField, {
      label: "Username",
      name: "displayName",
      className: !(initialValues && !initialValues.roomId) && 'rounded-t-md',
      placeholder: "Username",
      errors: errors.displayName,
      touched: touched.displayName
    })), LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues ? showRoleSelect ? LoginForm_jsx(LoginTextField, {
      label: "Role",
      name: "role",
      as: showRoleSelect ? 'select' : null,
      className: !showEnv && 'rounded-b-md',
      placeholder: "Role",
      disabled: this.props.loginInfo.role === constants["b" /* ROLES */].VIEWER,
      errors: errors.role,
      touched: touched.rol
    }, LoginForm_jsx("option", {
      value: ""
    }, "Select Role"), Object.values(constants["b" /* ROLES */]).map((role, index) => LoginForm_jsx("option", {
      key: index,
      value: role,
      className: "capitalize"
    }, role))) : LoginForm_jsx(LoginTextField, {
      label: "Role",
      name: "role",
      className: !showEnv && 'rounded-b-md',
      placeholder: "Role",
      disabled: this.props.loginInfo.role === constants["b" /* ROLES */].VIEWER,
      errors: errors.role,
      touched: touched.rol
    }) : null), showEnv && LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues && LoginForm_jsx(LoginTextField, {
      label: "Environment",
      name: "env",
      className: "rounded-b-md",
      placeholder: "Environment (qa-in/staging-in/prod-in)",
      errors: errors.env,
      touched: touched.env
    }))), LoginForm_jsx("div", {
      className: "mt-6"
    }, LoginForm_jsx("label", null, LoginForm_jsx(external_formik_["Field"], {
      type: "checkbox",
      name: "isRecording"
    }), '  ', " Record Room?")), LoginForm_jsx("div", {
      className: "mt-6"
    }, LoginForm_jsx("button", {
      type: "submit",
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
    }, LoginForm_jsx("span", {
      className: "absolute left-0 inset-y-0 flex items-center pl-3"
    }), "Create Room"))))))), this.state.formStage && this.state.formStage === 'JOIN_ROOM' && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx(external_formik_["Formik"], {
      initialValues: {
        roomId: this.props.loginInfo.roomId ? this.props.loginInfo.roomId : '',
        displayName: this.props.loginInfo.displayName,
        env: this.props.loginInfo.env ? this.props.loginInfo.env : '',
        role: this.props.loginInfo.role ? this.props.loginInfo.role : 'Guest'
      },
      validate: values => {
        const errors = {};

        if (!values.displayName) {
          errors.displayName = 'Required';
        }

        if (!values.roomId) {
          errors.roomId = 'Required';
        }

        if (showEnv && !values.env) {
          errors.env = 'Required';
        }

        return errors;
      },
      onSubmit: values => {
        this.setState({
          formValues: values
        });
        this.handleJoinSubmit(values);
      }
    }, ({
      errors,
      touched,
      initialValues
    }) => LoginForm_jsx(external_formik_["Form"], null, LoginForm_jsx("div", {
      className: " flex items-center justify-center w-full px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#0B0F15',
        minHeight: 'calc(100vh - 64px)'
      }
    }, LoginForm_jsx("div", {
      className: "overflow-hidden shadow rounded-lg max-w-sm w-full px-4 p-6 bg-gray-100"
    }, LoginForm_jsx("div", null, LoginForm_jsx("h2", {
      className: "text-center text-3xl leading-9 font-extrabold text-gray-900 mb-2"
    }, initialValues && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx(ArrowLeftIcon_default.a, {
      className: "text-gray-700 hover:text-black",
      onClick: () => {
        this.setState({
          formStage: 'ROOM'
        });
        this.props.setLoginInfo({
          roomId: ''
        });
      }
    }), "100ms Conference")), initialValues && initialValues.roomId && LoginForm_jsx("p", {
      className: "my-2 text-center text-sm leading-5 text-gray-600"
    }, "You are about to join room:", ' ', LoginForm_jsx("span", {
      className: "font-bold"
    }, initialValues.roomId))), LoginForm_jsx("div", {
      className: "rounded-md"
    }, LoginForm_jsx("div", null, initialValues && !initialValues.roomId && LoginForm_jsx(LoginTextField, {
      label: "Room ID",
      name: "roomId",
      className: "rounded-t-md",
      placeholder: "Room ID",
      errors: errors.roomId,
      touched: touched.roomId
    })), LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues && LoginForm_jsx(LoginTextField, {
      label: "Username",
      name: "displayName",
      className: !(initialValues && !initialValues.roomId) && 'rounded-t-md',
      placeholder: "Username",
      errors: errors.displayName,
      touched: touched.displayName
    })), LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues ? showRoleSelect ? LoginForm_jsx(LoginTextField, {
      label: "Role",
      name: "role",
      as: showRoleSelect ? 'select' : null,
      className: !showEnv && 'rounded-b-md',
      placeholder: "Role",
      disabled: this.props.loginInfo.role === constants["b" /* ROLES */].VIEWER,
      errors: errors.role,
      touched: touched.rol
    }, LoginForm_jsx("option", {
      value: ""
    }, "Select Role"), Object.values(constants["b" /* ROLES */]).map((role, index) => LoginForm_jsx("option", {
      key: index,
      value: role,
      className: "capitalize"
    }, role))) : LoginForm_jsx(LoginTextField, {
      label: "Role",
      name: "role",
      className: !showEnv && 'rounded-b-md',
      placeholder: "Role",
      disabled: this.props.loginInfo.role === constants["b" /* ROLES */].VIEWER,
      errors: errors.role,
      touched: touched.rol
    }) : null), showEnv && LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues && LoginForm_jsx(LoginTextField, {
      label: "Environment",
      name: "env",
      className: "rounded-b-md",
      placeholder: "Environment (qa-in/staging-in/prod-in)",
      errors: errors.env,
      touched: touched.env
    }))), LoginForm_jsx("div", {
      className: "mt-6"
    }, LoginForm_jsx("button", {
      type: "submit",
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
    }, LoginForm_jsx("span", {
      className: "absolute left-0 inset-y-0 flex items-center pl-3"
    }), "Join Room"))))))), this.state.formStage && this.state.formStage === 'PERMISSION' && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx("div", {
      className: " flex items-center justify-center w-full px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#1a1619',
        minHeight: 'calc(100vh - 64px)'
      }
    }, LoginForm_jsx("div", {
      className: "overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3"
    }, LoginForm_jsx("div", {
      className: ""
    }, LoginForm_jsx("h2", {
      className: "mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900"
    }, "100ms Conference"), LoginForm_jsx("p", {
      className: "mt-2 text-center text-sm leading-5 text-gray-600 mb-2"
    }, this.state.permissionText), LoginForm_jsx("div", {
      className: "mt-6"
    }, LoginForm_jsx("button", {
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out",
      onClick: () => {
        this.startPreview(true);
      }
    }, LoginForm_jsx("span", {
      className: "absolute left-0 inset-y-0 flex items-center pl-3"
    }), "Prompt permission dialog")))))), this.state.formStage && this.state.formStage === 'PREVIEW' && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx(external_formik_["Formik"], {
      initialValues: {
        selectedAudioDevice: this.props.settings ? this.props.settings.selectedAudioDevice : null,
        selectedVideoDevice: this.props.settings ? this.props.settings.selectedVideoDevice : null // selectedAudioOutputDevice: this.state.settings
        //   ? this.state.settings.selectedAudioOutputDevice
        //   : null,

      },
      validate: values => {
        const errors = {}; // if (!values.displayName) {
        //   errors.displayName = 'Required';
        // }
        // if (!values.roomName){
        //   errors.roomName = 'Required';
        // }

        return errors;
      },
      onSubmit: values => {
        if (window.stream) {
          closeMediaStream(window.stream);
        }

        this.handleSubmit(values);
      }
    }, ({
      values,
      initialValues
    }) => LoginForm_jsx(external_formik_["Form"], null, LoginForm_jsx("div", {
      className: " flex items-center justify-center w-full px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#1a1619',
        minHeight: 'calc(100vh - 64px)'
      }
    }, LoginForm_jsx("div", {
      className: "overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3"
    }, LoginForm_jsx("div", {
      className: ""
    }, LoginForm_jsx("h2", {
      className: "mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900"
    }, LoginForm_jsx(external_react_default.a.Fragment, null, "100ms Conference")), LoginForm_jsx("p", {
      className: "mt-2 text-center text-sm leading-5 text-gray-600 mb-2"
    }, "You are about to join", ' ', LoginForm_jsx("span", {
      className: "font-semibold"
    }, this.state.formValues ? this.state.formValues.roomName : this.props.loginInfo.roomName), ' ', "as", ' ', LoginForm_jsx("span", {
      className: "font-semibold"
    }, this.state.formValues ? this.state.formValues.displayName : this.props.loginInfo.displayName), LoginForm_jsx("button", {
      className: "rounded-md px-2 py-1 hover:bg-indigo-500 ml-1 border transition duration-150 ease-in-out",
      onClick: () => {
        this.setState({
          formStage: 'JOIN_ROOM'
        });
      }
    }, "Change"))), LoginForm_jsx("div", {
      className: "mb-3"
    }, LoginForm_jsx("div", {
      className: "relative h-48 bg-black rounded-md mb-1"
    }, LoginForm_jsx("video", {
      id: "previewVideo",
      autoPlay: true,
      playsInline: true,
      muted: true,
      className: `rounded-md h-full w-full ${!this.props.roomState.localVideoEnabled && 'hidden'}`
    }), LoginForm_jsx("div", {
      className: "absolute bottom-0 w-full flex justify-center pb-1"
    }, LoginForm_jsx("button", {
      onClick: e => {
        e.preventDefault();
        const initialValue = this.props.roomState.localVideoEnabled;
        this.props.setRoomState({
          localVideoEnabled: !initialValue
        });
      },
      className: `py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out ${this.props.roomState.localVideoEnabled ? 'bg-opacity-50 bg-gray-600' : 'bg-indigo-600'}`
    }, this.props.roomState.localVideoEnabled && LoginForm_jsx("svg", {
      className: "w-6 h-6",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, LoginForm_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    })), !this.props.roomState.localVideoEnabled && LoginForm_jsx("svg", {
      className: "w-6 h-6",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, LoginForm_jsx("path", {
      d: "M15 10L19.553 7.724C19.7054 7.64784 19.8748 7.61188 20.045 7.61955C20.2152 7.62721 20.3806 7.67825 20.5256 7.76781C20.6706 7.85736 20.7902 7.98248 20.8733 8.13127C20.9563 8.28007 20.9999 8.44761 21 8.618V15.382C20.9999 15.5524 20.9563 15.7199 20.8733 15.8687C20.7902 16.0175 20.6706 16.1426 20.5256 16.2322C20.3806 16.3218 20.2152 16.3728 20.045 16.3805C19.8748 16.3881 19.7054 16.3522 19.553 16.276L15 14V10ZM5 18H13C13.5304 18 14.0391 17.7893 14.4142 17.4142C14.7893 17.0391 15 16.5304 15 16V8C15 7.46957 14.7893 6.96086 14.4142 6.58579C14.0391 6.21071 13.5304 6 13 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18Z",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), LoginForm_jsx("line", {
      x1: "2.00177",
      y1: "19.7113",
      x2: "16.1289",
      y2: "4.10676",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))), LoginForm_jsx("button", {
      onClick: e => {
        e.preventDefault();
        const initialValue = this.props.roomState.localAudioEnabled;
        this.props.setRoomState({
          localAudioEnabled: !initialValue
        });
      },
      className: `ml-1 py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out ${this.props.roomState.localAudioEnabled ? 'bg-opacity-50 bg-gray-600' : 'bg-indigo-600'}`
    }, this.props.roomState.localAudioEnabled && LoginForm_jsx("svg", {
      className: "w-6 h-6",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, LoginForm_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    })), !this.props.roomState.localAudioEnabled && LoginForm_jsx("svg", {
      className: "h-6 w-6",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, LoginForm_jsx("path", {
      d: "M19 11C19 12.8565 18.2625 14.637 16.9497 15.9497C15.637 17.2625 13.8565 18 12 18M12 18C10.1435 18 8.36301 17.2625 7.05025 15.9497C5.7375 14.637 5 12.8565 5 11M12 18V22M12 22H8M12 22H16M12 14C11.2044 14 10.4413 13.6839 9.87868 13.1213C9.31607 12.5587 9 11.7956 9 11V5C9 4.20435 9.31607 3.44129 9.87868 2.87868C10.4413 2.31607 11.2044 2 12 2C12.7956 2 13.5587 2.31607 14.1213 2.87868C14.6839 3.44129 15 4.20435 15 5V11C15 11.7956 14.6839 12.5587 14.1213 13.1213C13.5587 13.6839 12.7956 14 12 14Z",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), LoginForm_jsx("line", {
      x1: "4.43121",
      y1: "18.0549",
      x2: "18.5583",
      y2: "2.45033",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))))), this.props.roomState.localAudioEnabled && LoginForm_jsx("div", {
      className: "px-1"
    }, LoginForm_jsx("div", {
      style: {
        width: !this.props.roomState.localAudioEnabled ? '1px' : this.state.audioLevel + 'px',
        height: '4px',
        backgroundColor: '#8dc63f'
      }
    }))), LoginForm_jsx("div", {
      className: "rounded-md shadow-sm"
    }, LoginForm_jsx("div", null, initialValues && LoginForm_jsx(external_formik_["Field"], {
      label: "Audio Input",
      name: "selectedAudioDevice",
      className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5",
      placeholder: "Audio Input",
      component: SingleSelect,
      options: this.state.audioDevices,
      updateDevice: this.updateDevice
    })), LoginForm_jsx("div", {
      className: "-mt-px"
    }, initialValues && LoginForm_jsx(external_formik_["Field"], {
      label: "Video Input",
      name: "selectedVideoDevice",
      className: `appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5`,
      placeholder: "Video Input",
      component: SingleSelect,
      options: this.state.videoDevices,
      updateDevice: this.updateDevice
    }))), LoginForm_jsx("div", {
      className: "mt-0"
    }, LoginForm_jsx("button", {
      type: "submit",
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
    }, LoginForm_jsx("span", {
      className: "absolute left-0 inset-y-0 flex items-center pl-3"
    }), "Join")))))))), !this.state.isSupported && LoginForm_jsx(external_react_default.a.Fragment, null, LoginForm_jsx("div", {
      className: " flex items-center justify-center w-full px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#1a1619',
        minHeight: 'calc(100vh - 64px)'
      }
    }, LoginForm_jsx("div", {
      className: "overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3"
    }, LoginForm_jsx("div", {
      className: ""
    }, LoginForm_jsx("h2", {
      className: "mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900"
    }, "100ms Conference"), LoginForm_jsx("p", {
      className: "mt-2 text-center text-sm leading-5 text-gray-600 mb-2"
    }, deviceSupport().failureCause == 'iOS' ? LoginForm_jsx("span", null, "100ms users might face issues on iOS devices. Please open the link on another device for the best experience. If you wish to continue on iOS, click continue.") : LoginForm_jsx("span", null, "We recommend using Google Chrome for the best experience.")), LoginForm_jsx("div", {
      className: "mt-6"
    }, deviceSupport().failureCause == 'browser' && LoginForm_jsx("a", {
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out",
      href: "https://www.google.com/chrome/",
      target: "_blank"
    }, "Download Google Chrome"), LoginForm_jsx("button", {
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-700 hover:border-indigo-700 focus:outline-none border-indigo-600 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out mt-3",
      onClick: () => this.setState({
        isSupported: true
      })
    }, "Continue in current browser")))))));
  }

}

function objToStrMap(obj) {
  const strMap = new Map();

  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }

  return strMap;
}

const WrappedLoginForm = LoginForm_LoginForm; //const WrappedLoginForm = Form.create({ name: "login" })(LoginForm);

/* harmony default export */ var components_LoginForm = (WrappedLoginForm);
// EXTERNAL MODULE: external "mdi-react/PinIcon"
var PinIcon_ = __webpack_require__("ZeaA");
var PinIcon_default = /*#__PURE__*/__webpack_require__.n(PinIcon_);

// EXTERNAL MODULE: external "mdi-react/PinOffIcon"
var PinOffIcon_ = __webpack_require__("jpa1");
var PinOffIcon_default = /*#__PURE__*/__webpack_require__.n(PinOffIcon_);

// EXTERNAL MODULE: external "mdi-react/MicrophoneIcon"
var MicrophoneIcon_ = __webpack_require__("U/O2");
var MicrophoneIcon_default = /*#__PURE__*/__webpack_require__.n(MicrophoneIcon_);

// EXTERNAL MODULE: external "mdi-react/MicrophoneOffIcon"
var MicrophoneOffIcon_ = __webpack_require__("UT4g");
var MicrophoneOffIcon_default = /*#__PURE__*/__webpack_require__.n(MicrophoneOffIcon_);

// CONCATENATED MODULE: ./src/components/Videoview/MainVideoView.jsx
var MainVideoView_jsx = external_react_default.a.createElement;

function MainVideoView_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class MainVideoView_MainVideoView extends external_react_default.a.Component {
  constructor(...args) {
    super(...args);

    MainVideoView_defineProperty(this, "componentDidMount", () => {
      const {
        stream
      } = this.props;
      this.video.srcObject = stream;
    });

    MainVideoView_defineProperty(this, "componentWillUnmount", () => {
      this.video.srcObject = null;
    });

    MainVideoView_defineProperty(this, "render", () => {
      const {
        id,
        stream,
        vidFit,
        onPin,
        onUnpin,
        label,
        pinned = false,
        audioEnabled = true,
        videoEnabled = true,
        screenshare = false,
        uid,
        onRequest
      } = this.props;
      return MainVideoView_jsx("div", {
        className: "w-full max-w-full h-full max-h-full flex justify-center items-center relative p-1"
      }, MainVideoView_jsx("video", {
        ref: ref => {
          this.video = ref;
        },
        id: id,
        autoPlay: true,
        playsInline: true,
        muted: false,
        className: `h-full rounded shadow-lg`
      }), MainVideoView_jsx("div", {
        className: "absolute top-0 right-0 pt-2 w-full flex justify-center items-center"
      }, MainVideoView_jsx("span", {
        className: "px-3 bg-indigo-900 rounded text-white inline-block bg-opacity-75 h-6 inline-block mr-0.5",
        style: {
          lineHeight: '1.5rem'
        }
      }, label || stream.info.name), uid && MainVideoView_jsx("button", {
        onClick: e => {
          console.log(e, 'mute/unmute', uid);
          onRequest(uid, {
            mute: audioEnabled
          });
        },
        className: `w-6 h-6 bg-opacity-50 rounded flex items-center justify-center mx-0.5 ${audioEnabled ? 'bg-gray-800 hover:bg-indigo-500' : 'bg-red-500'}`
      }, audioEnabled ? MainVideoView_jsx(MicrophoneIcon_default.a, {
        className: "text-indigo-100 w-4 h-4"
      }) : MainVideoView_jsx(MicrophoneOffIcon_default.a, {
        className: "text-red-100 w-4 h-4"
      })), onPin && MainVideoView_jsx("button", {
        className: "w-6 h-6 bg-gray-800 bg-opacity-50 hover:bg-indigo-500 rounded flex items-center justify-center ml-0.5",
        onClick: onPin
      }, MainVideoView_jsx(PinIcon_default.a, {
        className: "w-4 h-4 text-indigo-100"
      })), onUnpin && MainVideoView_jsx("button", {
        className: "w-6 h-6 bg-red-500 bg-opacity-50 hover:bg-red-600 rounded flex items-center justify-center ml-0.5",
        onClick: onUnpin
      }, MainVideoView_jsx(PinOffIcon_default.a, {
        className: "w-4 h-4 text-white"
      }))));
    });
  }

}

/* harmony default export */ var Videoview_MainVideoView = (MainVideoView_MainVideoView);
// CONCATENATED MODULE: ./src/components/Videoview/LocalVideoView.jsx
var LocalVideoView_jsx = external_react_default.a.createElement;

function LocalVideoView_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class LocalVideoView_LocalVideoView extends external_react_default.a.Component {
  constructor() {
    super();

    LocalVideoView_defineProperty(this, "componentDidMount", () => {
      const {
        stream
      } = this.props;
      this.video.srcObject = stream;
    });

    LocalVideoView_defineProperty(this, "componentWillUnmount", () => {
      this.video.srcObject = null;
    });

    LocalVideoView_defineProperty(this, "onMinimizeClick", () => {
      let minimize = !this.state.minimize;
      this.setState({
        minimize
      });
    });

    LocalVideoView_defineProperty(this, "render", () => {
      const {
        id,
        label,
        audioMuted,
        videoMuted,
        videoType,
        onPin,
        onUnpin,
        pinned = false
      } = this.props;
      let minIconStyle = 'local-video-icon-layout';

      if (videoType == 'localVideo') {
        minIconStyle = 'local-video-min-layout';
      }

      return LocalVideoView_jsx("div", {
        className: `local-${videoType === 'localVideo' ? 'video' : 'screen'}-container w-full max-w-full h-full max-h-full flex justify-center items-center relative p-1`
      }, LocalVideoView_jsx("video", {
        ref: ref => {
          this.video = ref;
        },
        id: id,
        autoPlay: true,
        playsInline: true,
        muted: true,
        style: {
          display: `${this.state.minimize ? 'none' : ''}`
        },
        className: `h-full rounded shadow-lg`
      }), LocalVideoView_jsx("div", {
        className: `${this.state.minimize ? minIconStyle : 'local-video-icon-layout'}`
      }), LocalVideoView_jsx("div", {
        className: "absolute top-0 right-0 pt-2 w-full justify-center flex items-center"
      }, LocalVideoView_jsx("span", {
        className: "px-3 bg-indigo-900 rounded text-white inline-block bg-opacity-75 h-6 inline-block mr-0.5",
        style: {
          lineHeight: '1.5rem'
        }
      }, label), onPin && LocalVideoView_jsx("button", {
        className: "w-6 h-6 bg-gray-800 bg-opacity-50 hover:bg-indigo-500 rounded flex items-center justify-center ml-0.5",
        onClick: onPin
      }, LocalVideoView_jsx(PinIcon_default.a, {
        className: "w-4 h-4 text-white"
      })), onUnpin && LocalVideoView_jsx("button", {
        className: "w-6 h-6 bg-red-500 bg-opacity-50 hover:bg-red-600 rounded flex items-center justify-center ml-0.5",
        onClick: onUnpin
      }, LocalVideoView_jsx(PinOffIcon_default.a, {
        className: "w-4 h-4 text-white"
      }))));
    });

    this.state = {
      minimize: false
    };
  }

}

/* harmony default export */ var Videoview_LocalVideoView = (LocalVideoView_LocalVideoView);
// CONCATENATED MODULE: ./src/components/Videoview/SmallVideoView.jsx
var SmallVideoView_jsx = external_react_default.a.createElement;

function SmallVideoView({
  id,
  stream,
  label,
  isMuted,
  isLocal
}) {
  const videoEl = Object(external_react_["useRef"])(null);
  Object(external_react_["useEffect"])(() => {
    videoEl.current.srcObject = stream;
    return function cleanUp() {
      videoEl.current.srcObject = null;
    };
  }, []);
  return SmallVideoView_jsx("div", {
    className: `relative w-64 h-36 mb-2 mx-auto ${isLocal ? 'local-video-container' : ''}`
  }, SmallVideoView_jsx("video", {
    ref: videoEl,
    id: id,
    autoPlay: true,
    playsInline: true,
    muted: isMuted,
    className: "rounded max-h-full mx-auto shadow-lg"
  }), SmallVideoView_jsx("div", {
    className: "absolute left-0 top-0 w-full text-center pt-0.5"
  }, SmallVideoView_jsx("a", {
    className: "bg-indigo-900 bg-opacity-75 text-xs text-white inline-flex items-center px-1 rounded-sm"
  }, label || stream.info.name)));
}
// CONCATENATED MODULE: ./src/components/Videoview/index.jsx



// EXTERNAL MODULE: external "react-container-dimensions"
var external_react_container_dimensions_ = __webpack_require__("hM6T");
var external_react_container_dimensions_default = /*#__PURE__*/__webpack_require__.n(external_react_container_dimensions_);

// EXTERNAL MODULE: external "rect-scaler"
var external_rect_scaler_ = __webpack_require__("4Osj");

// CONCATENATED MODULE: ./src/components/Conference/gallery.jsx
var gallery_jsx = external_react_default.a.createElement;





const Gallery = ({
  id,
  videoCount,
  client,
  localScreen,
  localStream,
  audioMuted,
  videoMuted,
  streams,
  onPin,
  loginInfo,
  onRequest
}) => {
  return gallery_jsx(external_react_default.a.Fragment, null, gallery_jsx("div", {
    className: `relative w-full flex flex-wrap justify-center items-center`,
    style: {
      height: 'calc(100vh - 128px)',
      backgroundColor: '#1a1619'
    }
  }, gallery_jsx(external_react_container_dimensions_default.a, null, ({
    width,
    height
  }) => {
    let w = '100%';
    let h = '100%';

    if (videoCount > 0) {
      let largestRectObj = Object(external_rect_scaler_["largestRect"])(width, height, videoCount, 160, 90);
      w = largestRectObj.width;
      h = largestRectObj.height;
    }

    return gallery_jsx(external_react_default.a.Fragment, null, localStream && gallery_jsx("div", {
      style: {
        height: h,
        width: w
      }
    }, gallery_jsx(Videoview_LocalVideoView, {
      id: id + '-video',
      label: `${loginInfo.displayName} (You)`,
      client: client,
      stream: localStream,
      audioMuted: audioMuted,
      videoMuted: videoMuted,
      videoType: "localVideo",
      onPin: () => {
        onPin(id + '-video');
      }
    })), streams.map((item, index) => {
      return gallery_jsx("div", {
        key: item.mid,
        style: {
          height: h,
          width: w
        }
      }, gallery_jsx(Videoview_MainVideoView, {
        id: item.mid,
        stream: item.stream,
        onPin: () => {
          onPin(item.mid);
        },
        audioEnabled: item.audioEnabled,
        videoEnabled: item.videoEnabled,
        screenshare: item.screenshare,
        uid: item.uid,
        onRequest: onRequest
      }));
    }), localScreen && gallery_jsx("div", {
      style: {
        height: h,
        width: w
      }
    }, gallery_jsx(Videoview_LocalVideoView, {
      id: id + '-screen',
      label: "Your Screen",
      client: client,
      stream: localScreen,
      audioMuted: false,
      videoMuted: false,
      videoType: "localScreen",
      onPin: () => {
        onPin(id + '-screen');
      }
    })));
  })));
};


// CONCATENATED MODULE: ./src/components/Conference/pinned.jsx
var pinned_jsx = external_react_default.a.createElement;



const Pinned = ({
  id,
  client,
  localScreen,
  localStream,
  audioMuted,
  videoMuted,
  streams,
  onUnpin,
  pinned,
  loginInfo,
  onRequest
}) => {
  const isLocalScreenPinned = localScreen && pinned === id + '-screen';
  const isLocalStreamPinned = localStream && pinned === id + '-video';
  const [pinnedStream] = streams.filter(s => s.sid === pinned);
  const newStreams = streams.filter(s => s.sid !== pinned);
  return pinned_jsx("div", {
    className: `relative top-0 bottom-0 w-full flex justify-between`,
    style: {
      height: 'calc(100vh - 128px)',
      backgroundColor: '#1a1619'
    }
  }, pinned_jsx("div", {
    className: "w-4/5 h-full max-w-full"
  }, isLocalStreamPinned && pinned_jsx(Videoview_LocalVideoView, {
    id: id + '-video',
    label: `${loginInfo.displayName} (You)`,
    client: client,
    stream: localStream,
    audioMuted: audioMuted,
    videoMuted: videoMuted,
    pinned: true,
    videoType: "localVideo",
    onUnpin: () => {
      onUnpin();
    }
  }), isLocalScreenPinned && pinned_jsx(Videoview_LocalVideoView, {
    id: id + '-screen',
    label: "Your Screen",
    client: client,
    stream: localScreen,
    audioMuted: audioMuted,
    pinned: true,
    videoMuted: videoMuted,
    videoType: "localScreen",
    onUnpin: () => {
      onUnpin();
    }
  }), pinnedStream && pinned_jsx(Videoview_MainVideoView, {
    key: pinnedStream.mid,
    id: pinnedStream.mid,
    stream: pinnedStream.stream,
    pinned: true,
    onUnpin: onUnpin,
    audioEnabled: pinnedStream.audioEnabled,
    videoEnabled: pinnedStream.videoEnabled,
    screenshare: pinnedStream.screenshare,
    uid: pinnedStream.uid,
    onRequest: onRequest
  })), pinned_jsx("div", {
    className: `w-1/5 max-h-full overflow-y-auto mx-auto`
  }, newStreams.map((item, index) => pinned_jsx("div", {
    key: `stream-${index}`,
    className: "w-full"
  }, pinned_jsx(SmallVideoView, {
    key: item.mid,
    id: item.mid,
    stream: item.stream
  }))), localScreen && !isLocalScreenPinned && pinned_jsx("div", {
    className: "w-full"
  }, pinned_jsx(SmallVideoView, {
    id: id + '-screen',
    stream: localScreen,
    label: "Your Screen",
    isMuted: true
  })), localStream && !isLocalStreamPinned && pinned_jsx("div", {
    className: "w-full"
  }, pinned_jsx(SmallVideoView, {
    id: id + '-video',
    stream: localStream,
    isLocal: true,
    label: `${loginInfo.displayName} (You)`,
    isMuted: true
  }))));
};


// EXTERNAL MODULE: external "mdi-react/PhoneHangupIcon"
var PhoneHangupIcon_ = __webpack_require__("Sqtb");
var PhoneHangupIcon_default = /*#__PURE__*/__webpack_require__.n(PhoneHangupIcon_);

// EXTERNAL MODULE: external "mdi-react/TelevisionIcon"
var TelevisionIcon_ = __webpack_require__("Xeo+");
var TelevisionIcon_default = /*#__PURE__*/__webpack_require__.n(TelevisionIcon_);

// EXTERNAL MODULE: external "mdi-react/TelevisionOffIcon"
var TelevisionOffIcon_ = __webpack_require__("Hs0K");
var TelevisionOffIcon_default = /*#__PURE__*/__webpack_require__.n(TelevisionOffIcon_);

// EXTERNAL MODULE: external "mdi-react/VideocamOffIcon"
var VideocamOffIcon_ = __webpack_require__("VdRV");
var VideocamOffIcon_default = /*#__PURE__*/__webpack_require__.n(VideocamOffIcon_);

// EXTERNAL MODULE: external "mdi-react/VideoIcon"
var VideoIcon_ = __webpack_require__("D0VD");
var VideoIcon_default = /*#__PURE__*/__webpack_require__.n(VideoIcon_);

// CONCATENATED MODULE: ./src/components/Controls/ControlButton.jsx
var ControlButton_jsx = external_react_default.a.createElement;


const ControlButton = ({
  icon,
  label,
  activeIcon,
  isActive,
  onClick
}) => {
  return ControlButton_jsx("button", {
    className: "flex flex-col justify-between items-center w-12",
    onClick: onClick
  }, ControlButton_jsx("div", {
    className: `w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-red-100 transition duration-100 ease-in ${isActive ? 'bg-red-500' : 'bg-indigo-900'}`
  }, isActive ? activeIcon : icon), ControlButton_jsx("div", {
    className: "pt-1"
  }, ControlButton_jsx("span", {
    className: "text-xs text-indigo-100"
  }, label)));
};


// EXTERNAL MODULE: external "mdi-react/ShareIcon"
var ShareIcon_ = __webpack_require__("7hxO");
var ShareIcon_default = /*#__PURE__*/__webpack_require__.n(ShareIcon_);

// CONCATENATED MODULE: ./src/components/ToolShare.js
var ToolShare_jsx = external_react_default.a.createElement;

function ToolShare_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class ToolShare_ToolShare extends external_react_default.a.Component {
  constructor(props) {
    super(props);

    ToolShare_defineProperty(this, "showModal", () => {
      this.setState({
        visible: true
      });
    });

    ToolShare_defineProperty(this, "handleOk", e => {
      this.setState({
        visible: false
      });
    });

    ToolShare_defineProperty(this, "handleCancel", e => {
      this.setState({
        visible: false
      });
    });

    ToolShare_defineProperty(this, "onFocus", e => {
      external_react_dom_default.a.findDOMNode(e.target).select();
    });

    this.state = {
      visible: false
    };
    const url = new URLSearchParams(props.url);
    url.delete('role');
    this.url = decodeURIComponent(url.toString());
  }

  render() {
    return ToolShare_jsx("div", null, ToolShare_jsx(ControlButton, {
      icon: ToolShare_jsx(ShareIcon_default.a, {
        className: "text-indigo-100"
      }),
      activeIcon: ToolShare_jsx(ShareIcon_default.a, {
        className: "text-red-100"
      }),
      label: "Share",
      isActive: false,
      onClick: this.showModal
    }), ToolShare_jsx(external_antd_["Modal"], {
      title: "Shared conference",
      visible: this.state.visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      okText: "Ok",
      cancelText: "Cancel"
    }, ToolShare_jsx("div", null, ToolShare_jsx("div", null, ToolShare_jsx("span", null, "Send link to your friends"), ToolShare_jsx(external_antd_["Input"], {
      onFocus: this.onFocus,
      readOnly: true,
      value: this.url
    })))));
  }

}
// CONCATENATED MODULE: ./src/components/Controls/index.jsx
var Controls_jsx = external_react_default.a.createElement;












const Controls = ({
  role,
  isMuted,
  screenSharingEnabled,
  isCameraOn,
  isChatOpen,
  onScreenToggle,
  onMicToggle,
  onCamToggle,
  onLeave,
  onChatToggle,
  loginInfo,
  hasUnreadMessages
}) => {
  const isViewer = role === constants["b" /* ROLES */].VIEWER;
  const isLiveRecordingOn = role === constants["b" /* ROLES */].LIVE_RECORD;

  const cameraButton = Controls_jsx("div", {
    className: "mr-1"
  }, Controls_jsx(ControlButton, {
    icon: Controls_jsx(VideoIcon_default.a, {
      className: "text-indigo-100"
    }),
    activeIcon: Controls_jsx(VideocamOffIcon_default.a, {
      className: "text-red-100"
    }),
    label: "Camera",
    isActive: !isCameraOn,
    onClick: onCamToggle
  }));

  const micButton = Controls_jsx("div", {
    className: "mx-1"
  }, Controls_jsx(ControlButton, {
    icon: Controls_jsx(MicrophoneIcon_default.a, {
      className: "text-indigo-100"
    }),
    activeIcon: Controls_jsx(MicrophoneOffIcon_default.a, {
      className: "text-red-100"
    }),
    label: "Mic",
    isActive: isMuted,
    onClick: onMicToggle
  }));

  const leaveButton = Controls_jsx("div", {
    className: "mx-1"
  }, Controls_jsx(ControlButton, {
    icon: Controls_jsx(PhoneHangupIcon_default.a, {
      className: "text-red-100"
    }),
    activeIcon: Controls_jsx(PhoneHangupIcon_default.a, {
      className: "text-red-100"
    }),
    label: "Leave",
    onClick: onLeave,
    isActive: true
  }));

  const screenShareButton = Controls_jsx("div", {
    className: "mx-1"
  }, Controls_jsx(ControlButton, {
    icon: Controls_jsx(TelevisionIcon_default.a, {
      className: "text-indigo-100"
    }),
    activeIcon: Controls_jsx(TelevisionOffIcon_default.a, {
      className: "text-red-100"
    }),
    label: "Screen",
    isActive: screenSharingEnabled,
    onClick: onScreenToggle
  }));

  const chatButton = Controls_jsx("div", {
    className: "mx-1 relative"
  }, hasUnreadMessages && Controls_jsx("div", {
    className: "absolute -top-1 right-0 w-3 h-3 bg-red-500 rounded-full border-2",
    style: {
      borderColor: 'rgb(26,22,25)'
    }
  }), Controls_jsx(ControlButton, {
    icon: Controls_jsx("svg", {
      className: "w-6 h-6",
      fill: "none",
      stroke: "white",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, Controls_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    })),
    activeIcon: Controls_jsx("svg", {
      className: "w-6 h-6",
      fill: "none",
      stroke: "white",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, Controls_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    })),
    label: "Chat",
    onClick: onChatToggle,
    isActive: isChatOpen
  }));

  const shareButton = Controls_jsx("div", {
    className: "ml-1"
  }, Controls_jsx(ToolShare_ToolShare, {
    url: location.href
  }));

  return Controls_jsx("div", {
    className: "h-16 absolute w-full justify-center bottom-0 flex items-center py-1",
    style: {
      backgroundColor: '#1a1619'
    }
  }, !isLiveRecordingOn && Controls_jsx(external_react_default.a.Fragment, null, !isViewer && Controls_jsx(external_react_default.a.Fragment, null, cameraButton, micButton), leaveButton, !isViewer && screenShareButton, chatButton, shareButton));
};


// CONCATENATED MODULE: ./src/components/Conference.jsx
var Conference_jsx = external_react_default.a.createElement;

function Conference_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function Conference_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Conference_ownKeys(Object(source), true).forEach(function (key) { Conference_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Conference_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Conference_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






 // import PeerState, { onRoomStateChange } from '../utils/state';

const modes = {
  GALLERY: 'GALLERY',
  PINNED: 'PINNED'
};

class Conference_Conference extends external_react_default.a.Component {
  constructor(props) {
    super(props);

    Conference_defineProperty(this, "componentDidMount", () => {
      const {
        client
      } = this.props;
      client.on('stream-add', this._handleAddStream);
      client.on('stream-remove', this._handleRemoveStream);
    });

    Conference_defineProperty(this, "componentWillUnmount", () => {
      const {
        client
      } = this.props;

      if (client) {
        client.off('stream-add', this._handleAddStream);
        client.off('stream-remove', this._handleRemoveStream);
      }
    });

    Conference_defineProperty(this, "cleanUp", async () => {
      let {
        localStream,
        localScreen,
        streams
      } = this.state;
      await this.setState({
        localStream: null,
        localScreen: null,
        streams: []
      });
      await this._unpublish(localStream);
      await this._unpublish(localScreen);
    });

    Conference_defineProperty(this, "_notification", (message, description) => {
      external_antd_["notification"].info({
        message: message,
        description: description,
        placement: 'bottomRight'
      });
    });

    Conference_defineProperty(this, "_unpublish", async stream => {
      const {
        client
      } = this.props;

      if (stream) {
        await this._stopMediaStream(stream);
        await client.unpublish(stream, client.rid);
      }
    });

    Conference_defineProperty(this, "muteMediaTrack", (type, enabled) => {
      let {
        localStream
      } = this.state;

      if (!localStream) {
        return;
      }

      if (enabled) {
        localStream.unmute(type);
      } else {
        localStream.mute(type);
      }

      if (type === 'audio') {
        this.setState({
          audioMuted: !enabled
        }); // this.peerState && this.peerState.update({ audioEnabled: enabled });
      } else if (type === 'video') {
        this.setState({
          videoMuted: !enabled
        }); // this.peerState && this.peerState.update({ videoEnabled: enabled });
      }
    });

    Conference_defineProperty(this, "handleLocalStream", async () => {
      let {
        localStream
      } = this.state;
      const {
        client,
        settings,
        localVideoEnabled,
        localAudioEnabled
      } = this.props;
      console.log('SETTINGS:', settings);
      client.getLocalStream({
        codec: settings.codec.toUpperCase(),
        resolution: settings.resolution,
        bitrate: settings.bandwidth,
        frameRate: settings.frameRate,
        shouldPublishAudio: localAudioEnabled,
        shouldPublishVideo: localVideoEnabled,
        advancedMediaConstraints: {
          video: {
            deviceId: settings.selectedVideoDevice
          },
          audio: {
            deviceId: settings.selectedAudioDevice
          }
        }
      }).then(localStream => {
        return client.publish(localStream, client.rid);
      }).then(localStream => {
        this.setState({
          localStream
        });
        !localAudioEnabled && this.muteMediaTrack('audio', this.state.audioMuted);
        !localVideoEnabled && this.muteMediaTrack('video', this.state.videoMuted);
      }).catch(error => {
        this.props.setLocalStreamError(error);
      });
    });

    Conference_defineProperty(this, "handleScreenSharing", async enabled => {
      let {
        localScreen
      } = this.state;
      const {
        client,
        settings
      } = this.props;

      if (enabled) {
        localScreen = await client.getLocalScreen({
          bitrate: 0,
          codec: settings.codec.toUpperCase(),
          frameRate: 10
        });
        localScreen.getVideoTracks().forEach(track => {
          if ('contentHint' in track) {
            track.contentHint = 'text';
          }
        });
        console.log({
          localScreen
        });
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

          if (this.state.mode === modes.PINNED && this.state.pinned === client.uid + '-screen') {
            this.setState({
              mode: modes.GALLERY
            });
          }
        }
      }

      this.setState({
        localScreen
      });
    });

    Conference_defineProperty(this, "_stopMediaStream", async stream => {
      let tracks = stream.getTracks();

      for (let i = 0, len = tracks.length; i < len; i++) {
        await tracks[i].stop();
      }
    });

    Conference_defineProperty(this, "_handleAddStream", async (room, peer, streamInfo) => {
      const {
        client
      } = this.props;
      let streams = this.state.streams;

      try {
        let stream = await client.subscribe(streamInfo.mid, room);
        stream.info = {
          name: peer.name
        }; // @NOTE: Just because stream is expected to have info in this format at the moment by the UI

        if (this.state.streamInfo, stream.mid) {
          streams.push(Conference_objectSpread({
            mid: stream.mid,
            stream,
            sid: streamInfo.mid
          }, this.state.streamInfo[stream.mid]));
        } else {
          streams.push({
            mid: stream.mid,
            stream,
            sid: streamInfo.mid
          });
        }

        this.setState({
          streams
        });
      } catch (error) {
        this._notification(`ERROR: Error in subscribing`, error.message);

        this.props.cleanUp();
      }
    });

    Conference_defineProperty(this, "_handleRemoveStream", async (room, peer, streamInfo) => {
      // `room` might be used later in future
      let streams = this.state.streams;
      streams = streams.filter(item => item.sid !== streamInfo.mid);
      this.setState({
        streams
      });

      if (this.state.mode === modes.PINNED && this.state.pinned === streamInfo.mid) {
        this.setState({
          mode: modes.GALLERY
        });
      }
    });

    Conference_defineProperty(this, "_onRequest", (uid, request) => {// this.peerState && this.peerState.setRequest(uid, request);
    });

    Conference_defineProperty(this, "_onChangeVideoPosition", data => {
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
      this.setState({
        streams: streams
      });
    });

    Conference_defineProperty(this, "render", () => {
      const {
        client,
        role
      } = this.props;
      const {
        streams,
        localStream,
        localScreen,
        audioMuted,
        videoMuted
      } = this.state;
      const id = client ? client.uid : null;
      let videoCount = streams.length;
      if (localStream) videoCount++;
      if (localScreen) videoCount++;
      if (client) return Conference_jsx(external_react_default.a.Fragment, null, this.state.mode === modes.PINNED ? Conference_jsx(Pinned, {
        streams: streams,
        audioMuted: audioMuted,
        videoMuted: videoMuted,
        videoCount: videoCount,
        localStream: localStream,
        localScreen: localScreen,
        client: client,
        id: id,
        loginInfo: this.props.loginInfo,
        pinned: this.state.pinned,
        onUnpin: () => {
          this.setState({
            mode: modes.GALLERY
          });
        },
        onRequest: this._onRequest
      }) : Conference_jsx(Gallery, {
        streams: streams,
        audioMuted: audioMuted,
        videoMuted: videoMuted,
        videoCount: videoCount,
        localStream: localStream,
        localScreen: localScreen,
        client: client,
        id: id,
        loginInfo: this.props.loginInfo,
        onPin: streamId => {
          this.setState({
            mode: modes.PINNED,
            pinned: streamId
          });
        },
        onRequest: this._onRequest
      }), Conference_jsx(AppContext.Consumer, null, context => Conference_jsx(Controls, {
        role: role,
        isMuted: this.state.audioMuted,
        isCameraOn: !this.state.videoMuted,
        screenSharingEnabled: context.roomState.screenSharingEnabled,
        onScreenToggle: this.props.onScreenToggle,
        onLeave: this.props.onLeave,
        onMicToggle: () => {
          this.muteMediaTrack('audio', this.state.audioMuted);
        },
        onCamToggle: () => {
          this.muteMediaTrack('video', this.state.videoMuted);
        },
        onChatToggle: this.props.onChatToggle,
        isChatOpen: this.props.isChatOpen,
        loginInfo: this.props.loginInfo,
        hasUnreadMessages: this.props.hasUnreadMessages
      })));
      return Conference_jsx(external_react_default.a.Fragment, null);
    });

    this.state = {
      streams: [],
      streamInfo: [],
      localStream: null,
      localScreen: null,
      audioMuted: false,
      videoMuted: false,
      mode: modes.GALLERY,
      pinned: false,
      localStreamError: null
    };
  }

}

/* harmony default export */ var components_Conference = (Conference_Conference);
// EXTERNAL MODULE: ./package.json
var package_0 = __webpack_require__("kiQV");

// CONCATENATED MODULE: ./src/components/App.jsx
var App_jsx = external_react_default.a.createElement;

function App_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const {
  confirm: App_confirm
} = external_antd_["Modal"];
const {
  Header,
  Content,
  Sider
} = external_antd_["Layout"];










const sdkVersion = package_0["a" /* dependencies */]['@100mslive/hmsvideo-web'].substring(1);
console.info(`Using hmsvideo-web SDK version ${sdkVersion}`);

async function getToken({
  room_id,
  user_name,
  role = 'guest',
  env
}) {
  const endpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT || '/api/token';
  const {
    token
  } = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      room_id,
      user_name,
      env,
      role
    })
  }).then(response => response.json()).catch(err => console.log('Error client token: ', err));
  return token;
}

class App_OldAppUI extends external_react_default.a.Component {
  constructor(props) {
    super(props);

    App_defineProperty(this, "_cleanUp", async (shouldRedirectToHome = true) => {
      if (shouldRedirectToHome) {
        window.history.pushState({}, '100ms', `${window.location.protocol}//${window.location.host}`);
        this.conference && (await this.conference.cleanUp());
        this.props.client && (await this.props.client.disconnect());
        this.props.setClient(null);
        this.props.setRoomState({
          isConnected: false,
          login: false
        });
      } else {
        window.location.reload();
      }
    });

    App_defineProperty(this, "_notification", (message, description) => {
      external_antd_["notification"].info({
        message: message,
        description: description,
        placement: 'bottomRight'
      });
    });

    App_defineProperty(this, "_createClient", async ({
      userName,
      env,
      roomId,
      role
    }) => {
      let url = `wss://${env}.100ms.live`;
      let authToken = await getToken({
        env,
        room_id: roomId,
        user_name: userName,
        role
      });
      console.log(`%cTOKEN IS: ${authToken}`, 'color: orange');
      console.log('Websocket URL', url);

      try {
        let peer = new hmsvideo_web_["HMSPeer"](userName, authToken);
        let config = new hmsvideo_web_["HMSClientConfig"]({
          endpoint: url
        });
        return new hmsvideo_web_["HMSClient"](peer, config);
      } catch (err) {
        console.error('ERROR: ', err);
        alert('Invalid token');
      }
    });

    App_defineProperty(this, "_handleJoin", async () => {
      this.props.setRoomState({
        loading: true
      });

      this.hideMessage = () => {}; //TODO this should reflect in initialization as well


      ![constants["b" /* ROLES */].LIVE_RECORD, constants["b" /* ROLES */].VIEWER].includes(this.role) && this._onMediaSettingsChanged(this.props.settings.selectedAudioDevice, this.props.settings.selectedVideoDevice, this.props.settings.resolution, this.props.settings.bandwidth, this.props.settings.codec, this.props.settings.frameRate, this.props.settings.isDevMode);
      let client = await this._createClient({
        userName: this.props.loginInfo.displayName,
        env: this.props.loginInfo.env,
        roomId: this.props.loginInfo.roomId,
        role: this.props.loginInfo.role
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
          loading: false
        });
      });
      client.on('stream-add', (room, peer, streamInfo) => {
        console.log('stream-add', JSON.stringify({
          room,
          peer,
          streamInfo
        }, null, 2));
      });
      client.on('stream-remove', (room, peer, streamInfo) => {
        console.log('stream-remove', JSON.stringify({
          room,
          peer,
          streamInfo
        }, null, 2));
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
    });

    App_defineProperty(this, "_handleTransportOpen", async () => {
      this.props.setRoomState({
        isConnected: true
      });

      try {
        await this.props.client.join(this.props.loginInfo.roomId).catch(error => {
          console.log('JOIN ERROR:', error);
        });
        let redirectURL = `${window.location.protocol}//${window.location.host}/?room=${this.props.loginInfo.roomId}&env=${this.props.loginInfo.env}&role=${this.props.loginInfo.role}`;
        window.history.pushState({}, '100ms', redirectURL);
        this.props.setRoomState({
          login: true,
          loading: false
        });

        this._notification('Connected!', `Welcome to the ${this.props.loginInfo.roomName || '100ms'} room => ${this.props.loginInfo.roomId}`); // Local video & audio are disabled for the 'live-record'
        // and 'viewer' roles. Their local stream is also not published.


        if (![constants["b" /* ROLES */].LIVE_RECORD, constants["b" /* ROLES */].VIEWER].includes(this.props.loginInfo.role)) {
          await this.conference.handleLocalStream();
        }
      } catch (error) {
        console.error('HANDLE THIS ERROR: ', error);
      }
    });

    App_defineProperty(this, "_handleLeave", async () => {
      let this2 = this;
      App_confirm({
        title: 'Leave Now?',
        content: 'Do you want to leave the room?',

        async onOk() {
          await this2._cleanUp();
          this2.props.setRoomState({
            login: false
          });
        },

        onCancel() {
          console.log('Cancel');
        }

      });
    });

    App_defineProperty(this, "_handleAudioTrackEnabled", enabled => {
      this.props.setRoomState({
        localAudioEnabled: enabled
      });
      this.conference.muteMediaTrack('audio', enabled);
    });

    App_defineProperty(this, "_handleVideoTrackEnabled", enabled => {
      this.props.setRoomState({
        localVideoEnabled: enabled
      });
      this.conference.muteMediaTrack('video', enabled);
    });

    App_defineProperty(this, "_handleScreenSharing", enabled => {
      this.props.setRoomState({
        screenSharingEnabled: enabled
      });
      this.conference.handleScreenSharing(enabled);
    });

    App_defineProperty(this, "_onRef", ref => {
      this.conference = ref;
    });

    App_defineProperty(this, "_openOrCloseLeftContainer", collapsed => {
      this.props.setRoomState({
        collapsed: collapsed,
        hasUnreadMessages: false
      });
    });

    App_defineProperty(this, "_onMediaSettingsChanged", (selectedAudioDevice, selectedVideoDevice, resolution, bandwidth, codec, frameRate, isDevMode, reloadPage = false) => {
      this.props.setSettings({
        selectedAudioDevice,
        selectedVideoDevice,
        resolution,
        bandwidth,
        codec,
        frameRate,
        isDevMode
      });
      const constraints = {
        frameRate: frameRate,
        bitrate: bandwidth,
        resolution: resolution,
        advancedMediaConstraints: {
          audio: {
            deviceId: selectedAudioDevice
          },
          video: {
            deviceId: selectedVideoDevice
          }
        }
      };

      if (reloadPage) {
        this.props.client && this.props.client.applyConstraints(constraints, this.props.client.local);
      }
    });

    App_defineProperty(this, "_onMessageReceived", (from, message) => {
      console.log('Received message:' + from + ':' + message);
      let messages = this.props.roomState.messages;
      let uid = 1;
      messages.push(new Message({
        id: uid,
        message: message,
        senderName: from
      }));
      let hasUnreadMessages = false;

      if (this.props.roomState.collapsed) {
        hasUnreadMessages = true;
      }

      this.props.setRoomState({
        messages,
        hasUnreadMessages
      });
    });

    App_defineProperty(this, "_onSendMessage", data => {
      console.log('Send message:' + data);
      var info = {
        senderName: this.props.loginInfo.displayName,
        msg: data
      };
      this.props.client.broadcast(info, this.props.client.rid);
      let messages = this.props.roomState.messages;
      let uid = 0;
      messages.push(new Message({
        id: uid,
        message: data,
        senderName: 'me'
      }));
      this.props.setRoomState({
        messages
      });
    });

    props.setClient(null);
    props.setRoomState({
      isConnected: false
    });

    if (!props.settings.codec) {
      props.setSettings({
        selectedAudioDevice: '',
        selectedVideoDevice: '',
        resolution: 'qvga',
        bandwidth: 256,
        codec: 'vp8',
        frameRate: 20,
        isDevMode: true
      });
    }
  }

  isValidParams() {
    const validRoomPattern = /^[a-zA-Z0-9-.:_]*$/g;
    const validRoles = Object.values(constants["b" /* ROLES */]);
    const validEnvs = Object.values(constants["a" /* ENVS */]);

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
      vidFit
    } = this.props.roomState;
    const isValidParams = this.isValidParams()[0];
    return App_jsx(external_antd_["Layout"], {
      className: "app-layout"
    }, App_jsx(Header, {
      className: "app-header",
      style: {
        backgroundColor: '#1a1619',
        zIndex: '10',
        padding: '0 0',
        margin: '0 auto',
        width: '100%'
      }
    }, App_jsx("div", {
      className: "app-header-left"
    }, App_jsx("a", {
      href: "https://100ms.live/",
      target: "_blank"
    }, App_jsx("img", {
      src: "/logo-blue-dark.svg",
      className: "h-8"
    }))), App_jsx("div", {
      className: "app-header-right"
    }, App_jsx(Settings_MediaSettings, {
      onMediaSettingsChanged: this._onMediaSettingsChanged,
      settings: this.props.settings,
      isLoggedIn: login,
      setLocalStreamError: this.props.setLocalStreamError
    }))), App_jsx(Content, {
      className: "app-center-layout"
    }, !isValidParams ? App_jsx("div", {
      className: "min-h-screen flex items-center justify-center w-full py-8 px-4 sm:px-6 lg:px-8",
      style: {
        backgroundColor: '#0F141D'
      }
    }, App_jsx("div", {
      className: "overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3"
    }, App_jsx("div", {
      className: ""
    }, App_jsx("h2", {
      className: "mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900"
    }, "100ms Conference"), App_jsx("p", {
      className: "mt-2 text-center text-sm leading-5 text-gray-600 mb-2"
    }, "The requested ", this.isValidParams()[1], " is invalid. Please verify your credentials."), App_jsx("button", {
      className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150 ease-in-out",
      onClick: () => {
        this._cleanUp();

        location.reload();
      }
    }, "Back to Home")))) : login ? App_jsx(external_antd_["Layout"], {
      className: "app-content-layout"
    }, App_jsx(Sider, {
      width: 320,
      collapsedWidth: 0,
      trigger: null,
      collapsible: true,
      collapsed: collapsed,
      style: {
        backgroundColor: '#1a1619'
      }
    }, App_jsx("div", {
      className: "left-container"
    }, App_jsx(Chat_ChatFeed, {
      messages: this.props.roomState.messages,
      onSendMessage: this._onSendMessage,
      onClose: () => this._openOrCloseLeftContainer(!collapsed)
    }))), App_jsx(external_antd_["Layout"], {
      className: "app-right-layout",
      style: {
        height: 'calc(100vh - 64px)'
      }
    }, App_jsx(Content, {
      style: {
        flex: 1,
        position: 'relative'
      }
    }, App_jsx("div", null, App_jsx(AppContext.Consumer, null, context => App_jsx(components_Conference, {
      roomName: this.props.loginInfo.roomName,
      roomId: this.props.loginInfo.roomId,
      collapsed: this.props.roomState.collapsed,
      client: context.client,
      settings: context.settings,
      localAudioEnabled: localAudioEnabled,
      localVideoEnabled: localVideoEnabled,
      vidFit: vidFit,
      loginInfo: this.props.loginInfo,
      ref: ref => {
        this.conference = ref;
      },
      onScreenToggle: () => this._handleScreenSharing(!screenSharingEnabled),
      onLeave: this._handleLeave,
      onChatToggle: () => {
        this._openOrCloseLeftContainer(!collapsed);
      },
      isChatOpen: !this.props.roomState.collapsed,
      cleanUp: this._cleanUp,
      role: this.props.loginInfo.role,
      hasUnreadMessages: this.props.roomState.hasUnreadMessages,
      setLocalStreamError: this.props.setLocalStreamError
    })))))) : loading ? App_jsx("div", {
      className: "flex items-center justify-center",
      style: {
        height: 'calc(100vh - 64px)'
      }
    }, App_jsx(external_antd_["Spin"], {
      size: "large",
      tip: "Connecting..."
    })) : App_jsx("div", {
      className: "relative w-full"
    }, App_jsx(AppContext.Consumer, null, context => App_jsx(components_LoginForm, {
      settings: context.settings,
      loginInfo: context.loginInfo,
      setSettings: context.setSettings,
      setLoginInfo: context.setLoginInfo,
      handleLogin: this._handleJoin,
      createClient: this._createClient,
      client: context.client,
      setClient: context.setClient,
      roomState: context.roomState,
      setRoomState: context.setRoomState,
      setLocalStreamError: this.props.setLocalStreamError
    }))), this.props.localStreamError && App_jsx(external_antd_["Modal"], {
      visible: !!this.props.localStreamError,
      title: this.props.localStreamError.title,
      footer: [App_jsx(external_antd_["Button"], {
        key: "submit",
        type: "primary",
        onClick: () => {
          this._cleanUp(false);
        }
      }, "Try Again")]
    }, App_jsx("p", null, this.props.localStreamError.message))));
  }

}

class App_OldApp extends external_react_default.a.Component {
  render() {
    return App_jsx(AppContext.Consumer, null, context => App_jsx(App_OldAppUI, {
      settings: context.settings,
      roomState: context.roomState,
      loginInfo: context.loginInfo,
      setSettings: context.setSettings,
      setLoginInfo: context.setLoginInfo,
      setRoomState: context.setRoomState,
      setClient: context.setClient,
      client: context.client,
      localStreamError: context.localStreamError,
      setLocalStreamError: context.setLocalStreamError
    }));
  }

}

class App_App extends external_react_default.a.Component {
  render() {
    return App_jsx(AppContext_AppContextProvider, null, App_jsx(App_OldApp, null));
  }

}

/* harmony default export */ var components_App = __webpack_exports__["default"] = (App_App);

/***/ })

};;