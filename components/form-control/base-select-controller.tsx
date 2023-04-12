import { ErrorMessage } from '@hookform/error-message'
import { Autocomplete, FormControl, InputLabel, Stack, TextField, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
type IOptionsType = {
  id: number
  value: string | number
  label: string
}
type IProps = {
  name: string
  options: IOptionsType[]
  label?: string
  required?: boolean
  validation?: any
  formContext?: any
  placeholder?: string
}

export const BaseSelectController = (props: IProps) => {
  const {
    name,
    options = [],
    label,
    required = false,
    formContext,
    validation,
    placeholder,
  } = props

  const {
    formState: { errors },
    register,
    setValue,
    control,
  }: any = formContext

  const [hasError, setError] = useState(true)

  return (
    <Stack width={'100%'}>
      <InputLabel>
        {label} <span className="required">{required ? '*' : ''}</span>
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          console.log(field)
          return (
            <FormControl>
              <Autocomplete
                options={options as any}
                defaultValue={() => {
                  const a = options.find((i) => i.id == field.value)
                  return a?.label ?? ''
                }}
                id={name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register(name, validation)}
                    placeholder={placeholder}
                  />
                )}
              />
            </FormControl>
          )
        }}
      />

      {hasError && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <Typography pl={1} pt={0.3} fontSize={'12px'} color={red[600]}>
              {message}
            </Typography>
          )}
        />
      )}
    </Stack>
  )
}
