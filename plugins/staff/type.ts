import { RoleType } from '@/types'

type DepartmentType = {
  id: number
  title: string
}

export type StaffType = {
  id: number
  name: string
  code: string
  address: string
  phone: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
  department: DepartmentType
  startWork: string
  endWork: string
  station: {
    id: number
    name: string
    address: string
  }
  role: RoleType
  roleChildId: number | null
}
