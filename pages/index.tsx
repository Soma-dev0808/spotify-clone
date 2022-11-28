import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import Player from '../components/Player';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify Clone</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="h-screen overflow-hidden bg-black">
        <main className="flex">
          <Sidebar />
          <Center />
        </main>

        <div className="sticky bottom-0">
          <Player />
        </div>
      </div>
    </>

  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
