import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState, PlaylistStateType } from '../atoms/playlistAtom';
import { currentTrackIdState } from '../atoms/songAtom';
import { SpotifySongInfoType } from '../utilities/types';
import useSongInfo from './useSongInfo';

interface NextSongInfo {
    prev: SpotifyApi.PlaylistTrackObject | null,
    next: SpotifyApi.PlaylistTrackObject | null,
}

// Return next or prev song info
const useNextSong = () => {
    const [nextSongInfo, setNextSongInfo] = useState<NextSongInfo>({ prev: null, next: null });
    const currenTrackId = useRecoilValue(currentTrackIdState);
    const songInfo: SpotifySongInfoType = useSongInfo();
    const playlist: PlaylistStateType = useRecoilValue(playlistState);

    useEffect(() => {
        if (currenTrackId && playlist && songInfo) {

            const songIdx = playlist.tracks.items.findIndex((item) => {
                return item.track.id === songInfo.id;
            });

            const trackLen = playlist.tracks.items.length - 1;
            const prevSongIdx = songIdx - 1;
            const nextSongIdx = songIdx + 1;

            let prevSong = null;
            let nextSong = null;

            if (prevSongIdx >= 0) {
                prevSong = playlist.tracks.items[prevSongIdx];
            }

            if (nextSongIdx <= trackLen) {
                nextSong = playlist.tracks.items[nextSongIdx];
            }

            setNextSongInfo({
                prev: prevSong,
                next: nextSong,
            });
        }
    }, [currenTrackId, songInfo, playlist]);

    return nextSongInfo;

};

export default useNextSong;