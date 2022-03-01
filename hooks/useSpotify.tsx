import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import spotifyApi from '../utilities/spotify';

import SpotifyWebApi from 'spotify-web-api-node';
import type { CustomSession } from '../utilities/types';

const useSpotify = (): SpotifyWebApi => {
  const { data } = useSession();

  const session = data as CustomSession;

  useEffect(() => {
    if (session) {
      if (session.error === 'Refresh token error') signIn();

      if (session.user?.accessToken)
        spotifyApi.setAccessToken(session.user?.accessToken);
    }
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
