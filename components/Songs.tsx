import { useRecoilValue } from 'recoil';
import { playlistState, PlaylistStateType } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Song from './Song';

const Songs = () => {
  const spotifyApi = useSpotify();
  const playlist: PlaylistStateType = useRecoilValue(playlistState);
  const playListMap = (track: SpotifyApi.PlaylistTrackObject, idx: number) => (
    <Song
      key={track.track.id + idx}
      track={track}
      order={idx}
      spotifyApi={spotifyApi}
    />
  );

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks.items.map(playListMap)}
    </div>
  );
};

export default Songs;
