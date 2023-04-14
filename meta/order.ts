import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import { dataTableParamsState } from '@/store/param-data'
import { IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { toast } from 'react-toastify'
import { setRecoil } from 'recoil-nexus'

export const submitOrderDiscountApi = async (orderId: number, data: any) => {
  setRecoil(loadingState, true)
  await axiosClient
    .post(endpoint.updateDiscount + orderId, data)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('debtSubmitDiscountSuccess'))
        setRecoil(dataTableParamsState, (prevState) => {
          return {
            ...prevState,
            refetchData: prevState?.refetchData + 1,
          }
        })
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
