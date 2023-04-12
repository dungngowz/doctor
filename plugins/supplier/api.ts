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
import { supplierListState } from './store'

export const getSupplierApi = async () => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(supplierListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)

  return axiosClient
    .get(`${endpoint.suppliers}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(supplierListState, res?.data?.suppliers?.data)
        setRecoil(totalPageState, res.data?.suppliers?.paginate?.total)
      } else {
        setRecoil(supplierListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(supplierListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateSupplierApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.suppliers, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('supplierMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('supplierMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('supplierMessageCreateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateSupplierApi = async (data: any, supplierId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.suppliers + supplierId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('supplierMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('supplierMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('supplierMessageCreateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteSupplierApi = async (supplierId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.suppliers + supplierId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('supplierMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('supplierMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('supplierMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
