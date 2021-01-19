import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Bowser from 'bowser';

const closeMediaStream = function (stream) {
  if (!stream) {
    return;
  }
  if (
    MediaStreamTrack &&
    MediaStreamTrack.prototype &&
    MediaStreamTrack.prototype.stop
  ) {
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
    }
    // Deprecated by the spec, but still in use.
  } else if (typeof stream.stop === 'function') {
    console.log('closeMediaStream() | calling stop() on the MediaStream');
    stream.stop();
  }
};

// Attach a media stream to an element.
const attachMediaStream = function (element, stream) {
  element.srcObject = stream;
};

const updateInputDevices = () => {
  return new Promise((pResolve, pReject) => {
    let videoDevices = [];
    let audioDevices = [];
    let audioOutputDevices = [];
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        for (let device of devices) {
          if (device.kind === 'videoinput') {
            videoDevices.push(device);
          } else if (device.kind === 'audioinput') {
            audioDevices.push(device);
          } else if (device.kind === 'audiooutput') {
            audioOutputDevices.push(device);
          }
        }
      })
      .then(() => {
        let data = { videoDevices, audioDevices, audioOutputDevices };
        pResolve(data);
      });
  });
};

const SingleSelect = ({ field, form, ...props }) => {
  //TODO specific input for devices
  const { name, label } = field;
  const { options, updateDevice } = props;
  const { setFieldValue } = form;
  return (
    <>
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={form.values[name]}
          label={label}
          renderValue={value =>
            options.find(device => device.deviceId === value).label
          }
        >
          {options &&
            options.map((option, index) => (
              <div
                onClick={e => {
                  e.preventDefault();
                  setFieldValue(name, option.deviceId);
                  updateDevice(name, option.deviceId);
                }}
                key={index}
              >
                <MenuItem key={index} value={option.deviceId}>
                  {option.label}
                </MenuItem>
              </div>
            ))}
        </Select>
      </FormControl>
      <style jsx="true">
        {`
          .MuiFormControl-root {
            width: 100%;
            margin-bottom: 12px;
          }
        `}
      </style>
    </>
  );
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
  const browser = Bowser.getParser(window.navigator.userAgent);
  if (browser.getOS().name == 'iOS') {
    return {
      supported: false,
      failureCause: 'iOS',
    };
  } else if (browser.getBrowserName() != 'Chrome') {
    return {
      supported: false,
      failureCause: 'browser',
    };
  }

  return {
    supported: true,
    failureCause: null,
  };
  //TODO replace with firebase
  const isValidBrowser = browser.satisfies({
    //TODO add precise versions after checking with browserstack
    windows: {
      'internet explorer': '>10',
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44',
    },
    linux: {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44',
    },
    macos: {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44',
    },
    ios: {
      safari: '>9999',
      firefox: '>9999',
      opera: '>9999',
      chrome: '>9999',
    },
    android: {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44',
    },
    'Chrome OS': {
      safari: '>9999',
      chrome: '>57',
      firefox: '>52',
      opera: '>44',
    },
  });
  return isValidBrowser;
};

let localStreamErrors = new Map();
//required track is missing
localStreamErrors.set('NotFoundError', {
  title: 'Camera/Microphone not detected!',
  message:
    'We were unable to detect any camera/microphone devices. Please connect and try again.',
});
//webcam or mic are already in use
localStreamErrors.set('NotReadableError', {
  title: 'Camera/Microphone not accessible!',
  message:
    'Please close any other application using camera/microphone and try again.',
});
//constraints can not be satisfied by avb. devices
localStreamErrors.set('OverconstrainedError', {
  title: 'Invalid Audio/Video constraints',
  message: 'The constraints provided for audio/video cannot be met.',
});
//permission denied in browser
localStreamErrors.set('NotAllowedError', {
  title: 'Permission Denied!',
  message:
    'Please grant camera/microphone permissions in the address bar or site settings and try again.',
});
// returning null continues the call without error modal.
localStreamErrors.set('TypeError', null);

const getLocalStreamException = error => {
  let errorMessage = null;
  if (localStreamErrors.has(error.name)) {
    errorMessage = localStreamErrors.get(error.name);
  } else {
    //other errors
    errorMessage = {
      title: 'Unable to access camera/microphone!',
      message: 'Please switch your device and try again.',
    };
  }
  console.log('LocalStream error: ', { error: error.name, ...errorMessage });
  return errorMessage;
};

const getUserMedia = constraints => {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
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
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        const audio = devices.some(
          val => val.kind === 'audioinput' && val.label !== ''
        );
        const video = devices.some(
          val => val.kind === 'videoinput' && val.label !== ''
        );
        if (audio && video) {
          resolve(true);
        }
        reject();
      })
      .catch(err => reject(error));
  });
}

export {
  closeMediaStream,
  attachMediaStream,
  updateInputDevices,
  SingleSelect,
  getRequest,
  deviceSupport,
  getLocalStreamException,
  getUserMedia,
  getPermissionStatus,
};
