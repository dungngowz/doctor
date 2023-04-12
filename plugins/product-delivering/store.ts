import { atom } from 'recoil'
import { ProductDeliveringType } from './type'

export const productDeliveringListState = atom<ProductDeliveringType[]>({
  key: 'productDeliveringListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const productDeliveringActiveState = atom<ProductDeliveringType | null>({
  key: 'productDeliveringActiveState',
  default: null,
})
