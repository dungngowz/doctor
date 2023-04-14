import { CustomDateAdapter } from '@/utils'
import { InputLabel, Stack } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import vi from 'date-fns/locale/vi'
import { ControllerProps, DatePickerElement } from 'react-hook-form-mui'

/**
 * @property {string} name - The name of the input field. This is used to identify the field in the form.
 * @property {string} type - The type of input field. Defaults to text.
 * @property {string} label - The label for the input field
 * @property {boolean} required - This is a boolean value that indicates whether the field is required or not.
 * @property {string} placeholder - The text that will be displayed when the input is empty.
 */
type IInputFieldProps = {
  name: string
  label?: string
  required?: boolean
  validation?: ControllerProps['rules'] | any
  disabled?: boolean
  minDate?: any
}

export const DatePicker = (props: IInputFieldProps) => {
  // Props
  const { name, label = '', required = false, validation, disabled = false, minDate = '' } = props

  return (
    <Stack width={'100%'}>
      <InputLabel>
        {label} <span className="required">{required ? '*' : ''}</span>
      </InputLabel>

      <LocalizationProvider adapterLocale={vi} dateAdapter={CustomDateAdapter}>
        <DatePickerElement
          name={name}
          isDate
          validation={validation}
          // {...validation}
          required={required}
          disabled={disabled}
          minDate={minDate}
          inputFormat="dd/MM/yyyy"
        />
      </LocalizationProvider>
    </Stack>
  )
}
