import { customerTypeOptionsState, staffOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { OptionsType } from '@/types'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const staffOptions = useRecoilValue(staffOptionsState)
  const customerTypeOptions = useRecoilValue(customerTypeOptionsState)

  const handleChangeOption = (
    event: SyntheticEvent<Element, Event>,
    value: OptionsType | null,
    type: string
  ) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        [type]: value?.id ?? '',
      }
    })
  }

  return (
    <Stack
      spacing={2}
      direction={'row'}
      flexShrink={0}
      width="100%"
      display={{ xs: 'none', lg: 'flex' }}
    >
      <FormControl sx={{ width: 240 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={staffOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'staffId')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('contractorSelectStaffFilter')} />
          )}
        />
      </FormControl>
      <FormControl sx={{ width: 240 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={customerTypeOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'customerTypeId')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('contractorSelectCustomerTypeFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}
