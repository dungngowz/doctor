import { ButtonBase, ButtonSubmit, MainModal, ModalAction } from '@/components'
import { t } from '@/utils'
import { Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type IProps = {
  open: boolean
  handleClose: () => void
  onHandleSubmit: any
  formData: any
}

export default function ModalRejectFeedback(props: IProps) {
  const { open = false, handleClose, onHandleSubmit, formData } = props
  const [customerFeedbackNote, setCustomerFeedbackNote] = useState('')

  const handleChangeValue = (e: any) => {
    setCustomerFeedbackNote(e.target.value)
  }

  const handleSubmit = () => {
    const data = {
      ...formData,
      customerFeedback: -1,
      customerFeedbackNote: customerFeedbackNote,
    }
    onHandleSubmit(data)
  }

  return (
    <MainModal open={open}>
      <Stack pb={8}>
        <Typography className="input-label">{t('quoteCustomerFeedbackNoRejectLabel')}</Typography>
        <TextField
          value={customerFeedbackNote}
          multiline
          rows={2}
          placeholder={t('quoteCustomerFeedbackNoRejectPlaceholder')}
          onChange={handleChangeValue}
        />
      </Stack>
      <ModalAction>
        <ButtonBase btnText={t('quoteBtnClose')} size="small" handleClick={handleClose} />
        <ButtonSubmit btnText={t('quoteBtnConfirm')} size="small" handleClick={handleSubmit} />
      </ModalAction>
    </MainModal>
  )
}
