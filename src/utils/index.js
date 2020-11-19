import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

export {
  closeMediaStream,
  attachMediaStream,
  updateInputDevices,
  SingleSelect,
};
