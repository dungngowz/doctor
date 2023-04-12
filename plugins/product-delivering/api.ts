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
import { productDeliveringListState } from './store'

export const getProductDeliveringApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(productDeliveringListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.productDeliveries}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(productDeliveringListState, res?.data?.productDeliveries?.data)
        setRecoil(totalPageState, res.data?.productDeliveries?.paginate?.total)
      }
    })
    .catch((err) => {
      setRecoil(productDeliveringListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitUpdateProductDeliveringApi = async (
  data: any,
  productDeliveryId = 0,
  handleClose?: any
) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.productDeliveries + productDeliveryId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('productDeliveryMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
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
