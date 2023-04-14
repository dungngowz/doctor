import { Message } from '@mui/icons-material'
import { IconButton } from '@mui/material'

/**
 * IIconButtonDeleteProps is an object with a handleClick property that is a function that takes an
 * event and returns void.
 * @property handleClick - This is the function that will be called when the button is clicked.
 */
type IIconButtonProps = {
  handleClick?: (e: any) => void
}

export const IconButtonMessage = (props: IIconButtonProps) => {
  // Props
  const { handleClick } = props
  return (
    <IconButton onClick={handleClick}>
      <Message />
    </IconButton>
  )
}
