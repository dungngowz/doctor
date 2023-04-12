import { InputLabel, Stack } from '@mui/material'
import { PasswordElement } from 'react-hook-form-mui'

/**
 * @property {string} name - The name of the input field. This is used to identify the field in the form.
 * @property {string} type - The type of input field. Defaults to text.
 * @property {string} label - The label for the input field.
 * @property {boolean} required - boolean
 * @property {any} validation - This is the validation object that we'll use to validate the input field.
 * @property {string} placeholder - The placeholder text that will be displayed in the input field.
 */
type IInputFieldProps = {
  name: string
  type?: string
  label?: string
  required?: boolean
  validation?: any
  placeholder?: string
  disabled?: boolean
}

export const InputPasswordField = (props: IInputFieldProps) => {
  // Props
  const {
    name,
    type,
    validation,
    label = '',
    required = false,
    placeholder = '',
    disabled = false,
  } = props

  return (
    <Stack>
      <InputLabel>
        {label} <span className="required">{required ? '*' : ''}</span>
      </InputLabel>
      <PasswordElement
        name={name}
        fullWidth
        type={type}
        required={required}
        validation={validation}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Stack>
  )
}
