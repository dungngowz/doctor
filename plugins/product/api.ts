import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import { productOptionsState } from '@/store/meta'
import {
  dataTableFirstLoadingState,
  dataTableParamsState,
  totalPageState,
} from '@/store/param-data'
import { DataTableParamsType, IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { toast } from 'react-toastify'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { productListState } from './store'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProductDataApi = async (params: DataTableParamsType | any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(productListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return await axiosClient
    .get(`${endpoint.products}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(productListState, res?.data?.products?.data)
        setRecoil(totalPageState, res.data?.products?.paginate?.total)
      } else {
        setRecoil(productListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(productListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateProductApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.products, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('productMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('productMessageCreateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateProductApi = async (data: any, productId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.products + productId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('productMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('productMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteProductApi = async (regionId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.products + regionId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('productMessageDeleteError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('productMessageDeleteError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const filterProductsByOrderApi = async (orderId: number) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .get(endpoint.filterProductsByOrder + orderId)
    .then((res: IApiResponse | any) => {
      const options = res?.data?.products.map((item: any) => {
        return {
          id: item.id,
          value: item.id,
          label: item.title,
          unit: item.unit,
        }
      })
      setRecoil(productOptionsState, options)
    })
    .catch((err) => {
      setRecoil(productOptionsState, [])
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
