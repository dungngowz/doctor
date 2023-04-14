import { ErrorMessage } from '@hookform/error-message'
import { FormControl, InputLabel, Stack, TextField, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import React from 'react'
import { Controller } from 'react-hook-form'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

type IProps = {
  name: string
  label?: string
  required?: boolean
  validation?: any
  formContext: any
  placeholder?: string
  disabled?: boolean
  align?: 'right' | 'left'
  variant?: 'standard' | 'outlined'
}

export const NumericFieldController = (props: IProps) => {
  const {
    name,
    label,
    required = false,
    formContext,
    validation,
    placeholder,
    disabled = false,
    align = 'left',
    variant = 'outlined',
  } = props

  const {
    formState: { errors },
    register,
    control,
  }: any = formContext

  return (
    <Stack width={'100%'} className={align == 'right' ? 'input-align__right' : ''}>
      <InputLabel>
        {label}
        <span className="required">{required ? '*' : ''}</span>
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl>
              <TextField
                {...field}
                {...register(name, validation)}
                onChange={field.onChange}
                value={field.value}
                placeholder={placeholder}
                disabled={disabled}
                name="numberformat"
                id="formatted-numberformat-input"
                autoComplete="off"
                variant={variant}
                InputProps={{
                  inputComponent: NumericFormatCustom as any,
                }}
              />
            </FormControl>
          )
        }}
      />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <Typography pl={1} pt={0.3} fontSize={'11px'} color={red[600]}>
            {message}
          </Typography>
        )}
      />
    </Stack>
  )
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
        thousandSeparator
        valueIsNumericString
      />
    )
  }
)

{
  /* <NumericFormat
                {...field}
                {...register(name, validation)}
                placeholder={placeholder}
                disabled={disabled}
                type={type}
                customInput={TextField}
                thousandSeparator={true}
                autoComplete="off"
              /> */
}
