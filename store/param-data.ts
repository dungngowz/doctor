import { DataTableParamsType } from '@/types'
import { atom } from 'recoil'

export const dataTableParamsState = atom<DataTableParamsType>({
  key: 'dataTableParams',
  default: {
    refetchData: 0,
    rowsPerPage: 20,
    page: 1,
    orderBy: 'id',
    orderSort: 'desc',
    keyword: '',
  },
})

export const totalPageState = atom<number>({
  key: 'totalPageState',
  default: 0,
})

export const totalNestDataTablePageState = atom<number>({
  key: 'totalNestDataTablePageState',
  default: 0,
})

export const dataTableFirstLoadingState = atom<boolean>({
  key: 'dataTableFirstLoadingState',
  default: true,
})
