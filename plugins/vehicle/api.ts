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
import { vehicleListState } from './store'

export const getVehicleApi = async () => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(vehicleListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)

  return axiosClient
    .get(`${endpoint.vehicles}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(vehicleListState, res?.data?.vehicles?.data)
        setRecoil(totalPageState, res.data?.vehicles?.paginate?.total)
      } else {
        setRecoil(vehicleListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(vehicleListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateVehicleApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.vehicles, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('vehicleMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('vehicleMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('vehicleMessageCreateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateVehicleApi = async (data: any, vehicleId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.vehicles + vehicleId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('vehicleMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('vehicleMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('vehicleMessageCreateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteVehicleApi = async (vehicleId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.vehicles + vehicleId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('vehicleMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('vehicleMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('vehicleMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
