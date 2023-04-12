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
import { provinceListState } from './store'

export const getProvinceDataApi = async (params?: DataTableParamsType | any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(provinceListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.provinceList}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(provinceListState, res?.data?.provinces?.data)
        setRecoil(totalPageState, res.data?.provinces?.paginate?.total)
      } else {
        setRecoil(provinceListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(provinceListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateProvinceApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.submitProvince, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('provinceMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('provinceMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('provinceMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateProvinceApi = async (data: any, handleClose?: any, provinceId = 0) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.submitProvince + '/' + provinceId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('provinceMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('provinceMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('provinceMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteProvinceApi = async (provinceId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.submitProvince + '/' + provinceId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('provinceMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('provinceMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('provinceMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
