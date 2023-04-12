import { Autocomplete, FormControl, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'

/**
 * IRecordOption is an object with three properties: id, value, and label.
 * @property {number} id - The id of the record.
 * @property {string} value - The value of the option.
 * @property {string} label - The text that will be displayed in the dropdown
 */
type IRecordOption = {
  id: number
  value: number
  label: string
}

/**
 * `ITableProps` is an object with optional properties `options`, `onHandleChange`, and `label`.
 *
 * `options` is an array of `IRecordOption` objects.
 *
 * `onHandleChange` is a function that takes no arguments and returns nothing.
 *
 * `label` is a string.
 * @property {IRecordOption[]} options - This is an array of objects that will be used to populate the
 * table.
 * @property {any} onHandleChange - This is a function that will be called when the user clicks on a
 * record option.
 * @property {string} label - The label of the table
 */
type ITableProps = {
  options?: IRecordOption[]
  onHandleChange?: any
  label?: string
}

export const TableFilter = (props: ITableProps) => {
  /* Destructuring the `options` property from the `props` object. */
  const { options = [], onHandleChange, label = '' } = props

  /**
   * A function that takes in an event and a newValue. It then calls the onHandleChange function with the
   * newValue.
   * @param e - SyntheticEvent<Element, Event>
   * @param {IRecordOption | null} newValue - IRecordOption | null
   */
  const handleChange = (e: SyntheticEvent<Element, Event>, newValue: IRecordOption | null) => {
    onHandleChange(newValue)
  }
  return (
    <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
      <Autocomplete
        size="small"
        disablePortal
        id="categoryValue"
        options={options}
        onChange={handleChange}
        isOptionEqualToValue={(option: IRecordOption, item) => option?.value === item?.value}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </FormControl>
  )
}
