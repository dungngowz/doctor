import { DateRangePickerBase } from '@/components/form-control/date-range-picker-base'
import { dataTableParamsState } from '@/store/param-data'
import { Stack } from '@mui/material'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
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

  return (
    <Stack direction={'row'} display={{ xs: 'none', md: 'flex' }}>
      <DateRangePickerBase onHandleSubmit={handleSubmitDateFilter} handleClear={handleClearDate} />
    </Stack>
  )
}
