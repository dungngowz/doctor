import endpoint from '@/config/endpoint.json'
import { roleState } from '@/store/common'
import { departmentChildOptionsState } from '@/store/meta'
import { isUserLoadingState, userState } from '@/store/user'
import { IApiResponse } from '@/types'
import { axiosClient } from '@/utils'
import { toast } from 'react-toastify'
import { setRecoil } from 'recoil-nexus'

export const userProfileApi = async () => {
  setRecoil(isUserLoadingState, true)
  return await axiosClient
    .get(endpoint.me)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(userState, res.data.account)
        setRecoil(roleState, res.data.account.department?.name)

        const options = res.data.departments.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(departmentChildOptionsState, options)
      } else {
        toast.error(res.message)
      }
    })
    .catch((err) => {
      toast.error(err.response.data.message)
    })
    .finally(() => {
      setRecoil(isUserLoadingState, false)
    })
}
