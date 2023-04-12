import { Button } from '@mui/material'

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
}

export const ButtonSubmit = (props: IButtonClearProps) => {
  // Props
  const {
    btnText,
    handleClick,
    marginRight = 0,
    marginLeft = 0,
    disabled = false,
    fullWidth = false,
    type = 'button',
    size = 'medium',
  } = props
  return (
    <Button
      type={type}
      onClick={handleClick}
      disableElevation
      size={size}
      fullWidth={fullWidth}
      variant={'contained'}
      color={'primary'}
      disabled={disabled}
      sx={{ mr: marginRight, ml: marginLeft }}
    >
      {btnText}
    </Button>
  )
}
