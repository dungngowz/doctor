export type ProductCategoryType = {
  id: number
  title: string
}

export type ProductCategoryOptionsType = {
  id: number
  value: string | number
  label: string
}

export type ProductType = {
  id: number
  title: string
  code: string
  unit: string
  type: number
  standard: string
  memo: string
  createdAt: string
  updatedAt: string
  productCategory: ProductCategoryType
}
