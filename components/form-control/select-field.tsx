import { FormControl, InputLabel, Stack } from '@mui/material'
import { AutocompleteElement, Control } from 'react-hook-form-mui'

/**
 * @property {number} id - The id of the option.
 * @property {string} value - This is the value that will be sent to the server when the user selects this option.
 * @property {string} label - The text that will be displayed in the dropdown
 */
type IOptionsType = {
  id: number
  value: string | number
  label: string
}

/**
 * @property {string} name - The name of the input field.
 * @property {string} label - The label for the input field
 * @property {boolean} required - boolean - if the field is required or not
 * @property {string} placeholder - The placeholder text that will be displayed in the input field.
 * @property {IOptionsType[]} options - This is the array of options that will be displayed in the dropdown.
 */
type IInputFieldProps = {
  name: string
  options: IOptionsType[]
  label?: string
  required?: boolean
  placeholder?: string
  validation?: any
  multiple?: boolean
  control?: Control<any>
  disabled?: boolean
  showCheckbox?: boolean
}

export const SelectField = (props: IInputFieldProps) => {
  // Props
  const {
    name,
    label = '',
    options = [],
    required = false,
    placeholder = '',
    validation,
    multiple = false,
    control,
    disabled = false,
    showCheckbox = false,
  } = props

  return (
    <Stack width={'100%'}>
      <InputLabel>
        {label} <span className="required">{required ? '*' : ''}</span>
      </InputLabel>

      <FormControl disabled={disabled}>
        <AutocompleteElement
          matchId
          control={control}
          multiple={multiple}
          name={name}
          options={options}
          required={required}
          rules={validation}
          showCheckbox={showCheckbox}
          autocompleteProps={{ disabled: disabled }}
          textFieldProps={{
            placeholder: placeholder,
          }}
        />
      </FormControl>
    </Stack>
  )
}
