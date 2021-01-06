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

const isSupported = () => {
  //TODO replace with firebase
  const browser = Bowser.getParser(window.navigator.userAgent);
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

const getLocalStreamException = error => {
  let title, message;
  if (error.name == 'NotFoundError') {
    //required track is missing
    title = 'Camera/Microphone not detected!';
    message =
      'We were unable to detect any camera/microphone devices. Please connect and try again.';
  } else if (error.name == 'NotReadableError') {
    //webcam or mic are already in use
    title = 'Camera/Microphone not accessible!';
    message =
      'Please close any other application using camera/microphone and try again.';
  } else if (error.name == 'OverconstrainedError') {
    //constraints can not be satisfied by avb. devices
  } else if (error.name == 'NotAllowedError') {
    //permission denied in browser
    title = 'Permission Denied!';
    message =
      'Please grant camera/microphone permissions in the address bar or site settings and try again.';
  } else if (error.name == 'TypeError') {
    return null; // returning null continues the call without error modal.
  } else {
    //other errors
    title = 'Unable to access camera/microphone!';
    message = 'Please switch your device and try again.';
  }
  console.log('LocalStream error: ', { error: error.name, title, message });
  return { title, message };
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

export {
  closeMediaStream,
  attachMediaStream,
  updateInputDevices,
  SingleSelect,
  isSupported,
  getLocalStreamException,
  getUserMedia,
};
