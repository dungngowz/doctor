import { atom, selector } from 'recoil'
import { DataTableSchedulesParamsType, ScheduleType } from './type'

export const dataTableSchedulesParamsState = atom<DataTableSchedulesParamsType>({
  key: 'dataTableSchedulesParamsState',
  default: {
    refetchData: 0,
    rowsPerPage: 20,
    page: 1,
    orderBy: 'id',
    orderSort: 'desc',
    keyword: '',
    isCreated: false,
    isEdited: false,
    isDeleted: false,
    isFilter: false,
  },
})

export const schedulesListState = atom<ScheduleType[]>({
  key: 'schedulesListState',
  default: [],
})

export const schedulesActiveState = atom<ScheduleType | null>({
  key: 'schedulesActiveState',
  default: null,
})

export const schedulesTotalState = atom<number>({
  key: 'schedulesTotalState',
  default: 1,
})

/* A selector that checks if the comment is at the end. */
export const isSchedulesEndReachingState = selector({
  key: 'isSchedulesEndReachingState',
  get: ({ get }) => {
    const schedulesTotal = get(schedulesTotalState)
    const currentSchedulesList = get(schedulesListState)

    return schedulesTotal == currentSchedulesList.length ? true : false
  },
})

export const openModalSelectOrderState = atom<boolean>({
  key: 'openModalSelectOrderState',
  default: false,
})

export const currentIndexSelectedOrderIdState = atom<number>({
  key: 'currentIndexSelectedOrderIdState',
  default: -1,
})

export const currentDeleteIdState = atom<number>({
  key: 'currentDeleteIdState',
  default: 0,
})
