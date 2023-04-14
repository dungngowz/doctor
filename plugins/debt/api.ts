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
import { debtListState } from './store'

export const getDebtApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(debtListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.orders}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(debtListState, res?.data?.orders?.data)
        setRecoil(totalPageState, res.data?.orders?.paginate?.total)
      } else {
        setRecoil(debtListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(debtListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateDebtApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.orders, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('debtMessageCreateSuccess'))
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

export const submitAccountantUpdateDebtApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.orders + 'is-approved-accountant', data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('orderMessageUpdateSuccess'))
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

export const submitUpdateDebtApi = async (data: any, debtId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.orders + debtId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('debtMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('debtMessageUpdateError'))
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('debtMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const deleteDebtApi = async (debtId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.orders + debtId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('debtMessageDeleteSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
      } else {
        toast.error(t('debtMessageDeleteError'))
      }
    })
    .catch((err) => {
      toast.error(t('debtMessageDeleteError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

// export const checkCanUpdateStatusBusiness = async (debtId: number) => {
//   return await axiosClient
//     .get(endpoint.ordersCheckCanUpdateStatusBusiness + debtId)
//     .then((res: IApiResponse | any) => {
//       if (res.code == 200) {
//         setRecoil(canUpdateStatusBusinessState, true)
//       } else {
//         setRecoil(canUpdateStatusBusinessState, false)
//       }
//     })
//     .catch((err) => {
//       setRecoil(canUpdateStatusBusinessState, false)
//     })
// }

// export const checkCanUpdateStatusAccountant = async (debtId: number) => {
//   return await axiosClient
//     .get(endpoint.ordersCheckCanUpdateStatusAccountant + debtId)
//     .then((res: IApiResponse | any) => {
//       if (res.code == 200) {
//         setRecoil(canUpdateStatusAccountantState, true)
//       } else {
//         setRecoil(canUpdateStatusAccountantState, false)
//       }
//     })
//     .catch((err) => {
//       setRecoil(canUpdateStatusAccountantState, false)
//     })
//     .finally(() => {
//       setRecoil(loadingState, false)
//     })
// }

// export const checkCanUpdateStatusInfoGeneral = async (debtId: number) => {
//   setRecoil(loadingState, true)
//   return await axiosClient
//     .get(endpoint.ordersCheckCanUpdateStatusInfoGeneral + debtId)
//     .then((res: IApiResponse | any) => {
//       if (res.code == 200) {
//         setRecoil(canUpdateStatusInfoGeneralState, true)
//       } else {
//         setRecoil(canUpdateStatusInfoGeneralState, false)
//       }
//     })
//     .catch((err) => {
//       setRecoil(canUpdateStatusInfoGeneralState, false)
//     })
// }
