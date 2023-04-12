import { ButtonBase, ButtonSubmit, InputField, MainModal, ModalAction } from '@/components'
import { openModalDetailState } from '@/store/common'
import { formatDate, t } from '@/utils'
import { codeFieldValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateBaseApi, submitUpdateBaseApi } from '../api'
import { baseActiveState } from '../store'

type ValuesType = {
  title: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [baseActive, setBaseActive] = useRecoilState(baseActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    title: baseActive?.title ?? '',
    createdAt: formatDate(baseActive?.createdAt as string) ?? '',
    updatedAt: formatDate(baseActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { watch, getValues } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setBaseActive(null)
    setRecoil(baseActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (baseActive && baseActive?.id > 0) {
      const baseActiveId = baseActive && baseActive?.id > 0 ? baseActive?.id : 0
      submitUpdateBaseApi(data, baseActiveId, handleClose)
    } else {
      submitCreateBaseApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="md"
      title={baseActive && baseActive?.id > 0 ? t('baseModalUpdate') : t('baseModalCreate')}
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          <InputField
            name="code"
            required
            label={t('baseCodeFieldLabel')}
            placeholder={t('baseCodePlaceholder')}
            validation={codeFieldValidation()}
          />

          {baseActive && baseActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('baseBtnClose')} handleClick={handleClose} />
          <ButtonSubmit
            btnText={
              baseActive && baseActive?.id > 0 ? t('baseBtnSubmitUpdate') : t('baseBtnSubmit')
            }
            type="submit"
          />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
