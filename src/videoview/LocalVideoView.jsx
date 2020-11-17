import React from 'react';
import PinIcon from 'mdi-react/PinIcon';
import PinOffIcon from 'mdi-react/PinOffIcon';

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
          className={`w-full h-full  ${pinned ? '' : ''}`}
        />
        <div
          className={`${
            this.state.minimize ? minIconStyle : 'local-video-icon-layout'
          }`}
        ></div>
        <div className="absolute top-0 right-0 pt-2 w-full justify-center flex items-center">
          <span className="px-2 py-1 bg-gray-800 rounded-md text-white inline-block bg-opacity-50 mr-1">
            {label}
          </span>
          {onPin && (
            <button
              className="w-6 h-6 bg-gray-800 bg-opacity-50 hover:bg-indigo-500 rounded flex items-center justify-center"
              onClick={onPin}
            >
              <PinIcon className="w-4 h-4 text-white" />
            </button>
          )}
          {onUnpin && (
            <button
              className="w-6 h-6 bg-red-500 bg-opacity-50 hover:bg-red-600 rounded flex items-center justify-center"
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
