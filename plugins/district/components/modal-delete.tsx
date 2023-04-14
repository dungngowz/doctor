import { ButtonBase, ButtonDelete, MainModal } from '@/components'
import IconWarning from '@/components/icon/warning'
import { openModalDeleteState } from '@/store/common'
import { t } from '@/utils'
import { Box, Stack, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deleteDistrictApi } from '../api'
import { districtActiveState } from '../store'
// import { deleteRegionApi } from '../api'
// import { provinceActiveState } from '../store'

export const ModalDelete = () => {
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const districtActive = useRecoilValue(districtActiveState)

  const handleDeleteDistrict = () => {
    deleteDistrictApi(districtActive && districtActive?.id ? districtActive?.id : 0)
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
            {t('districtMessageDeleteDescription')} <strong>"{districtActive?.title}" ?</strong>
          </Typography>

          <Stack direction={'row'} spacing={2} justifyContent="center" pt={4}>
            <ButtonBase
              btnText={t('districtBtnClose')}
              handleClick={() => {
                setOpenModalDelete(!openModalDelete)
              }}
            />
            <ButtonDelete btnText={t('districtBtnDelete')} handleClick={handleDeleteDistrict} />
          </Stack>
        </Box>
      </MainModal>
    </>
  )
}
