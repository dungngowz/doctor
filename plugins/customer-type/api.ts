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
import { customerTypesListState } from './store'

export const getCustomerTypesApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(customerTypesListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.customerTypes}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(customerTypesListState, res?.data?.customerTypes?.data)
        setRecoil(totalPageState, res.data?.customerTypes?.paginate?.total)
      }
    })
    .catch((err) => {
      setRecoil(customerTypesListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateCustomerTypesApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.customerTypes, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('customerTypesMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('customerTypesMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('customerTypesMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateCustomerTypesApi = async (
  data: any,
  customerTypeId = 0,
  handleClose?: any
) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.customerTypes + customerTypeId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('customerTypesMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('customerTypesMessageUpdateError'))
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

export const deleteCustomerTypesApi = async (customerTypeId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.customerTypes + customerTypeId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('customerTypesMessageDeleteSuccess'))
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
