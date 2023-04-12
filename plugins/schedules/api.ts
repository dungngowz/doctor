import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import { dataTableFirstLoadingState } from '@/store/param-data'
import { IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { toast } from 'react-toastify'
import { getRecoil, setRecoil } from 'recoil-nexus'
import {
  dataTableSchedulesParamsState,
  schedulesActiveState,
  schedulesListState,
  schedulesTotalState,
} from './store'

export const getSchedulesApi = async (moreParams?: any) => {
  const paramsData = getRecoil(dataTableSchedulesParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...moreParams } as any).toString()
  const data = getRecoil(schedulesListState)

  let isLoading = true
  if (data?.length > 0) {
    isLoading = false
  }
  if (data?.length > 0 && paramsData?.isFilter) {
    isLoading = true
  }

  setRecoil(dataTableFirstLoadingState, isLoading)

  return await axiosClient
    .get(`${endpoint.schedules}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res?.code == 200) {
        const schedulesList = getRecoil(schedulesListState)
        const responseData = res?.data?.schedules?.data
        let totalArr = [...schedulesList, ...responseData]

        if (paramsData?.isFilter) {
          totalArr = [...responseData]
        } else if (paramsData?.isDeleted) {
          totalArr = [...responseData, ...schedulesList]
        } else if (paramsData.keyword?.length > 0) {
          totalArr = [...responseData]
        } else {
          totalArr = [...schedulesList, ...responseData]
        }

        let arrayUniqueByKey = [...new Map(totalArr.map((item) => [item['id'], item])).values()]

        if (paramsData?.isDeleted) {
          const schedulesActive = getRecoil(schedulesActiveState)
          arrayUniqueByKey = arrayUniqueByKey.filter((item) => item?.id !== schedulesActive?.id)
        }

        setRecoil(schedulesTotalState, res.data.schedules.paginate.total)
        setRecoil(schedulesListState, arrayUniqueByKey)
      } else {
        setRecoil(schedulesListState, [])
      }
    })
    .catch((err) => {
      setRecoil(schedulesListState, [])
    })
    .finally(() => {
      setTimeout(() => {
        setRecoil(dataTableFirstLoadingState, false)
      }, 400)
    })
}

export const getScheduleDetailApi = async (scheduleId = 0) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .get(endpoint.schedules + scheduleId)
    .then((res: IApiResponse | any) => {
      setRecoil(schedulesActiveState, res?.data?.schedule)
    })
    .catch((err) => {
      //
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitCreateSchedulesApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.schedules, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('schedulesMessageCreateSuccess'))
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
            isCreated: true,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(res.message)
      }
    })
    .catch((err) => {
      const errRes = err.response.data
      if (errRes.code == 422) {
        toast.error(errRes.message)
      } else {
        toast.error(t('schedulesMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const submitUpdateSchedulesApi = async (data: any, scheduleId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.schedules + scheduleId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('contractMessageUpdateSuccess'))
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
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

export const deleteSchedulesApi = async (scheduleId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.schedules + scheduleId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('schedulesMessageCreateSuccess'))
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
            isDeleted: true,
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
        toast.error(t('schedulesMessageUpdateError'))
      }
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
