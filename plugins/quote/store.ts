import { atom } from 'recoil'
import { QuoteType } from './type'

export const quoteListState = atom<QuoteType[]>({
  key: 'quoteListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const quoteActiveState = atom<QuoteType | null>({
  key: 'quoteActiveState',
  default: null,
})

export const totalPriceQuoteState = atom<number>({
  key: 'totalPriceQuoteState',
  default: 0,
})
