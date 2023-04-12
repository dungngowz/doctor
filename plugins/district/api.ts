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
import { districtListState } from './store'

export const getDistrictDataApi = async () => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(districtListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.districts}?${paramsSearch}`)
    .then((res) => {
      setRecoil(districtListState, res?.data?.districts?.data)
      setRecoil(totalPageState, res.data?.districts?.paginate?.total)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateDistrictApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.districts, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('districtMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('districtMessageCreateError'))
      }
    })
    .catch((err) => {
      toast.error(t('districtMessageCreateError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateDistrictApi = async (data: any, districtId: number, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.districts + districtId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('districtMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('districtMessageCreateError'))
      }
    })
    .catch((err) => {
      toast.error(t('districtMessageCreateError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteDistrictApi = async (districtId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.districts + districtId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('districtMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('districtMessageDeleteError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('districtMessageDeleteError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
