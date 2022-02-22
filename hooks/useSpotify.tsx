import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import SpotifyWebApi from 'spotify-web-api-node';
import spotifyApi from '../utilities/spotify';
import type { CustomSession } from '../utilities/spotify';

const useSpotify = (): SpotifyWebApi => {
  const { data, status } = useSession();

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
