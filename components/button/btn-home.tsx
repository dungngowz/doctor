import { Dashboard } from '@mui/icons-material'
import { Button } from '@mui/material'

/**
 * IButtonHomeProps is an object with a btnText property of type string, a marginRight property of
 * type number, a marginLeft property of type number, and a handleClick property of type function that
 * returns void.
 * @property {string} btnText - The text that will be displayed on the button.
 * @property {number} marginRight - number - The margin on the right side of the button.
 * @property {number} marginLeft - number - The margin on the left side of the button.
 * @property handleClick - This is the function that will be called when the button is clicked.
 */
type IButtonHomeProps = {
  btnText: string
  marginRight?: number
  marginLeft?: number
}

export const ButtonHome = (props: IButtonHomeProps) => {
  // Props
  const { btnText, marginRight = 0, marginLeft = 0 } = props

  return (
    <Button
      variant="contained"
      color="success"
      disableElevation
      sx={{ mr: marginRight, ml: marginLeft }}
      startIcon={<Dashboard />}
      href="/"
    >
      {btnText}
    </Button>
  )
}
