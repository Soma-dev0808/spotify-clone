import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import ChevronDownIcon from '@heroicons/react/outline/ChevronDownIcon';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

import type { PlaylistStateType } from '../atoms/playlistAtom';
import type { NullOrUndefinableType } from '../utilities/types';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

const Center = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState<NullOrUndefinableType<string>>(null);
  // Unlike useRecoilState, useRecoilValue can only refer value from atom which can prevent user from setting value.
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] =
    useRecoilState<PlaylistStateType>(playlistState);

  useEffect(() => {
    const bgColor = shuffle(colors).pop() || colors[0];
    setColor(bgColor);
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => {
        throw Error('Something going wrong. Error detail: ' + err);
      });
  }, [spotifyApi, playlistId]);

  // image src won't accept null so put undefined initially.
  let userImage = undefined;
  if (session?.user?.image) userImage = session?.user?.image;

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
        >
          <img
            className="h-10 w-10 rounded-full"
            src={userImage}
            alt="user image"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images[0]?.url}
          alt="playlist image"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="xl: text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
