import { Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { grey } from '@mui/material/colors'

type ButtonProps = {
  handleClick?: (e: any) => void
  disabled?: boolean
}

export const IconButtonEdit = (props: ButtonProps) => {
  const { handleClick, disabled = false } = props
  return (
    <IconButton onClick={handleClick} size="small" sx={{ flexShrink: 0 }} disabled={disabled}>
      <Edit sx={{ color: grey[500] }} />
    </IconButton>
  )
}
