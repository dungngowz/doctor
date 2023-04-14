type region = {
  id: number
  title: string
}

export type ProvinceType = {
  id: number
  title: string
  region: region
  createdAt: string
  updatedAt: string
}
