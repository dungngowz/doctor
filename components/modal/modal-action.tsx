import { Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ReactNode } from 'react'

type IProps = {
  children: ReactNode
}

export const ModalAction = (props: IProps) => {
  const { children } = props

  return (
    <Stack
      py={2}
      px={3}
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      position={'absolute'}
      bottom={0}
      bgcolor="#fff"
      width={'100%'}
      left={0}
      borderTop={1}
      borderColor={grey[200]}
    >
      {children}
    </Stack>
  )
}
