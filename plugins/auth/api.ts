import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import { userProfileApi } from '@/meta/user'
import { IApiResponse } from '@/types'
import { axiosClient, t } from '@/utils'
import { deleteCookie, setCookie } from 'cookies-next'
import { NextRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SetterOrUpdater } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { FormForgotPassword } from './components/forgot-password'
import { FormLoginType } from './types'

export const loginApi = async (data: FormLoginType, toast: any) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .post(endpoint.login, data)
    .then((res: IApiResponse | any) => {
      if (res.code === 200) {
        const accessToken = res.data.accessToken
        if (data.remember) {
          setCookie('erpAccessToken', accessToken, {
            httpOnly: false,
            sameSite: 'lax',
          })
        } else {
          sessionStorage.setItem('erpAccessToken', accessToken)
        }
        // console.log(res)
        toast.success('Đăng nhập thành công!')
        location.href = '/'
      } else {
        toast.error('Email hoặc mật khẩu không chính xác!')
      }
    })
    .catch((err) => {
      toast.error('Email hoặc mật khẩu không chính xác!')
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const forgotPasswordApi = async (
  data: FormForgotPassword,
  enqueueSnackbar: any,
  setLoading: SetterOrUpdater<boolean>
) => {
  setLoading(true)
  return await axiosClient
    .post(endpoint.forgotPassword, data)
    .then((res: any) => {
      if (res.code === 200) {
        // enqueueSnackbar('Please check your email!', { variant: 'success' })
      } else {
        // enqueueSnackbar(res.message, { variant: 'error' })
      }
    })
    .catch((err) => {
      // enqueueSnackbar(err.response.data.message, { variant: 'error' })
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * It removes the accessToken from sessionStorage and the cookie, then redirects to the home page
 * @param {NextRouter | any} router - NextRouter | any
 */
export const logoutApi = (router: NextRouter | any) => {
  setRecoil(loadingState, true)
  axiosClient
    .get(endpoint.logout)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        setRecoil(loadingState, true)
        sessionStorage.removeItem('erpAccessToken')
        deleteCookie('erpAccessToken')
        location.href = '/login'
      } else {
        toast.error(t('logoutMessageError'))
      }
    })
    .catch((err) => {
      toast.error(t('logoutMessageError'))
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}

export const updateProfileApi = async (payload: any, handleClose: () => void) => {
  setRecoil(loadingState, true)
  return await axiosClient
    .post(endpoint.updateProfile, payload)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        toast.success(t('userUpdateMessageSuccess'))
        handleClose()
        userProfileApi()
      } else {
        toast.error(res?.message)
        handleClose()
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message)
      handleClose()
    })
    .finally(() => {
      setRecoil(loadingState, false)
    })
}
