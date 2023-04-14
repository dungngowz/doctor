import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { t } from './helpers'
dayjs.extend(isSameOrAfter)
/**
 * It returns an object with two properties, minLength and maxLength, which are both functions that
 * return a boolean
 * @param [minLength=6] - The minimum length of the password.
 * @param [maxLength=20] - The maximum length of the string.
 * @returns An object with two properties, minLength and maxLength.
 */
export const passwordValidation = (minLength = 6, maxLength = 20, isRequired = true) => {
  return {
    required: {
      value: isRequired,
      message: t('passwordRequiredRule'),
    },
    minLength: minLengthValidation(minLength, t('staffPasswordMinLengthValidation')),
    maxLength: maxLengthValidation(maxLength, t('staffPasswordMaxLengthValidation')),
  }
}

/**
 * It returns an object with a value and a message property
 * @param [minLength=6] - The minimum length of the string.
 * @returns An object with two properties: value and message.
 */
export const minLengthValidation = (minLength = 6, message?: string) => {
  return {
    value: minLength,
    message: message ?? '',
  }
}

/**
 * It takes a number as an argument and returns an object with a value and message property
 * @param [maxLength=20] - The maximum length of the input.
 * @returns An object with two properties, value and message.
 */
export const maxLengthValidation = (maxLength = 255, message?: string) => {
  return {
    value: maxLength ?? 0,
    message: message ?? '',
  }
}

/**
 * It returns an object that has a required property that has a value of true and a message property
 * that has a value of the text parameter
 * @param {string} text - The text to display when the field is required.
 * @returns An object with a required property that has a value of true and a message property that has
 * a value of the text parameter.
 */
export const fieldRequired = (text: string) => {
  return {
    required: {
      value: true,
      message: text ?? '',
    },
  }
}

