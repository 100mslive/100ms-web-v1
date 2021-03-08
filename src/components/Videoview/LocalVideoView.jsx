import React from 'react';
import PinIcon from 'mdi-react/PinIcon';
import PinOffIcon from 'mdi-react/PinOffIcon';
import {changeToSecondaryColor} from './../../changeTheme'

class LocalVideoView extends React.Component {
  constructor() {
    super();
    this.state = {
      minimize: false,
    };
  }

  componentDidMount = () => {
    const { stream } = this.props;
    this.video.srcObject = stream;
  };

  componentWillUnmount = () => {
    this.video.srcObject = null;
  };

  onMinimizeClick = () => {
    let minimize = !this.state.minimize;
    this.setState({ minimize });
  };

  render = () => {
    const {
      id,
      label,
      audioMuted,
      videoMuted,
      videoType,
      onPin,
      onUnpin,
      pinned = false,
    } = this.props;

    let minIconStyle = 'local-video-icon-layout';
    if (videoType == 'localVideo') {
      minIconStyle = 'local-video-min-layout';
    }

    return (
      <div
        className={`local-${
          videoType === 'localVideo' ? 'video' : 'screen'
        }-container w-full max-w-full h-full max-h-full flex justify-center items-center relative p-1`}
      >
        <video
          ref={ref => {
            this.video = ref;
          }}
          id={id}
          autoPlay
          playsInline
          muted={true}
          style={{ display: `${this.state.minimize ? 'none' : ''}` }}
          className={`h-full rounded shadow-lg`}
        />
        <div
          className={`${
            this.state.minimize ? minIconStyle : 'local-video-icon-layout'
          }`}
        ></div>
        <div className="absolute top-0 right-0 pt-2 w-full justify-center flex items-center">
          <span
            className="px-3 bg-indigo-900 rounded text-white inline-block bg-opacity-75 h-6 inline-block mr-0.5"
            style={{ lineHeight: '1.5rem' }}
            ref={changeToSecondaryColor}
          >
            {label}
          </span>
          {onPin && (
            <button
              className="w-6 h-6 bg-gray-800 bg-opacity-50 hover:bg-indigo-500 rounded flex items-center justify-center ml-0.5"
              onClick={onPin}
            >
              <PinIcon className="w-4 h-4 text-white" />
            </button>
          )}
          {onUnpin && (
            <button
              className="w-6 h-6 bg-red-500 bg-opacity-50 hover:bg-red-600 rounded flex items-center justify-center ml-0.5"
              onClick={onUnpin}
            >
              <PinOffIcon className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    );
  };
}

export default LocalVideoView;
