import { atom } from 'recoil'
import { ProductInputType } from './type'

export const productInputListState = atom<ProductInputType[]>({
  key: 'productInputListState',
  default: [],
})

export const productInputActiveState = atom<ProductInputType | null>({
  key: 'productInputActiveState',
  default: null,
})
