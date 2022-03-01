import { JWT } from 'next-auth/jwt';
import { Session, ISODateString } from 'next-auth';

// Common types are defined here.

// Use this if the type passed could be null or undefined
type NullOrUndefinableType<T> = T | null | undefined;

type SpotifyPlayerCallback = (token: string) => void;

type SpotifySongInfoType = SpotifyApi.SingleTrackResponse | null;

type CalculateVolumeFunc = (
  currVol: number,
  isUpObj: { isUp: boolean }
) => number;

interface CustomJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  accessTokenExpires?: number;
  error?: string;
}

interface CustomSession extends Session {
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

interface SpotifyPlayOptions {
  context_uri?: string;
  deviceId: string;
  offset?: number;
  uris?: string[];
}

interface SpotifyPlaySong {
  uri: string;
  deviceId: NullOrUndefinableType<string>;
  accessToken: NullOrUndefinableType<string>;
}

export type {
  NullOrUndefinableType,
  SpotifyPlayerCallback,
  SpotifySongInfoType,
  CustomJWT,
  CustomSession,
  SpotifyPlayOptions,
  SpotifyPlaySong,
  CalculateVolumeFunc,
};
