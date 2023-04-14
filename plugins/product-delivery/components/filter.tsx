import { DateRangePickerBase } from '@/components/form-control/date-range-picker-base'
import { getAllProductCategoryApi, getAllVehiclesOptionsApi } from '@/meta/common'
import { productCategoryOptionsState, vehiclesOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const productCategoryOptions = useRecoilValue(productCategoryOptionsState)
  const vehicleOptions = useRecoilValue(vehiclesOptionsState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any, type: string) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        [type]: value?.id ?? '',
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

  useEffect(() => {
    getAllVehiclesOptionsApi()
    getAllProductCategoryApi()
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
          options={vehicleOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'vehicleId')}
          renderInput={(params) => <TextField {...params} placeholder={t('vehicleFilter')} />}
        />
      </FormControl>

      <FormControl sx={{ width: 200 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={productCategoryOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'productId')}
          renderInput={(params) => <TextField {...params} placeholder={t('productTypeFilter')} />}
        />
      </FormControl>
      <DateRangePickerBase onHandleSubmit={handleSubmitDateFilter} handleClear={handleClearDate} />
    </Stack>
  )
}
