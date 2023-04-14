import { Stack, Typography } from '@mui/material'
import { brand } from '../colors/brand'

type IProps = {
  title: string
  description: any
}

export const ItemRow = (props: IProps) => {
  const { title = '', description = '' } = props
  return (
    <Stack flex={1}>
      <Typography className="input-label"> {title}</Typography>
      <Typography fontSize={'13px'} color={brand.gray600} fontWeight={500}>
        {description}
      </Typography>
    </Stack>
  )
}
