import endpoint from '@/config/endpoint.json'
import { IApiResponse } from '@/types'
import { axiosClient } from '@/utils'
import { setRecoil } from 'recoil-nexus'
import { dashboardState, widgetsLoadingState } from './store'

export const getDashboardApi = async () => {
  setRecoil(widgetsLoadingState, true)
  return await axiosClient
    .get(endpoint.dashboard)
    .then((res: IApiResponse | any) => {
      setRecoil(dashboardState, res.data)
    })
    .catch((err) => {
      //
    })
    .finally(() => {
      setRecoil(widgetsLoadingState, false)
    })
}
