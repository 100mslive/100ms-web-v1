import React from 'react';
import { notification, Avatar, Badge, Tooltip } from 'antd';
import { Formik, Form, Field } from 'formik';
import { LocalStream } from '@100mslive/hmsvideo-web';
import { reactLocalStorage } from 'reactjs-localstorage';
import {
  updateInputDevices,
  SingleSelect,
  closeMediaStream,
  attachMediaStream,
  isSupported,
} from '../src/utils';
import SoundMeter from './settings/soundmeter';

import '../styles/css/login.scss';

import CheckIcon from 'mdi-react/CheckIcon';
import ServerNetworkIcon from 'mdi-react/ServerNetworkIcon';
import GoogleClassroomIcon from 'mdi-react/GoogleClassroomIcon';
import ProgressClockIcon from 'mdi-react/ProgressClockIcon';
import ProgressAlertIcon from 'mdi-react/ProgressAlertIcon';
import ProgressCloseIcon from 'mdi-react/ProgressCloseIcon';
import UploadLockIcon from 'mdi-react/UploadLockIcon';
import DownloadLockIcon from 'mdi-react/DownloadLockIcon';
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';

import { ROLES } from './constants';
import LoginTextField from './components/LoginTextField';

let testUpdateLoop;

const TEST_STEPS = {
  biz: { title: 'Biz Websocket', icon: <ServerNetworkIcon /> },
  lobby: { title: 'Joining Test Room', icon: <GoogleClassroomIcon /> },
  publish: { title: 'Publish', icon: <UploadLockIcon /> },
  subscribe: { title: 'Subscription', icon: <DownloadLockIcon /> },
};

const ICONS = {
  connected: CheckIcon,
  ok: CheckIcon,
  pending: ProgressClockIcon,
  warning: ProgressAlertIcon,
  'no candidates': ProgressAlertIcon,
  error: ProgressCloseIcon,
  joined: CheckIcon,
  published: CheckIcon,
  subscribed: CheckIcon,
  back: ArrowLeftIcon,
};

