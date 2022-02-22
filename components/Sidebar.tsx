import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';

import sidebarMenus from '../utilities/sidebarMenus';
import SidebarMenuButton from './SidebarMenuButton';
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom';

const Sidebar: React.FC = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && session) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  console.log('You have picked item. ID: ', playlistId);

  return (
    <div className="hidden h-screen overflow-y-scroll border-r border-gray-900 p-5 pb-6 text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        {/* Loop sidebarMenus array to render icon buttons */}
        {sidebarMenus.map((sidebarProps, idx) => {
          // Add hr when index is 3
          return sidebarProps.addHrBottom ? (
            <React.Fragment key={idx}>
              <SidebarMenuButton {...sidebarProps} />
              <hr className="border-t-[0.1px] border-gray-900" />
            </React.Fragment>
          ) : (
            <SidebarMenuButton key={idx} {...sidebarProps} />
          );
        })}

        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => {
          return (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="cursor-pointer hover:text-white"
            >
              {playlist.name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
