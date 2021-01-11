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

const isSupported = () => {
  return true;
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

export {
  closeMediaStream,
  attachMediaStream,
  updateInputDevices,
  SingleSelect,
  isSupported,
  getRequest,
};
