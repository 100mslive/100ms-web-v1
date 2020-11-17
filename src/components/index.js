import React from 'react';

const Layout = props => {
  return <div className="flex flex-col min-h-screen">{props.children}</div>;
};

Layout.Header = props => {
  return <div className="bg-gray-500">{props.children}</div>;
};

Layout.Content = props => {
  return <div className="flex-1">{props.children}</div>;
};

Layout.Footer = props => {
  return <div className="bg-gray-300">{props.children}</div>;
};

Layout.Sider = props => {
  return <div>{props.children}</div>;
};

export { Layout };
