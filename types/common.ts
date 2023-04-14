import { EmotionCache } from '@emotion/react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

/* Defining the props that the Layout component will receive. */
export interface LayoutProps {
  children: ReactNode
}

export type NextPageWithLayout = NextPage & {
  Layout?: (props: LayoutProps) => ReactElement
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  emotionCache?: EmotionCache
}

export type BreadcrumbType = {
  name: string
  to: string
}

export type DataTableParamsType = {
  refetchData: number
  rowsPerPage: number
  page: number
  orderBy: string
  orderSort: string
  keyword: string
}

export type OptionsType = {
  id: number | any
  value: string | number
  label: string
}
export type ProductOptionsType = {
  id: number | any
  value: string | number
  label: string
  unit: string
}

export type RoleType = 'admin' | 'business' | 'accountant' | 'coordinate' | 'driver'
