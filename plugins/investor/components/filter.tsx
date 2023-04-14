import { investorTypeOptionsState, staffOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const investorTypeOptions = useRecoilValue(investorTypeOptionsState)
  const staffOptions = useRecoilValue(staffOptionsState)

  const handleChangeOptionInvestorType = (event: SyntheticEvent<Element, Event>, value: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        investorTypeId: value?.id ?? '',
      }
    })
  }

  const handleChangeOptionStaff = (event: SyntheticEvent<Element, Event>, value: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        staffId: value?.id ?? '',
      }
    })
  }

  return (
    <Stack direction={'row'} spacing={2} display={{ xs: 'none', lg: 'flex' }}>
      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          disablePortal
          id="investorTypeId"
          options={investorTypeOptions}
          onChange={handleChangeOptionInvestorType}
          renderInput={(params) => <TextField {...params} placeholder={t('investorTypeFilter')} />}
        />
      </FormControl>

      <FormControl sx={{ width: 280 }}>
        <Autocomplete
          disablePortal
          id="staffId"
          options={staffOptions}
          onChange={handleChangeOptionStaff}
          renderInput={(params) => <TextField {...params} placeholder={t('investorStaffFilter')} />}
        />
      </FormControl>
    </Stack>
  )
}
