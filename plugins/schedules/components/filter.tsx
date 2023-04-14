import { DateRangePickerBase } from '@/components/form-control/date-range-picker-base'
import { productOptionsState, suppliersOptionsState } from '@/store/meta'
import { OptionsType } from '@/types'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { dataTableSchedulesParamsState } from '../store'

export const Filter = () => {
  // Options
  const supplierOptions = useRecoilValue(suppliersOptionsState)
  const productOptions = useRecoilValue(productOptionsState)

  const handleChangeOption = (
    event: SyntheticEvent<Element, Event>,
    value: OptionsType | null,
    type: string
  ) => {
    if (type == 'supplierId') {
      if (!value) {
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
          return {
            ...prevState,
            isFilter: false,
            supplierId: '',
          }
        })
      } else {
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
          return {
            ...prevState,
            supplierId: value?.id,
            isFilter: true,
          }
        })
      }
    } else if (type == 'productId') {
      if (!value) {
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
          return {
            ...prevState,
            isFilter: false,
            productId: '',
          }
        })
      } else {
        setRecoil(dataTableSchedulesParamsState, (prevState) => {
          return {
            ...prevState,
            productId: value?.id,
            isFilter: true,
          }
        })
      }
    }
  }

  // Handle submit date
  const handleSubmitDateFilter = (dateRange: any) => {
    setRecoil(dataTableSchedulesParamsState, (prevState) => {
      return {
        ...prevState,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }
    })
  }

  // Handle clear
  const handleClearDate = () => {
    setRecoil(dataTableSchedulesParamsState, (prevState) => {
      return {
        ...prevState,
        startDate: '',
        endDate: '',
      }
    })
  }

  return (
    <Stack direction={'row'} spacing={2}>
      <DateRangePickerBase onHandleSubmit={handleSubmitDateFilter} handleClear={handleClearDate} />

      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={supplierOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'supplierId')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('schedulesSupplierIdFilter')} />
          )}
        />
      </FormControl>
      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={productOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'productId')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('schedulesProductIdFilter')} />
          )}
        />
      </FormControl>
    </Stack>
  )
}
