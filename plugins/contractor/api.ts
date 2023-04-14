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
import { contractorListState } from './store'

export const getContractorDataApi = async () => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(contractorListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.contractors}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(contractorListState, res?.data?.contractors?.data)
        setRecoil(totalPageState, res.data?.contractors?.paginate?.total)
      } else {
        setRecoil(contractorListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(contractorListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateContractorApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.contractors, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractorMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('contractorMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('contractorMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateContractorApi = async (data: any, contractorId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.contractors + contractorId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractorMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('contractorMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('contractorMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteContractorApi = async (contractorId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.contractors + contractorId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractorMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('contractorMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('contractorMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
