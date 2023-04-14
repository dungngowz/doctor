import { AppBar, Stack, Toolbar, Typography } from '@mui/material'
import { IconButtonClose } from '../button'

type IProps = {
  title?: string
  handleClose?: () => void
}

export const ModalFullScreenAppBar = (props: IProps) => {
  // Props
  const { title = '', handleClose } = props

  return (
    <AppBar sx={{ position: 'relative' }} elevation={0}>
      <Toolbar>
        <Typography flex={1}>{title}</Typography>
        <Stack direction={'row'} spacing={2}>
          <IconButtonClose color="inherit" handleClick={handleClose} />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
