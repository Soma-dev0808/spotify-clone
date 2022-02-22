import { useRecoilValue } from 'recoil';
import { playlistState, PlaylistStateType } from '../atoms/playlistAtom';
import Song from './Song';

const Songs = () => {
  const playlist: PlaylistStateType = useRecoilValue(playlistState);
  const playListMap = (track: SpotifyApi.PlaylistTrackObject, idx: number) => (
    <Song key={track.track.id} track={track} order={idx} />
  );

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks.items.map(playListMap)}
    </div>
  );
};

export default Songs;
