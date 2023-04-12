import { productCategoryOptionsState, productTypeOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { ProductCategoryOptionsType } from '../type'

export const Filter = () => {
  const productCategoryOptions = useRecoilValue<ProductCategoryOptionsType[]>(
    productCategoryOptionsState
  )
  const productTypeOptions = useRecoilValue(productTypeOptionsState)

  const handleChangeOption = (event: SyntheticEvent<Element, Event>, value: any, type?: any) => {
    if (type == 'category') {
      setRecoil(dataTableParamsState, (prevState) => {
        return {
          ...prevState,
          productCategoryId: value?.id ?? '',
        }
      })
    } else {
      setRecoil(dataTableParamsState, (prevState) => {
        return {
          ...prevState,
          type: value?.id ?? '',
        }
      })
    }
  }

  return (
    <Stack direction={'row'} display={{ xs: 'none', md: 'flex' }} spacing={2}>
      <FormControl sx={{ width: 240 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={productCategoryOptions}
          onChange={(e, value) => handleChangeOption(e, value, 'category')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('productSelectCategoryField')} />
          )}
        />
      </FormControl>
      <FormControl sx={{ width: 240 }}>
        <Autocomplete
          disablePortal
          id="filter"
          options={productTypeOptions}
          onChange={(e, value) => handleChangeOption(e, value)}
          renderInput={(params) => <TextField {...params} placeholder={t('productTypeFilter')} />}
        />
      </FormControl>
    </Stack>
  )
}
