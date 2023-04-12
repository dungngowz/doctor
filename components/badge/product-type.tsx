import { LowPriorityRounded, TransitEnterexitRounded } from '@mui/icons-material'
import { Chip } from '@mui/material'

type IProps = {
  type: number
}

export const ProductTypeStatus = (props: IProps) => {
  const { type } = props

  return (
    <>
      {type == 1 && (
        <Chip
          label="Nhập hàng"
          avatar={<LowPriorityRounded />}
          size="small"
          className="badge-success"
        />
      )}
      {type == 2 && (
        <Chip
          label="Xuất hàng"
          avatar={<TransitEnterexitRounded />}
          size="small"
          className="badge-error"
        />
      )}
    </>
  )
}
