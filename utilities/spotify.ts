import { Session, ISODateString } from 'next-auth';
import SpotifyWebApi from 'spotify-web-api-node';
import { JWT } from 'next-auth/jwt';

interface SpotifyParams {
  [key: string]: string;
}

export interface CustomJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  accessTokenExpires?: number;
  error?: string;
}

export interface CustomSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
    username?: string;
  };
  expires: ISODateString;
  error?: string;
}

const scopes: string = [
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-read-private',
  'user-library-read',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-follow-read',
].join(',');

const params: SpotifyParams = {
  scope: scopes,
};

const queryParamString: URLSearchParams = new URLSearchParams(params);

const LOGIN_URL: string = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi: SpotifyWebApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
});

export default spotifyApi;

export { LOGIN_URL };
