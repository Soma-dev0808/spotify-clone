import type {
  SpotifyPlayOptions,
  SpotifyPlaySong,
  CalculateVolumeFunc,
} from '../utilities/types';
/**
 *
 * @param value Any value to be evaluated.
 * @returns True if value is neither undefined nor null.
 */
const checkNullOrUndefined = (value: any): boolean => {
  if (value === undefined || value === null) {
    throw Error('Server error. Unable to get accessTokenExpires');
  }

  return true;
};

/**
 *
 * @param value Any value to be evaluated.
 * @returns
 */
const togglePlay = ({ uri, deviceId, accessToken }: SpotifyPlaySong) => {
  if (accessToken && deviceId) {
    try {
      play(accessToken, {
        uris: [uri],
        deviceId,
      });
    } catch (error) {
      handlePlayerError(error);
    }
  } else {
    throw new Error('accessToken or deviceId is undefined');
  }
};

/**
 *
 * @param token Spotify access token
 * @param {SpotifyPlayOptions} options.context_uri context_uri which contains playlist, album or artist info
 * @param {SpotifyPlayOptions} options.deviceId device id
 * @param {SpotifyPlayOptions} options.offset object
 * @param {SpotifyPlayOptions} options.uris song uri
 * @returns
 */
const play = (
  token: string,
  { context_uri, deviceId, offset = 0, uris }: SpotifyPlayOptions
) => {
  let body;

  if (context_uri) {
    const isArtist = context_uri.indexOf('artist') >= 0;
    let position;

    if (!isArtist) {
      position = { position: offset };
    }

    body = JSON.stringify({ context_uri, offset: position });
  } else if (Array.isArray(uris) && uris.length) {
    body = JSON.stringify({ uris, offset: { position: offset } });
  }

  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }
  );
};

const handlePlayerError = (error: any) => {
  throw new Error(`There's an error: ${error.message}`);
};

const calVolume: CalculateVolumeFunc = (currVol, { isUp }) => {
  if ((isUp && currVol === 100) || (!isUp && currVol === 0)) return currVol;

  // Volume up
  if (isUp) {
    if (currVol >= 90) return 100;

    return currVol + 10;
  }
  // Volume down
  else {
    if (currVol <= 10) return 0;

    return currVol - 10;
  }
};

export { checkNullOrUndefined, play, togglePlay, handlePlayerError, calVolume };
