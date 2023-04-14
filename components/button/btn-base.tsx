import { Button } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ReactNode } from 'react'

/**
 * IButtonClearProps is an object with a btnText property of type string, a marginRight property of
 * type number, a marginLeft property of type number, a disabled property of type boolean, a type
 * property of type 'button' | 'submit', and a handleClick property of type () => void.
 * @property {string} btnText - The text that will be displayed on the button
 * @property {number} marginRight - number
 * @property {number} marginLeft - The margin on the left side of the button.
 * @property {boolean} disabled - This is a boolean property that will disable the button if set to
 * true.
 * @property {'button' | 'submit'} type - The type of button.
 * @property handleClick - This is the function that will be called when the button is clicked.
 */
type IButtonClearProps = {
  btnText: string
  marginRight?: number
  marginLeft?: number
  disabled?: boolean
  type?: 'button' | 'submit'
  fullWidth?: boolean
  handleClick?: () => void
  size?: 'medium' | 'small' | 'large'
  startIcon?: ReactNode
}

export const ButtonBase = (props: IButtonClearProps) => {
  // Props
  const {
    btnText,
    handleClick,
    size = 'medium',
    disabled = false,
    fullWidth = false,
    type = 'button',
    startIcon,
  } = props
  return (
    <Button
      type={type}
      onClick={handleClick}
      size={size}
      disableElevation
      fullWidth={fullWidth}
      variant={'contained'}
      color={'inherit'}
      sx={{ bgcolor: grey[100] }}
      disabled={disabled}
      startIcon={startIcon}
    >
      {btnText}
    </Button>
  )
}
