import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import '../styles/css/styles.scss';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import LogRocket from 'logrocket';
// LogRocket.init('plwzmx/100ms');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

LogRocket.getSessionURL(sessionURL => {
  Sentry.configureScope(scope => {
    scope.setExtra('sessionURL', sessionURL);
  });
});

ReactDOM.render(<App />, document.getElementById('app'));
