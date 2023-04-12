import { Search } from '@mui/icons-material'
import { Button } from '@mui/material'

/**
 * IButtonClearProps is an object with a btnText property of type string, a marginRight property of
 * type number, a marginLeft property of type number, and a handleClick property of type function that
 * takes in a data parameter of type any and returns nothing.
 * @property {string} btnText - The text that will be displayed on the button
 * @property {number} marginRight - number - The margin on the right side of the button.
 * @property {number} marginLeft - number - This is the margin left of the button.
 * @property handleClick - This is the function that will be called when the button is clicked.
 */
type IButtonClearProps = {
  btnText: string
  marginRight?: number
  marginLeft?: number
  handleClick?: (data?: any) => void
}

export const ButtonSearch = (props: IButtonClearProps) => {
  // Props
  const { btnText, handleClick, marginRight = 0, marginLeft = 0 } = props

  return (
    <Button
      variant="contained"
      color="success"
      type="submit"
      startIcon={<Search />}
      sx={{ mr: marginRight, ml: marginLeft }}
      onClick={handleClick}
    >
      {btnText}
    </Button>
  )
}
