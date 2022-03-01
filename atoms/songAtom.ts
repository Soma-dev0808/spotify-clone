import { atom } from 'recoil';
import type { NullOrUndefinableType } from '../utilities/types';

export const currentTrackIdState = atom<NullOrUndefinableType<string>>({
  key: 'currentTrackIdStateKey',
  default: null,
});

export const isPlayingState = atom<boolean>({
  key: 'isPlayingStateKey',
  default: false,
});

export const deviceIdState = atom<NullOrUndefinableType<string>>({
  key: 'deviceIdStateKey',
  default: undefined,
});
