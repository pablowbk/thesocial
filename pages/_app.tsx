import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import NavBar from '../components/navbar/NavBar';
import SideBar from '../components/sidebar/SideBar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NextNProgress from 'nextjs-progressbar';

import '../styles/globals.css';
import Head from 'next/head';

const App = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
      <Head>
        <title>TheSocial - FullStack web app</title>
        <link rel="shortcut icon" href="/favicon.png"/>
      </Head>
      <NextNProgress color="#FF008A" startPosition={0.3} stopDelayMs={200} height={5} showOnShallow={true} />
      <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
        <NavBar />
        <div className='flex gap-6 md:gap-20'>
          <div className='h-[92vh] overflow-hidden xl:hover:overflow-auto'>
            <SideBar />
          </div>
          <div className='mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1'>
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;