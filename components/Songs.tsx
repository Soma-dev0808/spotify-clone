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

  if (!playlist) return null;

  const playlistItems = playlist.tracks.items.filter((item, idx) => {
    return playlist.tracks.items.indexOf(item) === idx;
  });

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlistItems.map(playListMap)}
    </div>
  );
};

export default Songs;
