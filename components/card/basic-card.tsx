import { Box, Stack } from '@mui/material'
import { ReactNode } from 'react'
import { brand } from '../colors/brand'

type IProps = {
  children: ReactNode
  title?: ReactNode | string
  backgroundCard?: 'white' | 'grey'
}

export const BasicCard = (props: IProps) => {
  // Props
  const { children, title = '', backgroundCard = 'grey' } = props
  return (
    <Stack width={'100%'}>
      <Box className="input-label">{title}</Box>

      <Stack
        border={1}
        p={2}
        spacing={1.5}
        borderRadius="8px"
        borderColor={brand.gray300}
        bgcolor={backgroundCard == 'grey' ? brand.gray50 : '#fff'}
      >
        {children}
      </Stack>
    </Stack>
  )
}
