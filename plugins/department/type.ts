export type DepartmentType = {
  id: number
  name: string
  roleChildIds: number[]
  label: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export type DepartmentPermissionsType = {
  id: number
  label: string
  value: string
  permissions: {
    id: number
    label: string
    value: string
  }[]
}
