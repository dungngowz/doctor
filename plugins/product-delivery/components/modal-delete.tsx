import { ButtonBase, ButtonDelete, MainModal } from '@/components'
import IconWarning from '@/components/icon/warning'
import { openModalDeleteState } from '@/store/common'
import { padNumber, t } from '@/utils'
import { Box, Stack, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deleteProductDeliveryApi } from '../api'
import { productDeliveryActiveState } from '../store'

export const ModalDelete = () => {
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const productDeliveryActive = useRecoilValue(productDeliveryActiveState)

  const handleDeleteProductDelivery = () => {
    deleteProductDeliveryApi(
      productDeliveryActive && productDeliveryActive?.id ? productDeliveryActive?.id : 0
    )
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
            {t('productDeliveryMessageDeleteDescription')}{' '}
            <strong>"#{padNumber(productDeliveryActive?.id)}"</strong>
          </Typography>

          <Stack direction={'row'} spacing={2} justifyContent="center" pt={2}>
            <ButtonBase
              btnText={t('productDeliveryBtnClose')}
              handleClick={() => {
                setOpenModalDelete(!openModalDelete)
              }}
            />
            <ButtonDelete
              btnText={t('productDeliveryBtnDelete')}
              handleClick={handleDeleteProductDelivery}
            />
          </Stack>
        </Box>
      </MainModal>
    </>
  )
}
