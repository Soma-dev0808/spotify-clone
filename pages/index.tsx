import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import Player from '../components/Player';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
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
