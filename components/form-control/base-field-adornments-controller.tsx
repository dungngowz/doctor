import { ErrorMessage } from '@hookform/error-message'
import { InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import { Controller } from 'react-hook-form'

type IProps = {
  name: string
  label?: string
  required?: boolean
  validation?: any
  formContext: any
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'number'
  align?: 'right' | 'left'
  adornmentLabel?: string
}

export const BaseFieldAdornmentsController = (props: IProps) => {
  const {
    name,
    label,
    required = false,
    formContext,
    validation,
    placeholder,
    disabled = false,
    type = 'text',
    align = 'left',
    adornmentLabel = 'Kg',
  } = props

  const {
    formState: { errors },
    register,
    control,
  }: any = formContext

  return (
    <Stack width={'100%'} className={align == 'right' ? 'input-align__right' : ''}>
      <InputLabel>
        {label} <span className="required">{required ? '*' : ''}</span>
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <TextField
              {...field}
              {...register(name, validation)}
              placeholder={placeholder}
              disabled={disabled}
              type={type}
              InputProps={{
                startAdornment: <InputAdornment position="start">{adornmentLabel}</InputAdornment>,
              }}
            />
          )
        }}
      />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <Typography pl={1} pt={0.3} fontSize={'12px'} color={red[600]}>
            {message}
          </Typography>
        )}
      />
    </Stack>
  )
}
