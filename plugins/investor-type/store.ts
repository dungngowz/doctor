import { atom } from 'recoil'
import { IInvestorType } from './type'

export const investorTypeListState = atom<IInvestorType[]>({
  key: 'investorTypeListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const investorTypeActiveState = atom<IInvestorType | null>({
  key: 'investorTypeActiveState',
  default: null,
})
