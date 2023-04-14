import dayjs from 'dayjs'
import * as yup from 'yup'
import { t } from './helpers'

const maxLengthCurrent = 255

// Validation Start Date
export const startDateYupValidation = yup
  .date()
  .nullable()
  .required(t('startDateRequiredValidation'))
  .min(dayjs().add(-1, 'day'), t('startDateMinDateValidation'))
  .typeError(t('startDateRequiredValidation'))

// Validation End Date
export const endDateYupValidation = yup
  .date()
  .nullable()
  .required(t('endDateRequiredValidation'))
  .typeError(t('endDateRequiredValidation'))
  .when('startTime', (startTime: any, schema) => {
    const start = startTime.toString()
    return start == 'Invalid Date'
      ? undefined
      : startTime &&
          schema
            .min(startTime, t('endDateGreaterStartDateValidation'))
            .typeError(t('endDateGreaterStartDateValidation'))
  })

// Project code
export const projectCodeYupValidation = yup
  .string()
  .required(t('projectCodeRequiredValidation'))
  .max(maxLengthCurrent, t('projectCodeMaxLengthValidation'))
