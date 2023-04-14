import { InputLabel, Stack } from '@mui/material'
import { PasswordRepeatElement } from 'react-hook-form-mui'

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
  passwordFieldName: string
  type?: string
  label?: string
  required?: boolean
  validation?: any
  placeholder?: string
}

export const InputPasswordRepeatField = (props: IInputFieldProps) => {
  // Props
  const {
    name,
    passwordFieldName = '',
    type,
    validation,
    label = '',
    required = false,
    placeholder = '',
  } = props

  return (
    <Stack>
      <InputLabel>
        {label} <span className="required">{required ? '*' : ''}</span>
      </InputLabel>

      <PasswordRepeatElement
        name={name}
        passwordFieldName={passwordFieldName}
        fullWidth
        type={type}
        required={required}
        validation={validation}
        placeholder={placeholder}
      />
    </Stack>
  )
}
