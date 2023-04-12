import { getRegionData } from '@/plugins/region/api'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { SyntheticEvent, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { getRegionListOptionState } from '../store'

export const Filter = () => {
  const regionOptions = useRecoilValue(getRegionListOptionState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        regionId: value?.id ?? '',
      }
    })
  }

  useEffect(() => {
    getRegionData()
  }, [])

  return (
    <Box flexShrink={0} width="100%" maxWidth={200} display={{ xs: 'none', md: 'flex' }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          id="investorRegionFilter"
          options={regionOptions}
          onChange={handleChangeOption}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('investorRegionFilter')} />
          )}
        />
      </FormControl>
    </Box>
  )
}
