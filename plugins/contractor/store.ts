import { atom } from 'recoil'
import { ContractorType } from './type'

export const contractorListState = atom<ContractorType[]>({
  key: 'contractorListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const contractorActiveState = atom<ContractorType | null>({
  key: 'contractorActiveState',
  default: null,
})
