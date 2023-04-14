import IconSearch from '@/components/icon/search'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Box, InputBase } from '@mui/material'
import _ from 'lodash'
import { ChangeEvent } from 'react'
import { setRecoil } from 'recoil-nexus'

export const SearchField = () => {
  const handleSearch = _.debounce((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const valueSearch = e?.target?.value

    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        keyword: valueSearch,
        page: 1,
      }
    })
  }, 500)
  return (
    <Box
      className="search-field"
      width={'100%'}
      maxWidth={{ xs: 'auto', sm: 250 }}
      mr={{ xs: 2, sm: 0 }}
      flexShrink={{ xs: 1, md: 0 }}
    >
      <IconSearch />
      <InputBase onChange={handleSearch} placeholder={t('provinceSearchFieldPlaceholder')} />
    </Box>
  )
}
