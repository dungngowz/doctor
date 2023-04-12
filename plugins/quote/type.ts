type ContractorType = {
  id: number
  name: string
}

type DistrictType = {
  id: number
  title: string
}

type DetailType = {
  qty: number
  price: number
  productId: number
  unit: string
  memo: string
}

type PaymentMethodType = {
  id: number
  title: string
}

type ProjectType = {
  id: number
  name: string
}

type ProvinceType = {
  id: number
  title: string
}

type StaffAuthorType = {
  id: number
  name: string
}

export type QuoteType = {
  id: number
  code: string
  customerFeedback: number
  customerFeedbackNote: string
  contractor: ContractorType
  items: DetailType[]
  district: DistrictType
  durationQuote: string
  finalPrice: string
  paymentMethodOther: string
  finalPriceFormatted: string
  memo: string | null
  paymentMethod: PaymentMethodType
  project: ProjectType
  province: ProvinceType
  staffAuthor: StaffAuthorType
  staffConfirm: StaffAuthorType | null
  status: number
  canDelete: boolean
  createdAt: string
  updatedAt: string
  token: string
  hasContract: boolean
  paymentMethodNote: string
  salesForm: {
    id: number
    title: string
  }
  contractorSub: {
    id: number
    name: string
  }
  logs: {
    name: string
    created_at: string
    title: string
  }[]
}

export type CurrentProductType = {
  id?: number
  title: string
  qty: number
  price: number
}
