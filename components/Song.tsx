import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../utilities/time';
import type { NullOrUndefinableType } from '../utilities/types';

interface SongProps {
  track: SpotifyApi.PlaylistTrackObject;
  order: number;
}

const Song: React.FC<SongProps> = ({ track, order }) => {
  const spotifyApi = useSpotify();
  const [, setCurrentTrackId] =
    useRecoilState<NullOrUndefinableType<string>>(currentTrackIdState);
  const [, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
  const _track: SpotifyApi.TrackObjectFull = track.track;

  const playSong = () => {
    setCurrentTrackId(_track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [_track.uri],
    });
  };

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={_track?.album?.images[0]?.url}
          alt="track image"
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{_track?.name}</p>
          <p className="w-40">{_track?.artists[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-end md:ml-0 md:justify-between">
        <p className="hidden w-40 md:inline">{_track.album.name}</p>
        <p>{millisToMinutesAndSeconds(_track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;
