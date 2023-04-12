import { formatDate, t } from '@/utils'
import { AccessTime, ExpandLess, ExpandMore, WorkHistory } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { BasicCard } from '../card'
import { brand } from '../colors/brand'

type LogType = {
  name: string
  created_at: string
  title: string
}
type IProps = {
  logsList: LogType[] | any
}

export const LogActivity = (props: IProps) => {
  const { logsList = [] } = props

  const [slice, setSlice] = useState(2)

  const [isShow, setIsShow] = useState(false)

  // Handle explained
  const handleExplained = () => {
    if (!isShow) {
      setSlice(logsList?.length)
    } else {
      setSlice(2)
    }
    setIsShow(!isShow)
  }

  return (
    <Stack>
      <BasicCard
        title={
          <Stack direction={'row'} alignItems="center" spacing={0.5}>
            <Typography className="input-label">{t('logsLabel')} </Typography>
            {logsList && logsList?.length > 2 && (
              <Button
                size="small"
                sx={{ height: '24px !important' }}
                onClick={handleExplained}
                endIcon={isShow ? <ExpandLess /> : <ExpandMore />}
              >
                {isShow ? t('btnShowLess') : t('btnShowAll')}
              </Button>
            )}
          </Stack>
        }
      >
        {logsList?.length > 0 ? (
          <Stack spacing={1.5}>
            {logsList.slice(0, slice).map((item: LogType, index: number) => (
              <Stack key={index} direction={'row'} alignItems="center" spacing={1}>
                <Box
                  width={'28px'}
                  height="28px"
                  borderRadius={'50%'}
                  flexShrink={0}
                  bgcolor={brand.gray300}
                  display="flex"
                  justifyContent={'center'}
                  alignItems="center"
                >
                  <WorkHistory fontSize="small" sx={{ color: brand.gray600 }} />
                </Box>
                <Stack
                  key={index}
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent={'space-between'}
                  width="100%"
                >
                  <Typography fontWeight={500} fontSize="13px">
                    {item.name} <span style={{ color: brand.gray600 }}>{item.title}</span>
                  </Typography>
                  <Stack direction={'row'} alignItems="center" spacing={0.5}>
                    <AccessTime fontSize="small" sx={{ color: brand.gray500 }} />
                    <Typography fontSize={'13px'} fontWeight={500} color={brand.gray500}>
                      {formatDate(item.created_at)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography color={brand.gray500} fontSize="14px" textAlign={'center'}>
            {t('notLogs')}
          </Typography>
        )}
      </BasicCard>
    </Stack>
  )
}
