import { InputLabel, Stack } from '@mui/material'
import { Control, ControllerProps, Path, TextFieldElement } from 'react-hook-form-mui'

/**
 * @property {string} name - The name of the input field. This is used to identify the field in the form.
 * @property {string} type - The type of input field. Defaults to text.
 * @property {string} label - The label for the input field
 * @property {boolean} required - This is a boolean value that indicates whether the field is required or not.
 * @property {string} placeholder - The text that will be displayed when the input is empty.
 */
type IInputFieldProps = {
  name: Path<any>
  control?: Control<any>
  type?: 'text' | 'number' | 'email'
  label?: string
  required?: boolean
  rows?: number
  placeholder?: string
  validation?: ControllerProps['rules']
  disabled?: boolean
}

export const InputField = (props: IInputFieldProps) => {
  // Props
  const {
    name,
    type = 'text',
    label = '',
    required = false,
    placeholder = '',
    validation,
    rows = 1,
    disabled = false,
    control,
  } = props

  return (
    <Stack width={'100%'}>
      {label ? (
        <InputLabel>
          {label} <span className="required">{required ? '*' : ''}</span>
        </InputLabel>
      ) : null}

      <TextFieldElement
        name={name}
        control={control}
        multiline={rows > 1}
        minRows={rows - 1}
        maxRows={rows}
        fullWidth
        type={type}
        validation={validation}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Stack>
  )
}
