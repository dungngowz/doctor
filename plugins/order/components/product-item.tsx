import { formatPrice, formatQty } from '@/utils'
import { Stack, Typography } from '@mui/material'

type IProps = {
  item: any[]
}

export const ProductItem = (props: IProps) => {
  const { item = [] } = props
  return (
    <Stack>
      {item.length > 0 &&
        item.map((quote) => (
          <Typography key={quote?.productId}>
            • <span>{quote?.title}:</span>
            <span style={{ paddingLeft: '6px', fontSize: '10px', fontStyle: 'italic' }}>
              {formatPrice(quote?.price)} x {formatQty(quote?.qty) + ' ' + quote?.unit}
            </span>
          </Typography>
        ))}
    </Stack>
  )
}
