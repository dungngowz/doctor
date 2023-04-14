import endpoint from '@/config/endpoint.json'
import {
  dataTableFirstLoadingState,
  dataTableParamsState,
  totalPageState,
} from '@/store/param-data'
import { DataTableParamsType, IApiResponse } from '@/types'
import { axiosClient } from '@/utils'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { reportInputListState } from './store'

export const getReportInputApi = async (params?: DataTableParamsType | any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(reportInputListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return await axiosClient
    .get(`${endpoint.reportInput}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(reportInputListState, res?.data?.productDeliveries?.data)
        setRecoil(totalPageState, res.data?.productDeliveries?.paginate?.total)
      } else {
        setRecoil(reportInputListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(reportInputListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}
