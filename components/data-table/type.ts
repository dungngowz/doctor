export type HeadCellsType = {
  id: string
  title: string
  numeric: boolean
  disableSort: boolean // disable sorting
  colSpan?: number
  width?: number | string
  disablePadding?: boolean
  align?: 'center' | 'left' | 'right'
}
