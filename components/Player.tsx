import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { debounce } from 'lodash';
import {
  currentTrackIdState,
  isPlayingState,
  deviceIdState,
} from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';
import {
  calVolume,
  handlePlayerError,
  checkNullOrUndefined,
} from '../utilities/utilities';

// icons
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';

import type {
  NullOrUndefinableType,
  SpotifySongInfoType,
  SpotifyPlayerCallback,
} from '../utilities/types';

const Player = () => {
  const [volume, setVolume] = useState<number>(50);
  // State inside of the addListener won't be updated, so use ref.current to get current state.
  const volumeRef = useRef<number>(volume);
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const songInfo: SpotifySongInfoType = useSongInfo();
  const [currenTrackId, setCurrenTrackId] =
    useRecoilState<NullOrUndefinableType<string>>(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
  const [deviceId, setDeviceId] =
    useRecoilState<NullOrUndefinableType<string>>(deviceIdState);

  // Set player section
  useEffect(() => {
    // Use Script from next.js instead of create script tag manually
    // const _script = document.createElement('script');
    // _script.id = 'spotify-player';
    // _script.type = 'text/javascript';
    // _script.src = 'https://sdk.scdn.co/spotify-player.js';
    // _script.async = true;
    // document.head.appendChild(_script);

    const initializePlayer = () => {
      const _player: Spotify.Player = new window.Spotify.Player({
        name: 'Web Spotify Player',
        getOAuthToken: (cb: SpotifyPlayerCallback) => {
          cb(spotifyApi.getAccessToken()!);
        },
        volume: 0.5,
      });

      _player.addListener('ready', setDevice);

      _player.addListener('not_ready', () => {
        setDeviceId(undefined);
      });

      _player.addListener('player_state_changed', setPlayerVolume);
      _player.addListener('initialization_error', handlePlayerError);
      _player.addListener('authentication_error', handlePlayerError);
      _player.addListener('account_error', handlePlayerError);
      _player.addListener('playback_error', handlePlayerError);

      _player.connect();
    };

    window.onSpotifyWebPlaybackSDKReady = initializePlayer;
  }, []);

  const setDevice = ({ device_id }: { device_id: string }) => {
    setDeviceId(device_id);
  };

  const setPlayerVolume = (state: Spotify.PlaybackState) => {
    if (!state) return;
    // Check device volume. If device volume is different from local state, set it.
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        const volumePercent = data?.body?.device?.volume_percent;
        if (
          checkNullOrUndefined(volumePercent) &&
          volumePercent !== volumeRef.current
        ) {
          spotifyApi
            .setVolume(volumeRef.current)
            .catch((err) => console.log(err));
        }
      }
    });
  };

  // Set song info when external device is playing a song.
  const fetchCurrenSong = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrenTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(!!data?.body?.is_playing);
        });
      });
    }
  }, [songInfo, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currenTrackId) {
      fetchCurrenSong();
      _setVolume(50);
    }
  }, [currenTrackId, spotifyApi, session]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const _setVolume = (data: number) => {
    volumeRef.current = data;
    setVolume(data);
  };

  // Change player volume
  useEffect(() => {
    const adjustable = deviceId && volume > 0 && volume < 100;
    if (adjustable) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce(
      (volume) => spotifyApi.setVolume(volume).catch((err) => console.log(err)),
      500
    ),
    []
  );

  return (
    <>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="afterInteractive"
      />
      <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <img
            className="hidden h-10 w-10 md:inline"
            src={songInfo?.album?.images[0]?.url}
            alt="album image"
          />
          <div>
            <h3>{songInfo?.name}</h3>
            <p>{songInfo?.artists[0]?.name}</p>
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center justify-evenly">
          <SwitchHorizontalIcon className="button" />
          <RewindIcon className="button" />

          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
          )}

          <FastForwardIcon className="button" />
          <ReplyIcon className="button" />
        </div>

        <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
          <VolumeOffIcon
            onClick={() => _setVolume(calVolume(volume, { isUp: false }))}
            className="button"
          />
          <input
            className="w-14 md:w-20"
            type="range"
            value={volume}
            min={0}
            max={100}
            onChange={(e) => _setVolume(Number(e.target.value))}
          />
          <VolumeUpIcon
            onClick={() => _setVolume(calVolume(volume, { isUp: true }))}
            className="button"
          />
        </div>
      </div>
    </>
  );
};

export default Player;
