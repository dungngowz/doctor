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
import { orderListState } from './store'

export const getOrderApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(orderListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.orders}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(orderListState, res?.data?.orders?.data)
        setRecoil(totalPageState, res.data?.orders?.paginate?.total)
      } else {
        setRecoil(orderListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(orderListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateOrderApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.orders, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('orderMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('orderMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('orderMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitAccountantUpdateOrderApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.orders + 'is-approved-accountant', data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('orderMessageUpdateSuccess'))
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

export const submitUpdateOrderApi = async (data: any, orderId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.orders + orderId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('orderMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('orderMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('orderMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteOrderApi = async (orderId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.orders + orderId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('orderMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('orderMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('orderMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const updateFinishOrderApi = async (orderId: number, data: any, callBack?: any) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .post(endpoint.updateFinish + orderId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('orderUpdateFinishSuccess'))

        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        callBack && callBack()
      } else {
        toast.error(res?.message)
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
