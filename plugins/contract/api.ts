import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import { canUpdateInfoGeneralState, canUpdateStatusState } from '@/store/common'
import {
  dataTableFirstLoadingState,
  dataTableParamsState,
  totalPageState,
} from '@/store/param-data'
import { IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { toast } from 'react-toastify'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { contractListState } from './store'

export const getContractApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(contractListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.contracts}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(contractListState, res?.data?.contracts?.data)
        setRecoil(totalPageState, res.data?.contracts?.paginate?.total)
      }
    })
    .catch((err) => {
      setRecoil(contractListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateContractApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.contracts, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('contractMessageCreateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('contractMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateContractApi = async (data: any, contractId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.contracts + contractId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('contractMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('contractMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteContractApi = async (contractId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.contracts + contractId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractMessageDeleteSuccess'))
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
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('contractMessageDeleteError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const checkCanUpdateStatusContractApi = async (contractId: number) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .get(endpoint.contractsCheckCanUpdateStatus + contractId)
    .then((res: IApiResponse | any) => {
      if (res?.code == 200) {
        setRecoil(canUpdateStatusState, true)
      } else {
        setRecoil(canUpdateStatusState, false)
      }
    })
    .catch((err) => {
      setRecoil(canUpdateStatusState, false)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const checkCanUpdateInfoGeneralContractApi = async (contractId: number) => {
  return await axiosClient
    .get(endpoint.contractsCheckCanUpdateInfoGeneral + contractId)
    .then((res: IApiResponse | any) => {
      if (res?.code == 200) {
        setRecoil(canUpdateInfoGeneralState, true)
      } else {
        setRecoil(canUpdateInfoGeneralState, false)
      }
    })
    .catch((err) => {
      setRecoil(canUpdateInfoGeneralState, false)
    })
}
