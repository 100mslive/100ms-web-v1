import React, { useEffect, useRef } from 'react';

export default function SmallVideoView({
  id,
  stream,
  label,
  isMuted,
  isLocal,
}) {
  const videoEl = useRef(null);

  useEffect(() => {
    videoEl.current.srcObject = stream;

    return function cleanUp() {
      videoEl.current.srcObject = null;
    };
  }, []);

  return (
    <div
      className={`relative w-64 h-36 mb-2 mx-auto ${
        isLocal ? 'local-video-container' : ''
      }`}
    >
      <video
        ref={videoEl}
        id={id}
        autoPlay
        playsInline
        muted={isMuted}
        className="rounded max-h-full mx-auto shadow-lg"
      />
      <div className="absolute left-0 top-0 w-full text-center pt-0.5">
        <a className="bg-indigo-900 bg-opacity-75 text-xs text-white inline-flex items-center px-1 rounded-sm">
          {label || stream.info.name}
        </a>
      </div>
    </div>
  );
}