// Name Validation
export const nameFieldValidation = (
  messageRequired = t('nameRequiredValidation'),
  messageMaxLength = t('nameMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// taxCode Validation
export const taxCodeFieldValidation = (
  messageRequired = t('taxCodeRequiredValidation'),
  messageMaxLength = t('taxCodeMaxLengthValidation'),
  maxLength = 20
) => {
  return {
    required: {
      value: true,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// durationQuoteFieldValidation
export const durationQuoteFieldValidation = (
  messageRequired = t('durationQuoteRequiredValidation'),
  messageMaxLength = t('durationQuoteMaxLengthValidation'),
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// weightFieldValidation
export const weightFieldValidation = (
  messageRequired = t('weightRequiredFieldValidation'),
  messageMaxLength = t('weightMaxLengthFieldValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
    pattern: {
      value: /[1-9]/g,
      message: t('weightMinValueFieldValidation'),
    },
  }
}

// Validation secondaryWeight
export const secondaryWeightValidation = (
  messageRequired = t('weightRequiredFieldValidation'),
  messageMaxLength = t('weightMaxLengthFieldValidation'),
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// durationQuoteFieldValidation
export const paymentMethodOtherFieldValidation = (
  messageRequired = t('paymentMethodOtherRequiredValidation'),
  messageMaxLength = t('paymentMethodOtherMaxLengthValidation'),
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Code validation
export const codeFieldValidation = (
  messageRequired = t('codeRequiredValidation'),
  messageMaxLength = t('codeMaxLengthValidation'),
  maxLength = 20
) => {
  return {
    required: {
      value: true,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
    // validate: (value: any) => {
    //   console.log(value)

    //   return 'aloooo'
    // },
  }
}

// Address validation
export const addressFieldValidation = (
  messageRequired = t('addressRequiredValidation'),
  messageMaxLength = t('addressMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// placeDelivery validation
export const placeDeliveryFieldValidation = (
  messageRequired = t('placeDeliveryRequiredValidation'),
  messageMaxLength = t('placeDeliveryMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// product validation
export const productFieldValidation = (
  messageRequired = t('productRequiredValidation'),
  messageMaxLength = t('productMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Address validation
export const consigneeNameFieldValidation = (
  messageRequired = t('consigneeNameRequiredValidation'),
  messageMaxLength = t('consigneeNameMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}
// shippingUnit validation
export const shippingUnitFieldValidation = (
  messageRequired = t('shippingUnitRequiredValidation'),
  messageMaxLength = t('shippingUnitMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Phone validation
export const phoneFieldValidation = (
  isRequired = true,
  messageRequired = t('phoneRequiredValidation'),
  messageMaxLength = t('phoneMaxLengthValidation'),
  maxLength = 15
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
    pattern: {
      value: /^(\+84|84|0[3|5|7|8|9])+([0-9]{8})$/,
      message: t('phoneInvalidRule'),
    },
  }
}

// Package
export const packageFieldValidation = (
  messageRequired: string,
  messageMaxLength?: string,
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// priceValidation
export const priceFieldValidation = (
  messageRequired = t('priceRequiredValidation'),
  messageMaxLength = t('priceMaxLengthValidation'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
    pattern: {
      value: /[1-9]/g,
      message: t('priceInvalidValidation'),
    },
  }
}

// qtyFieldValidation
export const qtyFieldValidation = (
  messageRequired = t('qtyRequiredValidation'),
  messageMaxLength = t('qtyMaxLengthValidation'),
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
    pattern: {
      value: /[1-9]/g,
      message: t('qtyInvalidValidation'),
    },
    max: {
      value: 1000000,
      message: t('qtyMaxValueValidation'),
    },
  }
}

// firstWeightFieldValidation
export const firstWeightFieldValidation = (
  messageRequired = t('firstWeightRequiredValidation'),
  messageMaxLength = t('firstWeightMaxLengthValidation'),
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
    pattern: {
      value: /[1-9]/g,
      message: t('firstWeightInvalidValidation'),
    },
    max: {
      value: 1000000,
      message: t('firstWeightMaxValueValidation'),
    },
  }
}

// secondary Weight
export const secondaryWeightFieldValidation = (pattern = true) => {
  return {
    // validate: (value: any) => {
    //   if (value > firstWeight) {
    //     return 'Khối lượng cân lần 2 phải nhỏ hơn khối lượng cân lần 1'
    //   }
    //   return ''
    // },

    required: {
      value: true,
      message: t('secondaryWeightRequiredValidation') ?? '',
    },

    pattern: {
      value: pattern ? /[1-9]/g : '',
      message: t('secondaryWeightInvalidValidation'),
    },
    max: {
      value: 1000000,
      message: t('secondaryWeightMaxValueValidation'),
    },
  }
}

// Package
export const estimatedVolumeValidation = (
  messageRequired: string,
  messageMaxLength?: string,
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// dateFieldValidation
export const dateFieldValidation = (
  messageRequired = t('dateFieldRequiredValidation') as string,
  messageMaxLength?: string,
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },

    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Validation StartDate
export const startDateValidation = (
  messageRequired = t('startDateRequiredValidation') as string
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    validate: (date: any) => {
      const currentDate = dayjs().add(-1, 'day')
      const dateValue = dayjs(date)
      if (currentDate.isSameOrAfter(dateValue)) {
        return t('startDateMinDateValidation')
      }
      return ''
    },
  }
}

// Validation end date
export const endDateValidation = (
  startDate?: any,
  messageRequired = t('endDateRequiredValidation') as string
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    validate: (date: any) => {
      const currentDate = dayjs(startDate).add(-1, 'day')
      const dateValue = dayjs(date)

      if (currentDate.isSameOrAfter(dateValue)) {
        return t('endDateGreaterStartDateValidation')
      }
      return ''
    },
  }
}

// firstTime Field Validation
export const firstTimeExportFieldValidation = (
  messageRequired = t('firstTimeExportFieldRequiredValidation') as string,
  messageMaxLength?: string,
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// firstTime Field Validation
export const secondaryTimeExportFieldValidation = (
  messageRequired = t('secondaryTimeExportFieldRequiredValidation') as string,
  messageMaxLength?: string,
  maxLength = 255
) => {
  return {
    required: {
      value: true,
      message: messageRequired ?? '',
    },
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Standard
export const standardValidation = (messageMaxLength?: string, maxLength = 255) => {
  return {
    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Email
export const emailValidation = (
  messageRequired = t('emailRequiredRule'),
  messageMaxLength = t('emailMaxLengthRule'),
  maxLength = 255,
  isRequired = true
) => {
  return {
    required: {
      value: isRequired,
      message: messageRequired,
    },

    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: t('emailInvalidRule'),
    },

    maxLength: maxLengthValidation(maxLength, messageMaxLength),
  }
}

// Validation discountFieldValidation
export const discountFieldValidation = (totalPrice: number) => {
  return {
    validate: (discountValue: number) => {
      // console.log(discountValue, totalPrice)

      return 'alooo'
    },
  }
}
