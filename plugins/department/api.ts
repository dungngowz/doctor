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
import {
  departmentListState,
  departmentPermissionsState,
  departmentTotalPermissionsState,
} from './store'

export const getDepartmentApi = async (extraParams?: any) => {
  const paramsData = getRecoil(dataTableParamsState)
  const paramsSearch = new URLSearchParams({ ...paramsData, ...extraParams } as any).toString()
  const data = getRecoil(departmentListState)

  setRecoil(dataTableFirstLoadingState, data?.length > 0 ? false : true)
  return axiosClient
    .get(`${endpoint.department}?${paramsSearch}`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(departmentListState, res?.data?.departments?.data)
        setRecoil(totalPageState, res.data?.departments?.paginate?.total)
        setRecoil(departmentPermissionsState, res.data?.permissions)
        setRecoil(departmentTotalPermissionsState, res?.data?.totalPermissions)
      }
    })
    .catch((err) => {
      setRecoil(departmentListState, [])
      setRecoil(totalPageState, 0)
    })
    .finally(() => {
      setRecoil(dataTableFirstLoadingState, false)
    })
}

export const submitCreateDepartmentApi = async (data: any, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .post(endpoint.department, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('departmentMessageCreateSuccess'))
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

export const submitUpdateDepartmentApi = async (data: any, departmentId = 0, handleClose?: any) => {
  setRecoil(loadingState, true)

  return await axiosClient
    .patch(endpoint.department + departmentId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('departmentMessageUpdateSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState.refetchData + 1,
          }
        })
        handleClose && handleClose()
      } else {
        toast.error(t('departmentMessageUpdateError'))
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

export const deleteDepartmentApi = async (departmentId: number) => {
  setRecoil(loadingState, true)
  return axiosClient
    .delete(endpoint.department + departmentId)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('departmentMessageDeleteSuccess'))
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
