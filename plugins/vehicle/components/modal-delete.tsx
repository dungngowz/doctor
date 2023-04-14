import { ButtonBase, ButtonDelete, MainModal } from '@/components'
import IconWarning from '@/components/icon/warning'
import { openModalDeleteState } from '@/store/common'
import { t } from '@/utils'
import { Box, Stack, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deleteVehicleApi } from '../api'
import { vehicleActiveState } from '../store'

export const ModalDelete = () => {
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const vehicleActive = useRecoilValue(vehicleActiveState)

  const handleDelete = () => {
    deleteVehicleApi(vehicleActive && vehicleActive?.id ? vehicleActive?.id : 0)
    setOpenModalDelete(false)
  }

  return (
    <>
      <MainModal
        open={openModalDelete}
        onClose={() => {
          setOpenModalDelete(!openModalDelete)
        }}
      >
        <Box textAlign={'center'}>
          <IconWarning height={60} width={60} color={yellow[600]} />

          <Typography>
            {t('vehicleMessageDeleteDescription')} <strong>"{vehicleActive?.code}"</strong>
          </Typography>

          <Stack direction={'row'} spacing={2} justifyContent="center" pt={4}>
            <ButtonBase
              btnText={t('vehicleBtnClose')}
              handleClick={() => {
                setOpenModalDelete(!openModalDelete)
              }}
            />
            <ButtonDelete btnText={t('vehicleBtnDelete')} handleClick={handleDelete} />
          </Stack>
        </Box>
      </MainModal>
    </>
  )
}
