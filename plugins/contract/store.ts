import { atom } from 'recoil'
import { ContractType } from './type'

export const contractListState = atom<ContractType[]>({
  key: 'contractListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const contractActiveState = atom<ContractType | null>({
  key: 'contractActiveState',
  default: null,
})

export const preventContractLoadingState = atom<boolean>({
  key: 'preventContractLoadingState',
  default: false,
})
