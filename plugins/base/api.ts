import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import {
  dataTableFirstLoadingState,
  dataTableParamsState,
  totalPageState,
} from '@/store/param-data'
import { IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { toast } from 'react-toastify'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { baseListState } from './store'

export const getBaseApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(baseListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.base}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(baseListState, res?.data?.baseData?.data)
        setRecoil(totalPageState, res.data?.baseData?.paginate?.total)
      }
    })
    .catch((err) => {
      setRecoil(baseListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateBaseApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.base, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('baseMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(res?.message)
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      toast.error(errRes.message)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateBaseApi = async (data: any, baseId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.base + baseId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('baseMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('baseMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      toast.error(errRes.message)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteBaseApi = async (baseId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.base + baseId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('baseMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(res.message)
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      toast.error(errRes.message)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
