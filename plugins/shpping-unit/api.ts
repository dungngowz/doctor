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
import { shippingUnitListState } from './store'

export const getShippingUnitApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(shippingUnitListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.shippingUnit}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(shippingUnitListState, res?.data?.shippingUnits?.data)
        setRecoil(totalPageState, res.data?.shippingUnits?.paginate?.total)
      }
    })
    .catch((err) => {
      setRecoil(shippingUnitListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateShippingUnitApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.shippingUnit, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('shippingUnitMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('shippingUnitMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('shippingUnitMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateShippingUnitApi = async (
  data: any,
  shippingUnitId = 0,
  handleClose?: any
) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.shippingUnit + shippingUnitId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('shippingUnitMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('shippingUnitMessageUpdateError'))
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

export const deleteShippingUnitApi = async (shippingUnitId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.shippingUnit + shippingUnitId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('shippingUnitMessageDeleteSuccess'))
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