const DEFAULT_STATE = {
  testing: null,
  success: null,
  steps: TEST_STEPS,
};
const ConnectionStep = ({ step }) => {
  const color =
    step.status === 'pending'
      ? null
      : step.status === 'warning' || step.status === 'no candidates'
      ? 'orange'
      : step.status === 'error'
      ? 'red'
      : 'green';
  const Icon = ICONS[step.status];

  return (
    <div className="test-connection-step">
      <Badge count={Icon ? <Icon style={{ color }} /> : null}>
        <Tooltip
          title={
            <>
              {step.title}
              {step.status ? ': ' + step.status : null}
              {step.info ? <div>{step.info}</div> : null}
            </>
          }
        >
          <Avatar shape="square" size="large" icon={step.icon} />
        </Tooltip>
      </Badge>
    </div>
  );
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.state.formStage = 'ROOM';
  }

  testUpdateLoop = null;
  localStorage = reactLocalStorage.getObject('loginInfo');
  role =
    this.getRequest() && this.getRequest().hasOwnProperty('role')
      ? this.getRequest().role
      : this.localStorage && this.localStorage.role
      ? this.localStorage.role
      : '';
  roomId =
    this.getRequest() && this.getRequest().hasOwnProperty('room')
      ? this.getRequest().room
      : '';
  env = process.env.SFU_ENV
    ? process.env.SFU_ENV
    : this.getRequest() && this.getRequest().hasOwnProperty('env')
    ? this.getRequest().env
    : '';
  displayName = this.localStorage
    ? this.localStorage.displayName
      ? this.localStorage.displayName
      : ''
    : '';
  audioOnly = this.localStorage
    ? this.localStorage.audioOnly
      ? this.localStorage.audioOnly
      : false
    : false;
  videoOnly = this.localStorage
    ? this.localStorage.videoOnly
      ? this.localStorage.videoOnly
      : false
    : false;
  permissionGranted = this.localStorage
    ? this.localStorage.permissionGranted
      ? this.localStorage.permissionGranted
      : false
    : false;

  componentDidMount = () => {
    console.log(`%c[APP] Role=${this.role}`);
    this.setState({
      ...this.state,
      isSupported: isSupported(),
    });
    //const { form } = this.props;
    console.log('window.location:' + window.location);
    console.log(
      'url:' +
        window.location.protocol +
        window.location.host +
        '  ' +
        window.location.pathname +
        window.location.query
    );
    console.log('Making test client');
    let formStage = 'ROOM';

    this.state.settings =
      reactLocalStorage.getObject('settings').codec !== undefined
        ? reactLocalStorage.getObject('settings')
        : {
            selectedAudioDevice: '',
            selectedVideoDevice: '',
            // selectedAudioOutputDevice: "",
            resolution: 'qvga',
            bandwidth: 256,
            codec: 'vp8',
            isDevMode: true,
          };

    if (this.role === ROLES.LIVE_RECORD && this.roomId !== '') {
      console.log(
        `%c[APP] Skipping audio & video permission promt for the live-record bot`,
        'color: blue'
      );
      const handleLogin = this.props.handleLogin;
      handleLogin({
        displayName: null,
        role: ROLES.LIVE_RECORD,
        roomId: this.roomId,
        roomName: this.roomName,
        env: this.env,
        audioOnly: false,
        videoOnly: false,
        permissionGranted: false,
        selectedAudioDevice: null,
        selectedVideoDevice: null,
      });
    }

    // ToDo: Show a confirmation dialog for ROLES.VIEWER

    this.state.audioOnly = this.audioOnly;
    this.state.videoOnly = this.videoOnly;
    this.state.permissionGranted = this.permissionGranted;
    this.state.permissionText =
      'We will need your permission to use your webcam and microphone.';

    if (this.displayName !== '' && this.roomId !== '' && this.env !== '') {
      if (this.state.permissionGranted) {
        if (
          this.state.settings.selectedAudioDevice === '' &&
          this.state.settings.selectedVideoDevice === ''
        ) {
          console.log('Showing preview');
          this.updateDeviceList(() => {
            this.setState({
              ...this.state,
              formValues: values,
              formStage: 'PREVIEW',
            });
          });
        } else {
          console.log("Let's go to conference");
          const handleLogin = this.props.handleLogin;
          handleLogin({
            displayName: this.displayName,
            role: this.role,
            roomId: this.roomId,
            roomName: this.roomName,
            env: this.env,
            audioOnly: this.state.audioOnly,
            videoOnly: this.state.videoOnly,
            permissionGranted: this.state.permissionGranted,
            selectedAudioDevice: this.state.settings.selectedAudioDevice,
            selectedVideoDevice: this.state.settings.selectedVideoDevice,
          });
        }
        //TODO is this dead code
        this.updateDeviceList(() => {
          formStage = 'PREVIEW';
          this.setState({
            ...this.state,
            formStage: formStage,
          });
        });
      } else {
        formStage = 'PERMISSION';
        this.setState({
          ...this.state,
          formStage: formStage,
        });
      }
    } else {
      console.log(`[FormStage: ${formStage}]`);
      if (this.roomId != '') {
        formStage = 'JOIN_ROOM';
      }
      this.setState({
        ...this.state,
        formStage: formStage,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevState.formStage || this.state.formStage) &&
      prevState.formStage !== this.state.formStage
    ) {
      if (this.state.formStage === 'PREVIEW') {
        this.startPreview(false);
        //console.log("Start preview called from state change componentDidUpdate preview check")
      }
    }
  }

  componentWillUnmount = () => {
    this._cleanup();
  };

  _notification = (message, description, type = 'info') => {
    if (type == 'info') {
      notification.info({
        message: message,
        description: description,
        placement: 'bottomRight',
      });
    } else if (type == 'error') {
      notification.error({
        message: message,
        description: description,
        placement: 'bottomRight',
      });
    }
  };

  _testStep(step, status, info = null) {
    const prior = this.state.steps[step];
    this.setState({
      steps: {
        ...this.state.steps,
        [step]: { ...prior, status, info },
      },
    });
    console.log('Test Connection:', step, status, info);
  }

  _stopMediaStream = async stream => {
    let tracks = stream.getTracks();
    for (let i = 0, len = tracks.length; i < len; i++) {
      await tracks[i].stop();
    }
  };

  _cleanup = async () => {
    if (testUpdateLoop) clearInterval(testUpdateLoop);
    if (this.stream) {
      await this._stopMediaStream(this.stream);
      await this.client.unpublish(this.stream, this.client.rid);
    }
    if (this.client) await this.client.leave();
  };

  _testConnection = async () => {
    this.setState({ test: true });
    this._testStep('biz', 'pending');
    let client = this.props.createClient();
    testUpdateLoop = null;

    window.onunload = () => {
      cleanup();
    };

    client.on('transport-open', async () => {
      console.log('{{{{{{');
      this._testStep('biz', 'connected', client.url);
      this._testStep('lobby', 'pending');
      const rid = 'lobby-' + Math.floor(1000000 * Math.random());
      await this.client.join(rid, { name: 'lobby-user' });
      this._testStep('lobby', 'joined', 'room id=' + rid);
      const localStream = await LocalStream.getUserMedia({
        codec: 'VP8',
        resolution: 'hd',
        bandwidth: 1024,
        audio: true,
        video: true,
      });

      this._testStep('publish', 'pending');

      const publish = await client.publish(localStream);

      let nominated = null;

      const testConnectionUpdateLoop = () => {
        updateConnectionStats();
        const subStatus = this.state.steps.subscribe.status;
        if (subStatus === 'pending' || subStatus === 'error') {
          trySubscribe();
        }
      };
      testUpdateLoop = setInterval(testConnectionUpdateLoop, 3000);
      setTimeout(testConnectionUpdateLoop, 150);

      const trySubscribe = async () => {
        const mid = client.local.mid;
        let tracks = {};

        try {
          for (let track of localStream.getTracks()) {
            tracks[`${mid} ${track.id}`] = {
              codec: track.codec,
              fmtp: '',
              id: track.id,
              pt: client.local.transport.rtp[0].payload,
              type: track.kind,
            };
          }
        } catch (e) {
          console.log('No tracks yet...');
        }

        if (!mid) return;
        client.knownStreams.set(mid, objToStrMap(tracks));

        console.log('Trying to subscribe to ...', mid);

        try {
          let stream = await client.subscribe(mid);
          this._testStep('subscribe', 'subscribed', 'mid: ' + mid);
        } catch (e) {
          console.log(e);
          this._testStep('subscribe', 'error');
        }
      };

      const updateConnectionStats = async () => {
        const report = await client.local.transport.pc.getStats();
        const stats = {};
        for (let [name, stat] of report) {
          stats[name] = stat;
          if (stat.nominated) {
            nominated = stat;
          }
        }

        if (nominated) {
          const latency = nominated.currentRoundTripTime;
          const availableBitrate = nominated.availableOutgoingBitrate;
          const info =
            `${localStream.getTracks().length} tracks, ${Math.floor(
              latency / 1000.0
            )}ms latency` +
            (availableBitrate
              ? `, ${Math.floor(availableBitrate / 1024)}kbps available`
              : '');
          this._testStep('publish', 'published', info);
        } else {
          this._testStep('publish', 'no candidates');
        }
      };

      this._testStep('subscribe', 'pending');
    });

    window.test_client = this.client = client;
  };

  updateDeviceList = callback => {
    updateInputDevices().then(data => {
      if (
        this.state.settings.selectedAudioDevice === '' &&
        data.audioDevices.length > 0
      ) {
        this.state.settings.selectedAudioDevice = data.audioDevices[0].deviceId;
      }
      if (
        this.state.settings.selectedVideoDevice === '' &&
        data.videoDevices.length > 0
      ) {
        this.state.settings.selectedVideoDevice = data.videoDevices[0].deviceId;
      }

      // if (
      //   this.state.settings.selectedAudioOutputDevice === "" &&
      //   data.audioOutputDevices.length > 0
      // ) {
      //   console.log("setting output device")
      //   this.state.settings.selectedAudioOutputDevice =
      //     data.audioOutputDevices[0].deviceId
      // }

      this.setState({
        ...this.state,
        videoDevices: data.videoDevices,
        audioDevices: data.audioDevices,
        audioOutputDevices: data.audioOutputDevices,
      });
      if (callback) {
        callback();
      }
    });
  };

  handleCreateSubmit = async values => {
    const endpoint = process.env.CREATE_ROOM_ENDPOINT;
    console.log('endpoint', endpoint);
    console.log('Create Room values: ', values);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        room_name: values.roomName,
        recording_info: {
          enabled: values.isRecording,
        },
        env: values.env,
      }),
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
      this._notification(
        'Room Created',
        `Room Id: ${values.roomId} Room Name: ${values.roomName}`
      );
      this.handleNameSubmit(values);
    }
  };

  handleJoinSubmit = values => {
    // TODO: How to get roomName from roomId
    this.handleNameSubmit(values);
  };

  handleNameSubmit = values => {
    this.roomId = values.roomId;
    console.log(this.state.permissionGranted);

    const role = values.role ? values.role : this.role;
    const displayName = values.displayName
      ? values.displayName
      : this.displayName;

    if (role === ROLES.VIEWER) {
      this.props.handleLogin({
        displayName,
        role: ROLES.VIEWER,
        roomId: this.roomId,
        roomName: values.roomName ? values.roomName : this.roomName,
        env: values.env ? values.env : this.env,
        audioOnly: false,
        videoOnly: false,
        permissionGranted: false,
        selectedAudioDevice: null,
        selectedVideoDevice: null,
      });
    } else if (this.state.permissionGranted) {
      if (
        this.state.settings.selectedAudioDevice === '' &&
        this.state.settings.selectedVideoDevice === ''
      ) {
        console.log('Showing preview');
        this.updateDeviceList(() => {
          this.setState({
            ...this.state,
            formValues: values,
            formStage: 'PREVIEW',
          });
        });
      } else {
        console.log("Let's go to conference");
        const handleLogin = this.props.handleLogin;
        handleLogin({
          displayName,
          role: values.role ? values.role : this.role,
          roomId: values.roomId ? values.roomId : this.roomId,
          roomName: values.roomName ? values.roomName : this.roomName,
          env: values.env ? values.env : this.env,
          //TODO audioOnly should be moved into settings
          //TODO this is repeated from componentdidmount
          audioOnly: this.state.audioOnly,
          videoOnly: this.state.videoOnly,
          permissionGranted: this.state.permissionGranted,
          selectedAudioDevice: this.state.settings.selectedAudioDevice,
          selectedVideoDevice: this.state.settings.selectedVideoDevice,
        });
      }
    } else {
      console.log('In else part');
      this.setState({
        ...this.state,
        formValues: values,
        formStage: 'PERMISSION',
      });
    }

    // this.state.audioDevices.map((device, index) => {
    //     if (this.state.selectedAudioDevice == device.deviceId) {
    //         console.log("Selected audioDevice::" + JSON.stringify(device));
    //     }
    // });
    // this.state.videoDevices.map((device, index) => {
    //     if (this.state.selectedVideoDevice == device.deviceId) {
    //         console.log("Selected videoDevice::" + JSON.stringify(device));
    //     }
    // });
  };

  handleSubmit = values => {
    const handleLogin = this.props.handleLogin;
    closeMediaStream();
    console.log('Values in handleSubmit: ', values);
    console.log('this.roomId in handleSubmit: ', this.roomId);
    handleLogin({
      displayName: this.state.formValues
        ? this.state.formValues.displayName
        : this.displayName,
      role: values.role ? values.role : this.role,
      roomId: this.roomId,
      roomName: this.state.formValues
        ? this.state.formValues.roomName
        : this.roomName,
      env: this.state.formValues ? this.state.formValues.env : this.env,
      audioOnly: values.audioOnly,
      videoOnly: values.videoOnly,
      permissionGranted: this.state.permissionGranted,
      selectedAudioDevice: values.selectedAudioDevice,
      selectedVideoDevice: values.selectedVideoDevice,
    });
  };

  soundMeterProcess = () => {
    var val = window.soundMeter.instant.toFixed(2) * 700 + 1;
    this.setState({ ...this.state, audioLevel: val });
    //      if (this.state.visible)
    setTimeout(this.soundMeterProcess, 100);
  };

  startPreview = (permissionTestMode = false) => {
    if (window.stream) {
      closeMediaStream(window.stream);
    }
    let audioSource = this.state.settings.selectedAudioDevice;
    let videoSource = this.state.settings.selectedVideoDevice;
    let videoElement, soundMeterProcess;
    if (!permissionTestMode) {
      videoElement = document.getElementById('previewVideo');
      this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
      soundMeterProcess = this.soundMeterProcess;
    }
    let constraints = {
      audio: this.state.videoOnly
        ? false
        : { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: this.state.audioOnly
        ? false
        : { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        if (!permissionTestMode) {
          window.stream = stream; // make stream available to console
          //videoElement.srcObject = stream;
          attachMediaStream(videoElement, stream);
          //TODO this throws an error when audio only is chosen. Handle it
          // if(this && !this.state.videoOnly){
          soundMeter.connectToSource(stream);
          setTimeout(soundMeterProcess, 100);
          // }
        }
        return navigator.mediaDevices.enumerateDevices();
        // Refresh button list in case labels have become available
      })
      .then(devices => {
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
        let data = { videoDevices, audioDevices, audioOutputDevices };
        if (
          this.state.settings.selectedAudioDevice === '' &&
          data.audioDevices.length > 0
        ) {
          this.state.settings.selectedAudioDevice =
            data.audioDevices[0].deviceId;
        }
        if (
          this.state.settings.selectedVideoDevice === '' &&
          data.videoDevices.length > 0
        ) {
          this.state.settings.selectedVideoDevice =
            data.videoDevices[0].deviceId;
        }
        this.setState({
          ...this.state,
          audioDevices: data.audioDevices,
          videoDevices: data.videoDevices,
          permissionGranted: true,
          formStage: 'PREVIEW',
        });
      })
      .catch(error => {
        //TODO - look for only permission error. Rest of the errors should be handled
        console.log(error);
        this.setState({
          ...this.state,
          permissionText:
            "You won't be able to access the meeting unless you grant camera and mic permissions",
        });
      });
  };

  getRequest() {
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
  }

  updateDevice = (name, value) => {
    this.state.settings[name] = value;
    //console.log("Inside updateDevice");
    this.startPreview(false);
  };

  render() {
    const steps = this.state.steps;
    console.log(this.state.formStage);
    const showEnv = !Boolean(process.env.SFU_ENV);

    return (
      <>
        {this.state.isSupported && (
          <div className="relative -mt-24 z-0">
            {this.state.formStage && this.state.formStage === 'ROOM' && (
              <>
                <div
                  className="min-h-screen flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#1a1619' }}
                >
                  <div className="overflow-hidden justify-right items-right shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100">
                    <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 mb-2">
                      100ms Conference
                    </h2>

                    <div className="mt-6 space-y-2">
                      <button
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          this.setState({
                            ...this.state,
                            formStage: 'CREATE_ROOM',
                          });
                        }}
                      >
                        Create Room
                      </button>
                      <button
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-700 hover:border-indigo-700 focus:outline-none border-indigo-600 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                        onClick={() => {
                          this.setState({
                            ...this.state,
                            formStage: 'JOIN_ROOM',
                          });
                        }}
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!this.roomId &&
              this.state.formStage &&
              this.state.formStage === 'CREATE_ROOM' && (
                <>
                  <Formik
                    initialValues={{
                      roomName: this.roomName
                        ? this.roomName
                        : this.state.formValues
                        ? this.state.formValues.roomName
                        : '',
                      displayName: this.displayName,
                      env: this.env
                        ? this.env
                        : this.state.formValues
                        ? this.state.formValues.env
                        : '',
                      role: this.role
                        ? this.role
                        : this.state.formValues
                        ? this.state.formValues.role
                        : 'Host',
                      isRecording: false,
                    }}
                    validate={values => {
                      const errors = {};
                      if (!values.displayName) {
                        errors.displayName = 'Required';
                      }
                      if (!values.roomName) {
                        errors.roomName = 'Required';
                      }
                      const validRoomPattern = /^[a-zA-Z0-9-.:_]*$/g;
                      if (!validRoomPattern.test(values.roomName)) {
                        errors.roomName =
                          'Accepted characters are a-z, A-Z, 0-9, . - : _';
                      }
                      if (showEnv && !values.env) {
                        errors.env = 'Required';
                      }
                      return errors;
                    }}
                    onSubmit={values => {
                      this.handleCreateSubmit(values);
                    }}
                  >
                    {({ errors, touched, initialValues }) => {
                      return (
                        <Form>
                          <div
                            className="min-h-screen flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8"
                            style={{ backgroundColor: '#1a1619' }}
                          >
                            <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 p-6 bg-gray-100">
                              <div>
                                <h2 className="text-center justify-center items-center text-3xl leading-9 font-extrabold text-gray-900 mb-2">
                                  {initialValues && (
                                    <>
                                      <ArrowLeftIcon
                                        className="text-gray-700 hover:text-black"
                                        onClick={() => {
                                          this.setState({
                                            ...this.state,
                                            formStage: 'ROOM',
                                          });
                                          this.roomId = '';
                                        }}
                                      />
                                      100ms Conference
                                    </>
                                  )}
                                </h2>
                              </div>
                              <div className="rounded-m">
                                <div>
                                  {initialValues && !initialValues.roomName && (
                                    <LoginTextField
                                      label="Room Name"
                                      name="roomName"
                                      className="rounded-t-md"
                                      placeholder="Room Name"
                                      errors={errors.roomName}
                                      touched={touched.roomName}
                                    />
                                  )}
                                </div>
                                <div className="-mt-px">
                                  {initialValues && (
                                    <LoginTextField
                                      label="Username"
                                      name="displayName"
                                      className={
                                        !(
                                          initialValues && !initialValues.roomId
                                        ) && 'rounded-t-md'
                                      }
                                      placeholder="Username"
                                      errors={errors.displayName}
                                      touched={touched.displayName}
                                    />
                                  )}
                                </div>
                                <div className="-mt-px">
                                  {initialValues && (
                                    <LoginTextField
                                      label="Role"
                                      name="role"
                                      className={!showEnv && 'rounded-b-md'}
                                      placeholder="Role"
                                      errors={errors.role}
                                      touched={touched.role}
                                    />
                                  )}
                                </div>

                                {showEnv && (
                                  <div className="-mt-px">
                                    {initialValues && (
                                      <LoginTextField
                                        label="Environment"
                                        name="env"
                                        className="rounded-b-md"
                                        placeholder="Environment (qa-in/staging-in/prod-in)"
                                        errors={errors.env}
                                        touched={touched.env}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="mt-6">
                                <label>
                                  <Field type="checkbox" name="isRecording" />
                                  {'  '} Record Room?
                                </label>
                              </div>

                              <div className="mt-6">
                                <button
                                  type="submit"
                                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                                >
                                  <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                                  Create Room
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                </>
              )}
            {this.state.formStage && this.state.formStage === 'JOIN_ROOM' && (
              <>
                <Formik
                  initialValues={{
                    roomId: this.roomId
                      ? this.roomId
                      : this.state.formValues
                      ? this.state.formValues.roomId
                      : '',
                    displayName: this.displayName,
                    env: this.env
                      ? this.env
                      : this.state.formValues
                      ? this.state.formValues.env
                      : '',
                    role: this.role
                      ? this.role
                      : this.state.formValues
                      ? this.state.formValues.role
                      : 'Guest',
                  }}
                  validate={values => {
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
                  }}
                  onSubmit={values => {
                    this.handleJoinSubmit(values);
                  }}
                >
                  {({ errors, touched, initialValues }) => (
                    <Form>
                      <div
                        className="min-h-screen flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8"
                        style={{ backgroundColor: '#1a1619' }}
                      >
                        <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 p-6 bg-gray-100">
                          <div>
                            {/* <img className="mx-auto h-12 w-auto" src={logo} /> */}

                            <h2 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mb-2">
                              {initialValues && (
                                <>
                                  <ArrowLeftIcon
                                    className="text-gray-700 hover:text-black"
                                    onClick={() => {
                                      this.setState({
                                        ...this.state,
                                        formStage: 'ROOM',
                                      });
                                      this.roomId = '';
                                    }}
                                  />
                                  100ms Conference
                                </>
                              )}
                            </h2>
                            {initialValues && initialValues.roomId && (
                              <p className="my-2 text-center text-sm leading-5 text-gray-600">
                                You are about to join room:{' '}
                                <span className="font-bold">
                                  {initialValues.roomId}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="rounded-md">
                            <div>
                              {initialValues && !initialValues.roomId && (
                                <LoginTextField
                                  label="Room ID"
                                  name="roomId"
                                  className="rounded-t-md"
                                  placeholder="Room ID"
                                  errors={errors.roomId}
                                  touched={touched.roomId}
                                />
                              )}
                            </div>
                            <div className="-mt-px">
                              {initialValues && (
                                <LoginTextField
                                  label="Username"
                                  name="displayName"
                                  className={
                                    !(initialValues && !initialValues.roomId) &&
                                    'rounded-t-md'
                                  }
                                  placeholder="Username"
                                  errors={errors.displayName}
                                  touched={touched.displayName}
                                />
                              )}
                            </div>
                            <div className="-mt-px">
                              {initialValues && (
                                <LoginTextField
                                  label="Role"
                                  name="role"
                                  className={!showEnv && 'rounded-b-md'}
                                  placeholder="Role"
                                  disabled={this.role === ROLES.VIEWER}
                                  errors={errors.role}
                                  touched={touched.role}
                                />
                              )}
                            </div>
                            {showEnv && (
                              <div className="-mt-px">
                                {initialValues && (
                                  <LoginTextField
                                    label="Environment"
                                    name="env"
                                    className="rounded-b-md"
                                    placeholder="Environment (qa-in/staging-in/prod-in)"
                                    errors={errors.env}
                                    touched={touched.env}
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-6">
                            <button
                              type="submit"
                              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                            >
                              <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                              Join Room
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            )}
            {this.state.formStage && this.state.formStage === 'PERMISSION' && (
              <>
                <div
                  className="min-h-screen flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#1a1619' }}
                >
                  <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100">
                    <div className="">
                      <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                        100ms Conference
                      </h2>

                      <p className="mt-2 text-center text-sm leading-5 text-gray-600 mb-2">
                        {this.state.permissionText}
                      </p>
                      <div className="mt-6">
                        <button
                          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                          onClick={() => {
                            this.startPreview(true);
                          }}
                        >
                          <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                          Prompt permission dialog
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {this.state.formStage && this.state.formStage === 'PREVIEW' && (
              <>
                <Formik
                  initialValues={{
                    selectedAudioDevice: this.state.settings
                      ? this.state.settings.selectedAudioDevice
                      : null,
                    selectedVideoDevice: this.state.settings
                      ? this.state.settings.selectedVideoDevice
                      : null,
                    // selectedAudioOutputDevice: this.state.settings
                    //   ? this.state.settings.selectedAudioOutputDevice
                    //   : null,
                    audioOnly: this.state.audioOnly,
                    videoOnly: this.state.videoOnly,
                  }}
                  validate={values => {
                    const errors = {};
                    // if (!values.displayName) {
                    //   errors.displayName = 'Required';
                    // }
                    // if (!values.roomName){
                    //   errors.roomName = 'Required';
                    // }
                    return errors;
                  }}
                  onSubmit={values => {
                    if (window.stream) {
                      closeMediaStream(window.stream);
                    }
                    this.handleSubmit(values);
                  }}
                >
                  {({ values, initialValues }) => (
                    <Form>
                      <div
                        className="min-h-screen flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8"
                        style={{ backgroundColor: '#1a1619' }}
                      >
                        <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100">
                          <div className="">
                            <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                              <>100ms Conference</>
                            </h2>
                            <p className="mt-2 text-center text-sm leading-5 text-gray-600 mb-2">
                              You are about to join{' '}
                              <span className="font-semibold">
                                {this.state.formValues
                                  ? this.state.formValues.roomName
                                  : this.roomName}
                              </span>{' '}
                              as{' '}
                              <span className="font-semibold">
                                {this.state.formValues
                                  ? this.state.formValues.displayName
                                  : this.displayName}
                              </span>
                              <button
                                className="rounded-md px-2 py-1 hover:bg-indigo-500 ml-1 border transition duration-150 ease-in-out"
                                onClick={() => {
                                  this.setState({
                                    ...this.state,
                                    formStage: 'NAME',
                                  });
                                }}
                              >
                                Change
                              </button>
                            </p>
                          </div>
                          <div className="relative h-48 bg-black rounded-md mb-3">
                            <video
                              id="previewVideo"
                              autoPlay
                              playsInline
                              muted={true}
                              className="rounded-md h-full w-full"
                            ></video>
                            {/* {values.audioOnly && (<div id='previewVideo' className="rounded-md mb-3 h-full w-full bg-black"></div>)} */}
                            <div className="absolute bottom-0 w-full flex justify-center pb-1">
                              <Field name="audioOnly">
                                {({
                                  field,
                                  form: { setFieldValue, values },
                                  meta,
                                }) => (
                                  <button
                                    onClick={e => {
                                      e.preventDefault();
                                      const initialValue = values.audioOnly;
                                      setFieldValue('audioOnly', !initialValue);
                                      this.state.audioOnly = !initialValue;
                                      this.startPreview(false);
                                    }}
                                    className={`py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out ${
                                      !values.audioOnly
                                        ? 'bg-opacity-50 bg-gray-600'
                                        : 'bg-indigo-600'
                                    }`}
                                  >
                                    {!values.audioOnly && (
                                      <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                    )}
                                    {values.audioOnly && (
                                      <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M15 10L19.553 7.724C19.7054 7.64784 19.8748 7.61188 20.045 7.61955C20.2152 7.62721 20.3806 7.67825 20.5256 7.76781C20.6706 7.85736 20.7902 7.98248 20.8733 8.13127C20.9563 8.28007 20.9999 8.44761 21 8.618V15.382C20.9999 15.5524 20.9563 15.7199 20.8733 15.8687C20.7902 16.0175 20.6706 16.1426 20.5256 16.2322C20.3806 16.3218 20.2152 16.3728 20.045 16.3805C19.8748 16.3881 19.7054 16.3522 19.553 16.276L15 14V10ZM5 18H13C13.5304 18 14.0391 17.7893 14.4142 17.4142C14.7893 17.0391 15 16.5304 15 16V8C15 7.46957 14.7893 6.96086 14.4142 6.58579C14.0391 6.21071 13.5304 6 13 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18Z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <line
                                          x1="2.00177"
                                          y1="19.7113"
                                          x2="16.1289"
                                          y2="4.10676"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                )}
                              </Field>
                              <Field name="videoOnly">
                                {({ form: { setFieldValue, values } }) => (
                                  <button
                                    onClick={e => {
                                      e.preventDefault();
                                      const initialValue = values.videoOnly;
                                      setFieldValue('videoOnly', !initialValue);
                                      this.state.videoOnly = !initialValue;
                                      this.startPreview(false);
                                    }}
                                    className={`ml-1 py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out ${
                                      !values.videoOnly
                                        ? 'bg-opacity-50 bg-gray-600'
                                        : 'bg-indigo-600'
                                    }`}
                                  >
                                    {!values.videoOnly && (
                                      <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        ></path>
                                      </svg>
                                    )}
                                    {values.videoOnly && (
                                      <svg
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M19 11C19 12.8565 18.2625 14.637 16.9497 15.9497C15.637 17.2625 13.8565 18 12 18M12 18C10.1435 18 8.36301 17.2625 7.05025 15.9497C5.7375 14.637 5 12.8565 5 11M12 18V22M12 22H8M12 22H16M12 14C11.2044 14 10.4413 13.6839 9.87868 13.1213C9.31607 12.5587 9 11.7956 9 11V5C9 4.20435 9.31607 3.44129 9.87868 2.87868C10.4413 2.31607 11.2044 2 12 2C12.7956 2 13.5587 2.31607 14.1213 2.87868C14.6839 3.44129 15 4.20435 15 5V11C15 11.7956 14.6839 12.5587 14.1213 13.1213C13.5587 13.6839 12.7956 14 12 14Z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <line
                                          x1="4.43121"
                                          y1="18.0549"
                                          x2="18.5583"
                                          y2="2.45033"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                )}
                              </Field>
                            </div>
                            <div className="px-1">
                              <div
                                style={{
                                  width: values.videoOnly
                                    ? '1px'
                                    : this.state.audioLevel + 'px',
                                  height: '4px',
                                  backgroundColor: '#8dc63f',
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="rounded-md shadow-sm">
                            <div>
                              {initialValues && (
                                <Field
                                  label="Audio Input"
                                  name="selectedAudioDevice"
                                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                                  placeholder="Audio Input"
                                  component={SingleSelect}
                                  options={this.state.audioDevices}
                                  updateDevice={this.updateDevice}
                                />
                              )}
                            </div>
                            <div className="-mt-px">
                              {initialValues && (
                                <Field
                                  label="Video Input"
                                  name="selectedVideoDevice"
                                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5`}
                                  placeholder="Video Input"
                                  component={SingleSelect}
                                  options={this.state.videoDevices}
                                  updateDevice={this.updateDevice}
                                />
                              )}
                            </div>
                            {/* <div className="-mt-px">
                          {initialValues && (
                            <Field
                              label="Autio Output"
                              name="selectedAudioOutputDevice"
                              className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5`}
                              placeholder="Audio Output"
                              component={SingleSelect}
                              options={this.state.audioOutputDevices}
                              updateDevice={this.updateDevice}
                            />
                          )}
                        </div> */}
                          </div>

                          <div className="mt-0">
                            <button
                              type="submit"
                              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                            >
                              <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                              Join
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </div>
        )}
        {!this.state.isSupported && (
          <>
            <div
              className="min-h-screen flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8"
              style={{ backgroundColor: '#1a1619' }}
            >
              <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100">
                <div className="">
                  <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    100ms Conference
                  </h2>

                  <p className="mt-2 text-center text-sm leading-5 text-gray-600 mb-2">
                    Your browser/OS is not supported by 100ms
                  </p>
                  <div className="mt-6">
                    <a
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                      href="https://www.google.com/chrome"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                      Download latest chrome
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

function objToStrMap(obj) {
  const strMap = new Map();
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

const WrappedLoginForm = LoginForm;
//const WrappedLoginForm = Form.create({ name: "login" })(LoginForm);
export default WrappedLoginForm;
