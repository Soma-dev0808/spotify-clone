import { atom } from 'recoil';
import type { NullOrUndefinableType } from '../utilities/types';

export const currentTrackIdState = atom<NullOrUndefinableType<string>>({
  key: 'currentTrackStateKey',
  default: null,
});

export const isPlayingState = atom<boolean>({
  key: 'isPlayingStateKey',
  default: false,
});
