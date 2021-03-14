import React from 'react';
import { notification } from 'antd';
import { Formik, Form, Field } from 'formik';
import { LocalStream } from '@100mslive/hmsvideo-web';
import {
  updateInputDevices,
  SingleSelect,
  closeMediaStream,
  attachMediaStream,
  getRequest,
  deviceSupport,
  getUserMedia,
  getPermissionStatus,
} from '../utils';
import SoundMeter from './Settings/soundmeter';

import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';

import { ROLES } from '../constants';
import LoginTextField from './LoginTextField';
import {changeToSecondaryColor} from "./../changeTheme"

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formStage: 'JOIN_ROOM',
      permissionGranted: false,
      isSupported: deviceSupport().supported,
    };

    let role = '';
    let roomId = '';
    let env = process.env.NEXT_PUBLIC_SFU_ENV || 'prod-in';
    let displayName =
      localStorage.getItem('loginInfo.displayName') ||
      props.loginInfo.displayName ||
      '';

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
      displayName,
    });
  }

  componentDidMount = async () => {
    console.log(`%c[APP] Role=${this.props.loginInfo.role}`);

    this.setState({
      isSupported: deviceSupport().supported,
    });

    await this.updatePermission();

    console.log({ permissionGranted: this.state.permissionGranted });
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

    // if (!this.props.settings.codec) {
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

    if (
      this.props.loginInfo.role === ROLES.LIVE_RECORD &&
      this.props.loginInfo.roomId !== ''
    ) {
      console.log(
        `%c[APP] Skipping audio & video permission promt for the live-record bot`,
        'color: blue'
      );
      const handleLogin = this.props.handleLogin;
      this.props.setLoginInfo({
        displayName: null,
        role: ROLES.LIVE_RECORD,
      });
      handleLogin();
      return;
    }

    // ToDo: Show a confirmation dialog for ROLES.VIEWER

    this.setState({
      permissionText:
        'We will need your permission to use your webcam and microphone.',
    });

    if (
      getRequest() &&
      getRequest().hasOwnProperty('room') &&
      this.props.loginInfo.displayName !== '' &&
      this.props.loginInfo.roomId !== '' &&
      this.props.loginInfo.env !== ''
    ) {
      if (this.state.permissionGranted) {
        console.log('Showing preview');
        this.startPreview(true);
      } else {
        this.setState({ formStage: 'PERMISSION' });
      }
    } else {
      let formStage = 'JOIN_ROOM';
      console.log(`[FormStage: ${formStage}]`);
      if (this.props.loginInfo.roomId != '') {
        formStage = 'JOIN_ROOM';
      }
      this.setState({ formStage: formStage });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    //console.log(prevState.formStage)
    //console.log("current ", this.state.formStage)
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

  _stopMediaStream = async stream => {
    let tracks = stream.getTracks();
    for (let i = 0, len = tracks.length; i < len; i++) {
      await tracks[i].stop();
    }
  };

  _cleanup = async () => {
    if (this.stream) {
      await this._stopMediaStream(this.stream);
      await this.client.unpublish(this.stream, this.client.rid);
    }
    if (this.client) await this.client.leave();
  };

  updateDeviceList = callback => {
    updateInputDevices().then(data => {
      if (
        this.props.settings.selectedAudioDevice === '' &&
        data.audioDevices.length > 0
      ) {
        this.props.setSettings({
          selectedAudioDevice: data.audioDevices[0].deviceId,
        });
      }
      if (
        this.props.settings.selectedVideoDevice === '' &&
        data.videoDevices.length > 0
      ) {
        this.props.setSettings({
          selectedVideoDevice: data.videoDevices[0].deviceId,
        });
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
    const endpoint =
      process.env.NEXT_PUBLIC_CREATE_ROOM_ENDPOINT || '/api/room';
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
    console.log(this.state.permissionGranted);
    this.props.setLoginInfo({
      roomId: values.roomId,
    });
    if (values.roomName) {
      this.props.setLoginInfo({
        roomName: values.roomName,
      });
    }
    if (values.role) {
      this.props.setLoginInfo({
        role: values.role,
      });
    }
    if (values.env) {
      this.props.setLoginInfo({
        env: values.env,
      });
    }
    if (values.displayName) {
      this.props.setLoginInfo({
        displayName: values.displayName,
      });
    }

    if (this.props.loginInfo.role === ROLES.VIEWER) {
      this.props.handleLogin();
    } else if (this.state.permissionGranted) {
      console.log('Showing preview');
      this.startPreview(true);
    } else {
      this.setState({ formValues: values, formStage: 'PERMISSION' });
    }
  };

  handleSubmit = values => {
    const handleLogin = this.props.handleLogin;
    console.log('Values in handleSubmit: ', values);
    console.log(
      'this.props.loginInfo.roomId in handleSubmit: ',
      this.props.loginInfo.roomId
    );
    if (values.role) this.props.setLoginInfo({ role: values.role });
    if (this.state.formValues)
      this.props.setLoginInfo({
        displayName:
          this.state.formValues.displayName ||
          localStorage.getItem('loginInfo.displayName') ||
          '',
        roomName: this.state.formValues.roomName,
        env: this.state.formValues.env,
      });
    handleLogin();
  };

  updatePermission = async () => {
    await getPermissionStatus()
      .then(permission => {
        if (permission) {
          this.setState({ permissionGranted: true });
        } else {
          this.setState({ permissionGranted: false });
        }
      })
      .catch(error => {
        console.log({ permissionError: error });
        this.setState({ permissionGranted: false });
      });
  };

  soundMeterProcess = () => {
    var val = window.soundMeter.instant.toFixed(2) * 700 + 1;
    this.setState({ audioLevel: val });
    //      if (this.state.visible)
    setTimeout(this.soundMeterProcess, 100);
  };

  startPreview = (permissionTestMode = false) => {
    closeMediaStream(window.stream);
    let audioSource = this.props.settings.selectedAudioDevice;
    let videoSource = this.props.settings.selectedVideoDevice;
    let videoElement, soundMeterProcess;
    if (!permissionTestMode) {
      videoElement = document.getElementById('previewVideo');
      // this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
      // soundMeterProcess = this.soundMeterProcess;
    }
    let constraints = {
      audio: !this.props.roomState.localAudioEnabled
        ? true
        : { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: !this.props.roomState.localVideoEnabled
        ? true
        : { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    getUserMedia(constraints)
      .then(stream => {
        if (!permissionTestMode) {
          window.stream = stream; // make stream available to console
          //videoElement.srcObject = stream;
          attachMediaStream(videoElement, stream);
          //TODO this throws an error when audio only is chosen. Handle it
          // if (this.props.roomState.localAudioEnabled) {
          //   soundMeter.connectToSource(stream);
          //   setTimeout(soundMeterProcess, 100);
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
          this.props.settings.selectedAudioDevice === '' &&
          data.audioDevices.length > 0
        ) {
          this.props.setSettings({
            selectedAudioDevice: data.audioDevices[0].deviceId,
          });
        }
        if (
          this.props.settings.selectedVideoDevice === '' &&
          data.videoDevices.length > 0
        ) {
          this.props.setSettings({
            selectedVideoDevice: data.videoDevices[0].deviceId,
          });
        }
        this.setState({
          audioDevices: data.audioDevices,
          videoDevices: data.videoDevices,
          permissionGranted: true,
          formStage: 'PREVIEW',
        });
      })
      .catch(error => {
        //TODO - look for only permission error. Rest of the errors should be handled
        this.props.setLocalStreamError(error);
        this.setState({
          permissionGranted: false,
          permissionText:
            "You won't be able to access the meeting unless you grant camera and mic permissions",
        });
      });
  };

  updateDevice = (name, value) => {
    this.props.setSettings(
      {
        [name]: value,
      },
      () => {
        this.startPreview(false);
      }
    );
  };

  render() {
    //console.log(this.state.formStage);
    const showEnv = !Boolean(process.env.NEXT_PUBLIC_SFU_ENV);
    const showRoleSelect = Boolean(process.env.NEXT_PUBLIC_SFU_ENV);

    return (
      <>
        {this.state.isSupported && (
          <div className="relative z-0">
            {this.state.formStage && this.state.formStage === 'ROOM' && (
              <>
                <div
                  className=" flex items-center justify-center w-full px-4 sm:px-6 lg:px-8"
                  style={{
                    backgroundColor: '#1a1619',
                    minHeight: 'calc(100vh - 64px)',
                  }}
                >
                  <div className="overflow-hidden justify-right items-right shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100">
                    <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 mb-2">
                      100ms Conference
                    </h2>

                    <div className="mt-6 space-y-2">
                      <button
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => {
                          this.setState({ formStage: 'CREATE_ROOM' });
                        }}
                        ref={changeToSecondaryColor}
                        
                      >
                        Create Room
                      </button>
                      <button
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md  focus:outline-none   transition duration-150 ease-in-out process.env.NEXT_PUBLIC_SECONDARY_COLOR&&'focus:shadow-outline-indigo active:bg-indigo-700 border-indigo-600 text-indigo-600 bg-white hover:text-indigo-700 hover:border-indigo-700'`}
                        onClick={() => {
                          this.setState({ formStage: 'JOIN_ROOM' });
                        }}
                        ref={changeToSecondaryColor}
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!this.props.loginInfo.roomId &&
              this.state.formStage &&
              this.state.formStage === 'CREATE_ROOM' && (
                <>
                  <Formik
                    initialValues={{
                      roomName: '',
                      displayName: this.props.loginInfo.displayName,
                      env: process.env.NEXT_PUBLIC_SFU_ENV || 'prod-in',
                      role: 'Host',
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
                      this.setState({ formValues: values });
                      this.handleCreateSubmit(values);
                    }}
                  >
                    {({ errors, touched, initialValues }) => (
                      <Form>
                        <div
                          className=" flex items-center justify-center w-full px-4 sm:px-6 lg:px-8"
                          style={{
                            backgroundColor: '#1a1619',
                            minHeight: 'calc(100vh - 64px)',
                          }}
                        >
                          <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 p-6 bg-gray-100">
                            <div>
                              <h2 className="text-center justify-center items-center text-3xl leading-9 font-extrabold text-gray-900 mb-2">
                                {initialValues && (
                                  <>
                                    <ArrowLeftIcon
                                      className="text-gray-700 hover:text-black"
                                      onClick={() => {
                                        this.setState({ formStage: 'ROOM' });
                                        this.props.setLoginInfo({
                                          roomId: '',
                                        });
                                      }}
                                    />
                                    100ms Conference
                                  </>
                                )}
                              </h2>
                            </div>
                            <div className="rounded-m">
                              <div>
                                <LoginTextField
                                  label="Room Name"
                                  name="roomName"
                                  className="rounded-t-md"
                                  placeholder="Room Name"
                                  errors={errors.roomName}
                                  touched={touched.roomName}
                                />
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
                                {initialValues ? (
                                  showRoleSelect ? (
                                    <LoginTextField
                                      label="Role"
                                      name="role"
                                      as={showRoleSelect ? 'select' : null}
                                      className={!showEnv && 'rounded-b-md'}
                                      placeholder="Role"
                                      disabled={
                                        this.props.loginInfo.role ===
                                        ROLES.VIEWER
                                      }
                                      errors={errors.role}
                                      touched={touched.rol}
                                    >
                                      <option value="">Select Role</option>
                                      {Object.values(ROLES).map(
                                        (role, index) => (
                                          <option
                                            key={index}
                                            value={role}
                                            className="capitalize"
                                          >
                                            {role}
                                          </option>
                                        )
                                      )}
                                    </LoginTextField>
                                  ) : (
                                    <LoginTextField
                                      label="Role"
                                      name="role"
                                      className={!showEnv && 'rounded-b-md'}
                                      placeholder="Role"
                                      disabled={
                                        this.props.loginInfo.role ===
                                        ROLES.VIEWER
                                      }
                                      errors={errors.role}
                                      touched={touched.rol}
                                    />
                                  )
                                ) : null}
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
                                ref={changeToSecondaryColor}
                              >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                                Create Room
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            {this.state.formStage && this.state.formStage === 'JOIN_ROOM' && (
              <>
                <Formik
                  initialValues={{
                    roomId: this.props.loginInfo.roomId
                      ? this.props.loginInfo.roomId
                      : '',
                    displayName: this.props.loginInfo.displayName,
                    env: this.props.loginInfo.env
                      ? this.props.loginInfo.env
                      : '',
                    role: this.props.loginInfo.role
                      ? this.props.loginInfo.role
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
                    this.setState({ formValues: values });
                    this.handleJoinSubmit(values);
                  }}
                >
                  {({ errors, touched, initialValues }) => (
                    <Form>
                      <div
                        className=" flex items-center justify-center w-full px-4 sm:px-6 lg:px-8"
                        style={{
                          backgroundColor: '#0B0F15',
                          minHeight: 'calc(100vh - 64px)',
                        }}
                      >
                        <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 p-6 bg-gray-100">
                          <div>
                            {/* <img className="mx-auto h-12 w-auto" src={logo} /> */}

                            <h2 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mb-2">
                              {initialValues && (
                                <>
                                  {/* <ArrowLeftIcon
                                    className="text-gray-700 hover:text-black"
                                    onClick={() => {
                                      this.setState({ formStage: 'ROOM' });
                                      this.props.setLoginInfo({
                                        roomId: '',
                                      });
                                    }}
                                  /> */}
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
                              {initialValues ? (
                                showRoleSelect ? (
                                  <LoginTextField
                                    label="Role"
                                    name="role"
                                    as={showRoleSelect ? 'select' : null}
                                    className={!showEnv && 'rounded-b-md'}
                                    placeholder="Role"
                                    disabled={
                                      this.props.loginInfo.role === ROLES.VIEWER
                                    }
                                    errors={errors.role}
                                    touched={touched.rol}
                                  >
                                    <option value="">Select Role</option>
                                    {Object.values(ROLES).map((role, index) => (
                                      <option
                                        key={index}
                                        value={role}
                                        className="capitalize"
                                      >
                                        {role}
                                      </option>
                                    ))}
                                  </LoginTextField>
                                ) : (
                                  <LoginTextField
                                    label="Role"
                                    name="role"
                                    className={!showEnv && 'rounded-b-md'}
                                    placeholder="Role"
                                    disabled={
                                      this.props.loginInfo.role === ROLES.VIEWER
                                    }
                                    errors={errors.role}
                                    touched={touched.rol}
                                  />
                                )
                              ) : null}
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
                              ref={changeToSecondaryColor}
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
                  className=" flex items-center justify-center w-full px-4 sm:px-6 lg:px-8"
                  style={{
                    backgroundColor: '#1a1619',
                    minHeight: 'calc(100vh - 64px)',
                  }}
                >
                  <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3">
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
                          ref={changeToSecondaryColor}
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
                    selectedAudioDevice: this.props.settings
                      ? this.props.settings.selectedAudioDevice
                      : null,
                    selectedVideoDevice: this.props.settings
                      ? this.props.settings.selectedVideoDevice
                      : null,
                    // selectedAudioOutputDevice: this.state.settings
                    //   ? this.state.settings.selectedAudioOutputDevice
                    //   : null,
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
                        className=" flex items-center justify-center w-full px-4 sm:px-6 lg:px-8"
                        style={{
                          backgroundColor: '#1a1619',
                          minHeight: 'calc(100vh - 64px)',
                        }}
                      >
                        <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3">
                          <div className="">
                            <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                              <>100ms Conference</>
                            </h2>
                            <p className="mt-2 text-center text-sm leading-5 text-gray-600 mb-2">
                              You are about to join{' '}
                              <span className="font-semibold">
                                {this.state.formValues
                                  ? this.state.formValues.roomName
                                  : this.props.loginInfo.roomName}
                              </span>{' '}
                              as{' '}
                              <span className="font-semibold">
                                {this.state.formValues
                                  ? this.state.formValues.displayName
                                  : this.props.loginInfo.displayName}
                              </span>
                              <button
                                className="rounded-md px-2 py-1 hover:bg-indigo-500 ml-1 border transition duration-150 ease-in-out"
                                onClick={() => {
                                  this.setState({ formStage: 'JOIN_ROOM' });
                                }}
                              >
                                Change
                              </button>
                            </p>
                          </div>
                          <div className="mb-3">
                            <div className="relative h-48 bg-black rounded-md mb-1">
                              <video
                                id="previewVideo"
                                autoPlay
                                playsInline
                                muted={true}
                                className={`rounded-md h-full w-full ${
                                  !this.props.roomState.localVideoEnabled &&
                                  'hidden'
                                }`}
                              ></video>
                              {/* {(!this.props.roomState.localVideoEnabled) && (<div id='previewVideo' className="rounded-md mb-3 h-full w-full bg-black"></div>)} */}
                              <div className="absolute bottom-0 w-full flex justify-center pb-1">
                                <button
                                  onClick={e => {
                                    e.preventDefault();
                                    const initialValue = this.props.roomState
                                      .localVideoEnabled;
                                    this.props.setRoomState({
                                      localVideoEnabled: !initialValue,
                                    });
                                  }}
                                  className={`py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out ${
                                    this.props.roomState.localVideoEnabled
                                      ? 'bg-opacity-50 bg-gray-600'
                                      : 'bg-indigo-600'
                                  }`}
                                >
                                  {this.props.roomState.localVideoEnabled && (
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
                                  {!this.props.roomState.localVideoEnabled && (
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

                                <button
                                  onClick={e => {
                                    e.preventDefault();
                                    const initialValue = this.props.roomState
                                      .localAudioEnabled;
                                    this.props.setRoomState({
                                      localAudioEnabled: !initialValue,
                                    });
                                  }}
                                  className={`ml-1 py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out ${
                                    this.props.roomState.localAudioEnabled
                                      ? 'bg-opacity-50 bg-gray-600'
                                      : 'bg-indigo-600'
                                  }`}
                                >
                                  {this.props.roomState.localAudioEnabled && (
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
                                  {!this.props.roomState.localAudioEnabled && (
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
                              </div>
                            </div>
                            {this.props.roomState.localAudioEnabled && (
                              <div className="px-1">
                                <div
                                  style={{
                                    width: !this.props.roomState
                                      .localAudioEnabled
                                      ? '1px'
                                      : this.state.audioLevel + 'px',
                                    height: '4px',
                                    backgroundColor: '#8dc63f',
                                  }}
                                ></div>
                              </div>
                            )}
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
                              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none  transition duration-150 ease-in-out ${!process.env.NEXT_PUBLIC_SECONDARY_COLOR&&'focus:shadow-outline-indigo active:bg-indigo-700 bg-indigo-600 hover:bg-indigo-500  focus:border-indigo-700'}`} 
                              ref={changeToSecondaryColor}
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
              className=" flex items-center justify-center w-full px-4 sm:px-6 lg:px-8"
              style={{
                backgroundColor: '#1a1619',
                minHeight: 'calc(100vh - 64px)',
              }}
            >
              <div className="overflow-hidden shadow rounded-lg max-w-sm w-full px-4 py-5 p-6 bg-gray-100 my-3">
                <div className="">
                  <h2 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    100ms Conference
                  </h2>

                  <p className="mt-2 text-center text-sm leading-5 text-gray-600 mb-2">
                    {deviceSupport().failureCause == 'iOS' ? (
                      <span>
                        100ms users might face issues on iOS devices. Please
                        open the link on another device for the best experience.
                        If you wish to continue on iOS, click continue.
                      </span>
                    ) : (
                      <span>
                        We recommend using Google Chrome for the best
                        experience.
                      </span>
                    )}
                  </p>
                  <div className="mt-6">
                    {deviceSupport().failureCause == 'browser' && (
                      <a
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                        href="https://www.google.com/chrome/"
                        target="_blank"
                      >
                        Download Google Chrome
                      </a>
                    )}
                    <button
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-700 hover:border-indigo-700 focus:outline-none border-indigo-600 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out mt-3"
                      onClick={() => this.setState({ isSupported: true })}
                    >
                      Continue in current browser
                    </button>
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
