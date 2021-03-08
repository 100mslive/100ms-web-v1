import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Modal, Button, Tooltip, Input, Icon } from 'antd';
import { ControlButton } from './Controls/ControlButton';
import ShareIcon from 'mdi-react/ShareIcon';
import {getContrastYIQ} from "./../changeTheme"

export default class ToolShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    const url = new URLSearchParams(props.url);
    url.delete('role');
    this.url = decodeURIComponent(url.toString());
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  onFocus = e => {
    ReactDOM.findDOMNode(e.target).select();
  };

  render() {
    return (
      <div>
        <ControlButton
          icon={<ShareIcon  style={{color:getContrastYIQ(process.env.NEXT_PUBLIC_SECONDARY_COLOR)?'black':'white'}}  />}
          activeIcon={<ShareIcon className="text-red-100" style={{color:getContrastYIQ(process.env.NEXT_PUBLIC_SECONDARY_COLOR)?'black':'white'}}  />}
          label="Share"
          isActive={false}
          onClick={this.showModal}
        />
        <Modal
          title="Shared conference"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Ok"
          cancelText="Cancel"
          okButtonProps={{style:{backgroundColor:process.env.NEXT_PUBLIC_SECONDARY_COLOR, borderColor:"black",color:getContrastYIQ(process.env.NEXT_PUBLIC_SECONDARY_COLOR)?"black":"white"}}}
          
        >
          <div>
            <div>
              <span>Send link to your friends</span>
              <Input onFocus={this.onFocus} readOnly={true} value={this.url} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ToolShare.propTypes = {
  roomInfo: PropTypes.any,
};
