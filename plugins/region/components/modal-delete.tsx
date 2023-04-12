import { ButtonBase, ButtonDelete, MainModal } from '@/components'
import IconWarning from '@/components/icon/warning'
import { openModalDeleteState } from '@/store/common'
import { t } from '@/utils'
import { Box, Stack, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deleteRegionApi } from '../api'
import { regionActiveState } from '../store'

export const ModalDelete = () => {
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const regionActive = useRecoilValue(regionActiveState)

  const handleDeleteRegion = () => {
    deleteRegionApi(regionActive && regionActive?.id ? regionActive?.id : 0)
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
            {t('regionMessageDeleteDescription')} <strong>"{regionActive?.title}"?</strong>
          </Typography>

          <Stack direction={'row'} spacing={2} justifyContent="center" pt={4}>
            <ButtonBase
              btnText={t('regionBtnCancel')}
              handleClick={() => {
                setOpenModalDelete(!openModalDelete)
              }}
            />
            <ButtonDelete btnText={t('regionBtnDelete')} handleClick={handleDeleteRegion} />
          </Stack>
        </Box>
      </MainModal>
    </>
  )
}
