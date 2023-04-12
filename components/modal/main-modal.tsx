import { Box, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { brand } from '../colors/brand'

/**
 * `IBasicModalProps` is an object with optional properties `children`, `open`, and `maxWidth`.
 *
 * The `children` property is of type `ReactNode`, which is a type that can be anything that can be
 * rendered by React.
 *
 * The `open` property is of type `boolean`, which is a type that can be either `true` or `false`.
 *
 * The `maxWidth` property is of type `'sm' | 'md' | 'lg'`, which is a type that can be either `'
 * @property {ReactNode} children - The content of the modal.
 * @property {boolean} open - boolean - whether the modal is open or not
 * @property {'sm' | 'md' | 'lg'} maxWidth - The maximum width of the modal.
 */
type IBasicModalProps = {
  children?: ReactNode
  open?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  onClose?: () => void
  fullWidth?: boolean
}

export const MainModal = (props: IBasicModalProps) => {
  /* Destructuring the props object. */
  const { children, open = false, maxWidth = 'xs', title = '', onClose, fullWidth = true } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={fullWidth ? maxWidth : false}
      sx={{
        zIndex: 999 + 1,
        '& .MuiPaper-root': {
          borderRadius: '10px',
        },
      }}
    >
      {title && (
        <Stack
          direction={'row'}
          alignItems="center"
          px={'16px'}
          py={'12px'}
          justifyContent="space-between"
          bgcolor={brand.gray100}
        >
          <Typography
            fontSize={'17px'}
            fontWeight={600}
            textAlign="center"
            flex={1}
            color="primary"
          >
            {title}
          </Typography>
        </Stack>
      )}
      <DialogContent dividers>
        <Box minHeight={100} pb={0.5}>
          {children}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
