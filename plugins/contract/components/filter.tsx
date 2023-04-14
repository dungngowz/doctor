import { contractorOptionsState, projectOptionsState, statusOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const projectOptions = useRecoilValue(projectOptionsState)
  const contractorOptions = useRecoilValue(contractorOptionsState)
  const statusOptions = useRecoilValue(statusOptionsState)

  const handleChangeOption = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    type = 'contractorId'
  ) => {
    if (type == 'contractorId') {
      setRecoil(dataTableParamsState, (prevState) => {
        return {
          ...prevState,
          contractorId: value?.id ?? '',
        }
      })
    } else if (type == 'projectId') {
      setRecoil(dataTableParamsState, (prevState) => {
        return {
          ...prevState,
          projectId: value?.id ?? '',
        }
      })
    } else if (type == 'status') {
      setRecoil(dataTableParamsState, (prevState) => {
        return {
          ...prevState,
          status: value?.id ?? '',
        }
      })
    }
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

      <FormControl sx={{ width: 200 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={projectOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'projectId')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('contractSelectProjectFilter')} />
          )}
        />
      </FormControl>
      <FormControl sx={{ width: 220 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={statusOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'status')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('contractSelectStatusFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}
