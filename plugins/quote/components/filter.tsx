import { brand } from '@/components/colors/brand'
import { contractorOptionsState, projectOptionsState } from '@/store/meta'
import { dataTableParamsState } from '@/store/param-data'
import { t } from '@/utils'
import { Autocomplete, FormControl, Stack, TextField, Typography } from '@mui/material'
import { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const Filter = () => {
  const projectOptions = useRecoilValue(projectOptionsState)
  const contractorOptions = useRecoilValue(contractorOptionsState)

  const handleChangeOption = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    type = 'contractorId'
  ) => {
    setRecoil(dataTableParamsState, (prevState) => {
      return {
        ...prevState,
        [type]: value?.id ?? '',
      }
    })
  }

  const statusOptions = [
    {
      groupBy: 'Phê duyệt (Phòng KD)',
      label: ' Đã duyệt',
      id: 1,
    },
    {
      groupBy: 'Phê duyệt (Phòng KD)',
      label: 'Đang chờ duyệt',
      id: 0,
    },
    {
      groupBy: 'Phê duyệt (Phòng KD)',
      label: 'Không duyệt',
      id: -1,
    },
    {
      groupBy: 'Phản hồi khách hàng',
      label: 'Báo giá thành công',
      id: 2,
    },
    {
      groupBy: 'Phản hồi khách hàng',
      label: 'Báo giá thất bại',
      id: 3,
    },
  ]

  return (
    <Stack spacing={2} direction={'row'} display={{ xs: 'none', lg: 'flex' }}>
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
      <FormControl sx={{ width: 200 }}>
        <Autocomplete
          id="status-group"
          options={statusOptions}
          groupBy={(option) => option.groupBy}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          onChange={(e, value) => handleChangeOption(e, value, 'status')}
          renderInput={(params) => (
            <TextField {...params} placeholder={t('quoteSelectStatusFilter')} />
          )}
          renderGroup={(params) => {
            return (
              <Stack key={params.key}>
                <Typography
                  px={1}
                  fontSize={'12px'}
                  py={0.5}
                  color={brand.gray600}
                  fontStyle={'italic'}
                >
                  {params.group}
                </Typography>
                <div>{params.children}</div>
              </Stack>
            )
          }}
        />
      </FormControl>
    </Stack>
  )
}
