import { DateRangePickerBase } from '@/components/form-control/date-range-picker-base'
import { contractorOptionsState, investorOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const investorOptions = useRecoilValue(investorOptionsState)
  const contractorOptions = useRecoilValue(contractorOptionsState)

  // Hooks
  const router = useRouter()
  const investorIdQuery = router?.query?.investorId
  const contractorIdQuery = router?.query?.contractorId

  // Handle change investor option
  const handleChangeOption = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    isQuery: boolean
  ) => {
    const investorId = value ? value?.id : ''
    if (isQuery) {
      router.push({
        pathname: '/project',
        query: investorId ? 'investorId=' + investorId : '',
      })
    }

    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        investorId: value?.id ?? '',
      }
    })
  }

  // Handle change contractor
  const handleChangeContractorOption = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    isQuery: boolean
  ) => {
    const contractorId = value ? value?.id : ''

    if (isQuery) {
      router.push({
        pathname: '/project',
        query: contractorId ? 'contractorId=' + contractorId : '',
      })
    }

    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        contractorId: value?.id ?? '',
      }
    })
  }

  // Handle submit date
  const handleSubmitDateFilter = (dateRange: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }
    })
  }

  // Handle clear
  const handleClearDate = () => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        startDate: '',
        endDate: '',
      }
    })
  }

  // Default value
  const optionDefaultInvestor = investorOptions.find((option) => option.id == investorIdQuery)

  const optionDefaultContractor = contractorOptions.find((option) => option.id == contractorIdQuery)

  return (
    <Stack direction={'row'} spacing={2} display={{ xs: 'none', lg: 'flex' }}>
      {contractorIdQuery ? (
        <FormControl sx={{ width: 250 }}>
          <Autocomplete
            disablePortal
            id="filter"
            options={contractorOptions}
            defaultValue={optionDefaultContractor}
            onChange={(e, value) => handleChangeContractorOption(e, value, true)}
            renderInput={(params) => (
              <TextField {...params} placeholder={t('projectContractorSelectFilter')} />
            )}
          />
        </FormControl>
      ) : (
        <FormControl sx={{ width: 250 }}>
          <Autocomplete
            disablePortal
            id="filter"
            options={contractorOptions}
            onChange={(e, value) => handleChangeContractorOption(e, value, false)}
            renderInput={(params) => (
              <TextField {...params} placeholder={t('projectContractorSelectFilter')} />
            )}
          />
        </FormControl>
      )}

      {investorIdQuery ? (
        <FormControl sx={{ width: 250 }}>
          <Autocomplete
            disablePortal
            id="filter"
            options={investorOptions as any}
            defaultValue={optionDefaultInvestor}
            onChange={(e, value) => handleChangeOption(e, value, true)}
            renderInput={(params) => (
              <TextField {...params} placeholder={t('projectInvestorSelectFilter')} />
            )}
          />
        </FormControl>
      ) : (
        <FormControl sx={{ width: 250 }}>
          <Autocomplete
            disablePortal
            id="filter"
            options={investorOptions as any}
            onChange={(e, value) => handleChangeOption(e, value, false)}
            renderInput={(params) => (
              <TextField {...params} placeholder={t('projectInvestorSelectFilter')} />
            )}
          />
        </FormControl>
      )}
      <DateRangePickerBase onHandleSubmit={handleSubmitDateFilter} handleClear={handleClearDate} />
    </Stack>
  )
}
