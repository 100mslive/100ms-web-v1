import LogRocket from 'logrocket';
import dynamic from 'next/dynamic';

if (process.env.NODE_ENV == 'production') {
  LogRocket.init('plwzmx/100ms');
}

const App = dynamic(import('../components/App'), { ssr: false });

export default function Home() {
  return <App />;
}
