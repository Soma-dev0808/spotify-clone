import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const currenTrackId = useRecoilValue(currentTrackIdState);
  const [songInfo, setSongInfo] =
    useState<SpotifyApi.SingleTrackResponse | null>(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currenTrackId) {
        spotifyApi.getTrack(currenTrackId).then((data) => {
          setSongInfo(data.body);
        });
      }
    };

    fetchSongInfo();
  }, [currenTrackId, spotifyApi]);

  return songInfo;
};

export default useSongInfo;
