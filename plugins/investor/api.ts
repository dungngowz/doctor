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
import { investorListState } from './store'

export const getInvestorDataApi = async () => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams(paramsData as any).toString()
  const data = getRecoil(investorListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.investors}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(investorListState, res?.data?.investors?.data)
        setRecoil(totalPageState, res.data?.investors?.paginate?.total)
      } else {
        setRecoil(investorListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(investorListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateInvestorApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.investors, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('investorMessageCreateSuccess'))
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
      toast.error(err?.response?.data?.message)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateInvestorApi = async (data: any, productId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.investors + productId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('investorMessageUpdateSuccess'))
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

export const deleteInvestorApi = async (regionId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.investors + regionId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('investorMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('investorMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('investorMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
