import { ButtonBase, ButtonDelete, MainModal } from '@/components'
import IconWarning from '@/components/icon/warning'
import { openModalDeleteState } from '@/store/common'
import { padNumber, t } from '@/utils'
import { Box, Stack, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deleteSchedulesApi } from '../api'
import { schedulesActiveState } from '../store'

export const ModalDelete = () => {
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const scheduleActive = useRecoilValue(schedulesActiveState)

  const handleDeleteRegion = () => {
    deleteSchedulesApi(scheduleActive && scheduleActive?.id ? scheduleActive?.id : 0)
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
            {t('schedulesMessageDeleteDescription')}{' '}
            <strong>"#{padNumber(scheduleActive?.id)}"</strong>
          </Typography>

          <Stack direction={'row'} spacing={2} justifyContent="center" pt={2}>
            <ButtonBase
              btnText={t('schedulesBtnClose')}
              handleClick={() => {
                setOpenModalDelete(!openModalDelete)
              }}
            />
            <ButtonDelete btnText={t('schedulesBtnDelete')} handleClick={handleDeleteRegion} />
          </Stack>
        </Box>
      </MainModal>
    </>
  )
}
