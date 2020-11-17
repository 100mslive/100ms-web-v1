import React from 'react';

class SmallVideoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWidth: document.body.offsetWidth,
      clientHeight: document.body.offsetHeight,
    };
  }

  componentDidMount = () => {
    const { stream } = this.props;
    this.video.srcObject = stream;
  };

  componentWillUnmount = () => {
    this.video.srcObject = null;
  };

  _handleClick = () => {
    let { id, index } = this.props;
    this.props.onClick({ id, index, el: this.video });
  };

  render = () => {
    const { id, stream, label, isMuted } = this.props;

    return (
      <div onClick={this._handleClick} className="p-1 relative">
        <video
          ref={ref => {
            this.video = ref;
          }}
          id={id}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full"
        />
        <div className="absolute left-0 top-0 w-full">
          <a className="small-video-id-a">{label || stream.info.name}</a>
        </div>
      </div>
    );
  };
}

export default SmallVideoView;
