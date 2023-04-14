import { getAllContractorOptionsApi, getAllProjectOptionsApi } from '@/meta/common'
import { contractorOptionsState, projectOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  // Recoil
  const projectOptions = useRecoilValue(projectOptionsState)
  const contractorOptions = useRecoilValue(contractorOptionsState)

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
    } else if (type == 'statusAccountant') {
      setRecoil(dataTableParamsState, (prevState) => {
        return {
          ...prevState,
          statusAccountant: value?.id ?? '',
        }
      })
    }
  }

  useEffect(() => {
    getAllContractorOptionsApi()
    getAllProjectOptionsApi()
  }, [])

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
            <TextField {...params} placeholder={t('quoteSelectContractFilter')} />
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
            <TextField {...params} placeholder={t('quoteSelectProjectFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}

// interface CountryType {
//   code: string
//   label: string
//   phone: string
//   group: string
// }

{
  /* <Autocomplete
          options={data}
          getOptionLabel={(option) => option?.label}
          groupBy={(option) => option.group ?? undefined}
          onChange={(event, value) => handleChangeStatus(event, value)}
          renderInput={(props) => (
            <TextField {...props} placeholder={t('quoteSelectStatusFilter')} fullWidth />
          )}
        
        /> */
}
