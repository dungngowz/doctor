import endpoint from '@/config/endpoint.json'
import { roleState } from '@/store/common'
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
