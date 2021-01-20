import React from 'react';
import { ControlButton } from './ControlButton';
import VideoIcon from 'mdi-react/VideoIcon';
import VideocamOffIcon from 'mdi-react/VideocamOffIcon';
import MicrophoneIcon from 'mdi-react/MicrophoneIcon';
import MicrophoneOffIcon from 'mdi-react/MicrophoneOffIcon';
import PhoneHangupIcon from 'mdi-react/PhoneHangupIcon';
import TelevisionIcon from 'mdi-react/TelevisionIcon';
import TelevisionOffIcon from 'mdi-react/TelevisionOffIcon';
import VideoCheckIcon from 'mdi-react/VideoCheckIcon';
import ToolShare from '../../ToolShare';

import { ROLES } from '../../constants';

const Controls = ({
  role,
  isMuted,
  screenSharingEnabled,
  isCameraOn,
  isChatOpen,
  onScreenToggle,
  onMicToggle,
  onCamToggle,
  onLeave,
  onChatToggle,
  loginInfo,
  hasUnreadMessages,
}) => {
  const isViewer = role === ROLES.VIEWER;
  const isLiveRecordingOn = role === ROLES.LIVE_RECORD;

  const cameraButton = (
    <div className="mr-1">
      <ControlButton
        icon={<VideoIcon className="text-indigo-100" />}
        activeIcon={<VideocamOffIcon className="text-red-100" />}
        label="Camera"
        isActive={!isCameraOn}
        onClick={onCamToggle}
      />
    </div>
  );

  const micButton = (
    <div className="mx-1">
      <ControlButton
        icon={<MicrophoneIcon className="text-indigo-100" />}
        activeIcon={<MicrophoneOffIcon className="text-red-100" />}
        label="Mic"
        isActive={isMuted}
        onClick={onMicToggle}
      />
    </div>
  );

  const leaveButton = (
    <div className="mx-1">
      <ControlButton
        icon={<PhoneHangupIcon className="text-red-100" />}
        activeIcon={<PhoneHangupIcon className="text-red-100" />}
        label="Leave"
        onClick={onLeave}
        isActive
      />
    </div>
  );

  const screenShareButton = (
    <div className="mx-1">
      <ControlButton
        icon={<TelevisionIcon className="text-indigo-100" />}
        activeIcon={<TelevisionOffIcon className="text-red-100" />}
        label="Screen"
        isActive={screenSharingEnabled}
        onClick={onScreenToggle}
      />
    </div>
  );

  const chatButton = (
    <div className="mx-1 relative">
      {hasUnreadMessages && (
        <div className="animate-pulse absolute top-0 right-0 mt-2 mr-3 w-2 h-2 bg-red-500 rounded-full" />
      )}
      <ControlButton
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        }
        activeIcon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        }
        label="Chat"
        onClick={onChatToggle}
        isActive={isChatOpen}
      />
    </div>
  );

  const shareButton = (
    <div className="ml-1">
      <ToolShare url={location.href} />
    </div>
  );

  return (
    <div
      className="h-16 absolute w-full justify-center bottom-0 flex items-center py-1"
      style={{ backgroundColor: '#1a1619' }}
    >
      {!isLiveRecordingOn && (
        <>
          {!isViewer && (
            <>
              {cameraButton}
              {micButton}
            </>
          )}

          {leaveButton}

          {!isViewer && screenShareButton}

          {chatButton}
          {shareButton}
        </>
      )}
    </div>
  );
};

export { Controls };
