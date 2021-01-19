import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import '../styles/css/styles.scss';
import LogRocket from 'logrocket';
if (process.env.NODE_ENV == 'production') {
  LogRocket.init('plwzmx/100ms');
}

ReactDOM.render(<App />, document.getElementById('app'));
