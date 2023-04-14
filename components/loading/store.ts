import { atom } from 'recoil'

/* Creating a state that is a boolean. */
export const loadingState = atom<boolean>({
  key: 'LoadingState',
  default: false,
})
