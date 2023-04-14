import { Check } from '@mui/icons-material'
import { IconButton } from '@mui/material'

type ButtonProps = {
  className?: string
  handleClick?: (e: any) => void
}


export const IconButtonCheck = (props: ButtonProps) => {
  const { handleClick, className } = props
  return (
    <IconButton onClick={handleClick}>
      <Check className={className} />
    </IconButton>
  )
}
