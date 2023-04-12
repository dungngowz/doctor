import { ReactNode } from 'react'

export type MenuType = {
  id: string
  label: string
  to: string
  icon: ReactNode
  submenu: MenuSubType[]
  actived?: string[]
  permission: boolean
}

export type MenuSubType = {
  id: string
  label: string
  to: string
  icon: ReactNode
  parentId: string
  subParentId?: string
  submenu: any
  permission: boolean
}
