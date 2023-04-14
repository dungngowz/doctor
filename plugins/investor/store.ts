import { atom } from 'recoil'
import { InvestorType } from './type'

export const investorListState = atom<InvestorType[]>({
  key: 'investorListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const investorActiveState = atom<InvestorType | null>({
  key: 'investorActiveState',
  default: null,
})
