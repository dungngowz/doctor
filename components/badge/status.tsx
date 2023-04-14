import { t } from '@/utils'
import { CheckCircle, Info } from '@mui/icons-material'
import { Chip } from '@mui/material'

type IProps = {
  status: number
}

export const StatusProgress = (props: IProps) => {
  const { status } = props

  return (
    <>
      {status == -1 && (
        <Chip
          className="badge-error"
          avatar={<Info />}
          label={t('quoteCanApprovedNotAcceptFieldLabel')}
          size="small"
          color="error"
        />
      )}

      {status == 0 && (
        <Chip
          className="badge-warning"
          avatar={<Info />}
          label={t('quoteCanApprovedWaitingFieldLabel')}
          size="small"
          color="warning"
        />
      )}

      {status == 1 && (
        <Chip
          className="badge-success"
          avatar={<CheckCircle />}
          label={t('quoteCanApprovedAcceptedFieldLabel')}
          size="small"
          color="success"
        />
      )}
    </>
  )
}
