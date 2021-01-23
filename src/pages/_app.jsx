import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import '../style/styles.scss';
import '../style/App.scss';
import '../style/Chat.scss';
import '../style/Conference.scss';
import '../style/Login.scss';
import '../style/Settings.scss';
import '../style/Videoview.scss';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <link
            href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
            type="text/css"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
