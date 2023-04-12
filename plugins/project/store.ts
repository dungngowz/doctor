import { atom } from 'recoil'
import { ProjectType } from './type'

export const projectListState = atom<ProjectType[]>({
  key: 'projectListState',
  default: [],
})

export const projectActiveState = atom<ProjectType | null>({
  key: 'projectActiveState',
  default: null,
})
