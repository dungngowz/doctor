import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import {
  dataTableFirstLoadingState,
  dataTableParamsState,
  totalPageState,
} from '@/store/param-data'
import { DataTableParamsType, IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { toast } from 'react-toastify'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { productInputListState } from './store'

export const getProductInputApi = async (params: DataTableParamsType | any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(productInputListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return await axiosClient
    .get(`${endpoint.productInput}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(productInputListState, res?.data?.productInputs?.data)
        setRecoil(totalPageState, res.data?.productInputs?.paginate?.total)
      } else {
        setRecoil(productInputListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(productInputListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateProductInputApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.productInput, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productInputMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('productInputMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('productInputMessageCreateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateProductInputApi = async (
  data: any,
  productInputId = 0,
  handleClose?: any
) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.productInput + productInputId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productInputMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('productInputMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('productInputMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteProductInputApi = async (productInputId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.productInput + productInputId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productInputMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('productInputMessageDeleteError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('productInputMessageDeleteError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
