import { getAllProvinceOptionsApi } from '@/meta/common'
import { provinceOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { SyntheticEvent, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const provinceOptions = useRecoilValue(provinceOptionsState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        provinceId: value?.id ?? '',
      }
    })
  }

  // Watch province api
  useEffect(() => {
    getAllProvinceOptionsApi()
  }, [])

  return (
    <Box flexShrink={0} width="100%" maxWidth={220} display={{ xs: 'none', md: 'flex' }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          id="provinceId"
          options={provinceOptions}
          onChange={handleChangeOption}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('districtRegionFilter')} />
          )}
        />
      </FormControl>
    </Box>
  )
}
