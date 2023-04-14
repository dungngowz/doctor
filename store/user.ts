import { UserType } from '@/types/user'
import { atom, selector } from 'recoil'

export const userState = atom<UserType>({
  key: 'userState',
  default: undefined,
})

export const managerStaffState = selector({
  key: 'managerStaffState',
  get: ({ get }) => {
    const canApproved = get(userState)
    return canApproved?.canApproved
  },
})

export const canApprovedState = selector({
  key: 'canApprovedState',
  get: ({ get }) => {
    const user = get(userState)
    return user?.canApproved
  },
})

export const isUserLoadingState = atom<boolean>({
  key: 'isUserLoadingState',
  default: true,
})

export const permissionsRuleState = selector({
  key: 'permissionsRuleState',
  get: async ({ get }) => {
    const allPermissions = await get(userState)
    return allPermissions?.permissions ?? []
  },
})
