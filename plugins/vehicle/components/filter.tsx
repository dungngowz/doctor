import { shippingUnitOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const shippingUnitOptions = useRecoilValue(shippingUnitOptionsState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        shippingUnitId: value?.id ?? '',
      }
    })
  }

  return (
    <Stack display={{ xs: 'none', lg: 'flex' }}>
      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={shippingUnitOptions}
          onChange={handleChangeOption}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('vehicleShippingUnitFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}
