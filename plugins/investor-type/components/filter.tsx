import { contractorOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const contractorOptions = useRecoilValue(contractorOptionsState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any, type: string) => {
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
      <FormControl sx={{ width: 200 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={contractorOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'contractorId')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('contractSelectContractorFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}
