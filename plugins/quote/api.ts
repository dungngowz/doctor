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
import { quoteListState } from './store'

export const getQuoteApi = async (moreParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...moreParams } as any).toString()
  const data = getRecoil(quoteListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.quotes}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(quoteListState, res?.data?.quotes?.data)
        setRecoil(totalPageState, res.data?.quotes?.paginate?.total)
      } else {
        setRecoil(quoteListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(quoteListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateQuoteApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.quotes, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('quoteMessageCreateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(res?.message)
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

export const submitUpdateQuoteApi = async (data: any, quoteId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.quotes + quoteId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('quoteMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('quoteMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('quoteMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteQuoteApi = async (quoteId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.quotes + quoteId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('quoteMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('quoteMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('quoteMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const checkCanUpdateStatusApi = async (quoteId: number) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .get(endpoint.quotesCheckCanUpdateStatus + quoteId)
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

export const checkCanUpdateInfoGeneralApi = async (quoteId: number) => {
  return await axiosClient
    .get(endpoint.quotesCheckCanUpdateInfoGeneral + quoteId)
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

export const exportPdfQuoteApi = async (token: any) => {
  return await axiosClient
    .get(endpoint.exportPdfQuote + token)
    .then((res) => {
      //
    })
    .catch((err) => {
      //
    })
    .finally(() => {
      //
    })
}
