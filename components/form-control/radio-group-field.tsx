import { InputLabel, Stack } from '@mui/material'
import { RadioButtonGroup } from 'react-hook-form-mui'

type IOptionsType = {
  id: number | string
  label: string
}

type IInputFieldProps = {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  options: IOptionsType[]
  row?: boolean
}

export const RadioGroupField = (props: IInputFieldProps) => {
  // Props
  const { name, label = '', required = false, disabled = false, options = [], row = true } = props

  return (
    <Stack width={'100%'}>
      {label && (
        <InputLabel sx={{ mb: '-4px' }}>
          {label} <span className="required">{required ? '*' : ''}</span>
        </InputLabel>
      )}

      <RadioButtonGroup
        disabled={disabled}
        name={name}
        options={options}
        required={required}
        row={row}
        // type="number"
      />
    </Stack>
  )
}
