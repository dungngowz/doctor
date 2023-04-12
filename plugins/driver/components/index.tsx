import { BasicCard, ItemRow } from '@/components'
import { logoutApi } from '@/plugins/auth/api'
import { userState } from '@/store/user'
import { t } from '@/utils'
import { Logout } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'

export const DriverContainer = () => {
  const user = useRecoilValue<any>(userState)

  return (
    <Stack spacing={2} py="20px">
      <Stack direction={'row'} alignItems="center">
        <Typography textAlign={'center'} fontSize="20px" flex={1} fontWeight={600}>
          {t('driverInfoLabel')}
        </Typography>
        <IconButton onClick={logoutApi}>
          <Logout />
        </IconButton>
      </Stack>
      <BasicCard>
        <Stack direction={'row'}>
          <ItemRow title={t('driverNameLabel')} description={user?.name} />
          <ItemRow title={t('driverPhoneLabel')} description={user?.phone} />
        </Stack>
        <Stack direction={'row'}>
          <ItemRow title={t('driverVehicleCodeLabel')} description={user?.vehicle.code} />
          <ItemRow
            title={t('driverVehicleWeightLabel')}
            description={user?.vehicle?.weightFormatted}
          />
        </Stack>
      </BasicCard>

      <Stack>
        <Typography className="input-label">Mã QR</Typography>
        <Box borderRadius={2} overflow="hidden">
          <Image
            src={user?.vehicle?.qrcode || '/images/no-picture.png'}
            layout="responsive"
            width={'100%'}
            height={'100%'}
          />
        </Box>
      </Stack>
    </Stack>
  )
}
