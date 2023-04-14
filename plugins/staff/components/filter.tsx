import { departmentChildOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const departmentOptions = useRecoilValue(departmentChildOptionsState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        departmentId: value?.id ?? '',
      }
    })
  }

  return (
    <Stack direction={'row'} spacing={2} display={{ xs: 'none', lg: 'flex' }}>
      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={departmentOptions}
          onChange={handleChangeOption}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('staffSelectDepartmentFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}
