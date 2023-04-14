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
import { projectListState } from './store'

export const getProjectApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...(paramsData as any), ...extraParams }).toString()
  const data = getRecoil(projectListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.projects}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(projectListState, res?.data?.projects?.data)
        setRecoil(totalPageState, res.data?.projects?.paginate?.total)
      } else {
        setRecoil(projectListState, [])
        setRecoil(totalPageState, 0)
      }
    })
    .catch((err) => {
      setRecoil(projectListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateProjectApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.projects, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('projectMessageCreateSuccess'))
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

export const submitUpdateProjectApi = async (data: any, projectId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.projects + projectId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('projectMessageUpdateSuccess'))
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

export const deleteProjectApi = async (projectId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.projects + projectId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('projectMessageDeleteSuccess'))
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
      toast.error(errRes.message)
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
