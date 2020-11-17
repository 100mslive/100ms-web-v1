import React from 'react';
import PinIcon from 'mdi-react/PinIcon';
import PinOffIcon from 'mdi-react/PinOffIcon';
import MicrophoneIcon from 'mdi-react/MicrophoneIcon';
import MicrophoneOffIcon from 'mdi-react/MicrophoneOffIcon';

class MainVideoView extends React.Component {
  componentDidMount = () => {
    const { stream } = this.props;
    this.video.srcObject = stream;
  };

  componentWillUnmount = () => {
    this.video.srcObject = null;
  };

  render = () => {
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
      onRequest,
    } = this.props;
    return (
      <div className="w-full max-w-full h-full max-h-full flex justify-center items-center relative p-1">
        <video
          ref={ref => {
            this.video = ref;
          }}
          id={id}
          autoPlay
          playsInline
          muted={false}
          className={`w-full h-full ${pinned ? '' : ''}`}
        />
        <div className="absolute top-0 right-0 pt-2 w-full flex justify-center items-center">
          <span
            className="px-3 bg-indigo-900 rounded-md text-white inline-block bg-opacity-75 h-6 inline-block"
            style={{ lineHeight: '1.5rem' }}
          >
            {label || stream.info.name}
          </span>
          {uid && (
            <button
              onClick={e => {
                console.log(e, 'mute/unmute', uid);
                onRequest(uid, { mute: audioEnabled });
              }}
              className={`w-6 h-6 bg-opacity-50 rounded flex items-center justify-center mx-1 ${
                audioEnabled ? 'bg-gray-800 hover:bg-indigo-500' : 'bg-red-500'
              }`}
            >
              {audioEnabled ? (
                <MicrophoneIcon className="text-indigo-100 w-4 h-4" />
              ) : (
                <MicrophoneOffIcon className="text-red-100 w-4 h-4" />
              )}
            </button>
          )}
          {onPin && (
            <button
              className="w-6 h-6 bg-gray-800 bg-opacity-50 hover:bg-indigo-500 rounded flex items-center justify-center"
              onClick={onPin}
            >
              <PinIcon className="w-4 h-4 text-indigo-100" />
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

export default MainVideoView;
