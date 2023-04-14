import { ButtonBase, ButtonDelete, MainModal } from '@/components'
import IconWarning from '@/components/icon/warning'
import { openModalDeleteState } from '@/store/common'
import { t } from '@/utils'
import { Box, Stack, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deleteInvestorTypeApi } from '../api'
import { investorTypeActiveState } from '../store'

export const ModalDelete = () => {
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const investorTypeActive = useRecoilValue(investorTypeActiveState)

  const handleDelete = () => {
    deleteInvestorTypeApi(investorTypeActive && investorTypeActive?.id ? investorTypeActive?.id : 0)
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
            {t('investorTypeMessageDeleteDescription')}{' '}
            <strong>"{investorTypeActive?.title}"</strong>
          </Typography>

          <Stack direction={'row'} spacing={2} justifyContent="center" pt={2}>
            <ButtonBase
              btnText={t('investorTypeBtnClose')}
              handleClick={() => {
                setOpenModalDelete(!openModalDelete)
              }}
            />
            <ButtonDelete btnText={t('investorTypeBtnDelete')} handleClick={handleDelete} />
          </Stack>
        </Box>
      </MainModal>
    </>
  )
}
