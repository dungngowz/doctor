import { Close } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

type ButtonProps = {
  className?: string
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  handleClick?: (e: any) => void
  disabled?: boolean
  edge?: 'end' | 'start'
}

export const IconButtonClose = (props: ButtonProps) => {
  const { handleClick, className, color, disabled = false, edge = '' } = props
  return (
    <Box className="icon-button-close">
      <IconButton
        onClick={handleClick}
        color={color}
        disabled={disabled}
        edge={edge ? edge : false}
      >
        <Close className={className} />
      </IconButton>
    </Box>
  )
}
