import { atom } from 'recoil';

export type PlaylistStateType = SpotifyApi.SinglePlaylistResponse | null;

const playlistState = atom<PlaylistStateType>({
  key: 'playlistStateKey',
  default: null,
});

const playlistIdState = atom({
  key: 'playlistIdStateKey',
  default: '3gwTyv0FTvRApil8fLRdBt',
});

export { playlistState, playlistIdState };
