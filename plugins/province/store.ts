import { atom, selector } from 'recoil'
import { regionListState } from '../region/store'
import { ProvinceType } from './type'

export const provinceListState = atom<ProvinceType[]>({
  key: 'provinceListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const provinceActiveState = atom<ProvinceType | null>({
  key: 'provinceActiveState',
  default: null,
})

export const getRegionListOptionState = selector({
  key: 'getRegionListOptionState',
  get: ({ get }) => {
    const regionList = get(regionListState)
    const options = regionList.map((item) => {
      return {
        id: item.id,
        value: item.id,
        label: item.title,
      }
    })

    return options
  },
})
