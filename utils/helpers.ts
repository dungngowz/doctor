import { ReportInputType } from '@/plugins/report-input/type'
import { dataTableParamsState } from '@/store/param-data'
import { permissionsRuleState } from '@/store/user'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { getCookie } from 'cookies-next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import numeral from 'numeral'
import { getRecoil } from 'recoil-nexus'
import i18n from './i18next'
/**
 * It takes a number and returns a string with the number padded with zeros
 * @param {number | undefined} number - The number to pad.
 * @param [numZero=4] - The number of zeros to pad the number with.
 * @returns A function that takes a number and a number of zeros and returns a string.
 */
export const padNumber = (number: number | undefined, numZero = 4) => {
  return number ? number.toString().padStart(numZero, '0') : ''
}

export const formatPrice = (price: number) => {
  return numeral(price).format('0,0')
}

export const totalPriceQuote = (item: []) => {
  const totalPrice = item.reduce((total, item: any) => {
    return total + item?.qty * item?.price
  }, 0)

  return formatPrice(totalPrice)
}

export const totalQty = (item: Array<any>) => {
  const totalItem = item?.reduce((total, item) => {
    return total + item?.qty
  }, 0)
  return numeral(totalItem).format('0,0')
}

export const formatQty = (qty: number) => {
  return numeral(qty).format('0,0')
}

export const calcIndexDataTable = (index: number) => {
  const params = getRecoil(dataTableParamsState)

  return (params.page - 1) * params.rowsPerPage + index + 1
}

/**
 * If the string is less than the max length, return the string, otherwise return the string up to the
 * last space before the max length, plus the suffix
 * @param {string} str - The string to truncate.
 * @param {number} max - The maximum length of the string.
 * @param [suffix=...] - The string to append to the end of the truncated string.
 */
export const truncateWord = (str: string, max: number, suffix = '...') =>
  str.length < max
    ? str
    : `${str.substring(0, str.substring(0, max - suffix.length).lastIndexOf(' '))}${suffix}`

/**
 * If the user is on the server, get the role from the cookie, otherwise get it from the session
 * storage
 * @returns The role of the user.
 */
export const getRole = () => {
  let role = getCookie('role')
  if (!(typeof window === 'undefined')) {
    if (!role) {
      role = sessionStorage.getItem('role')
    }
  }
  return role
}

/**
 * It returns the translation of the given key, or an empty string if the translation is not found
 * @param {string} key - The key of the translation you want to use.
 * @returns The translation of the key.
 */
export const t = (key: string) => {
  return i18n.t(key) ?? ''
}

/**
 * It takes a string as an argument and returns the string if it's truthy, otherwise it returns a
 * default error message
 * @param {any} str - any - the error message to be displayed
 * @returns A function that takes a string and returns a string.
 */
export const getErrorMessage = (str: any) => {
  if (str) return str
  return t('errorDefault')
}

/**
 * It takes a number and returns a formatted number
 * @param {number} number - The number to format
 * @returns A function that takes a number and returns a formatted number.
 */
export function fNumber(number: number) {
  return numeral(number).format()
}

/**
 * It takes a date string and a format string as parameters, and returns a formatted date string
 * @param {string} date - The date you want to format.
 * @param [format=DD/MM/YYYY HH:mm:ss] - The format of the date.
 * @returns A function that takes two parameters, date and format.
 */
export const formatDate = (date: string, format = 'DD/MM/YYYY HH:mm:ss') => {
  return dayjs(date).locale('vi').format(format)
}

// Format week day
class CustomString extends String {
  charAt(_: number): string {
    return this.valueOf()
  }
}

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const customWeekDays = weekDays.map((day) => new CustomString(day) as string)

export class CustomDateAdapter extends AdapterDateFns {
  getWeekdays = (): string[] => customWeekDays
}

// Product input/ export total price
export const totalPriceReportProduct = (product: ReportInputType | any) => {
  const totalPrice = Math.abs(+product.secondaryWeight - +product.firstWeight) * +product.price
  return formatPrice(totalPrice)
}

// Handler permission Update
export const isPermissionUpdate = (permission: string) => {
  const permissionsRule = getRecoil(permissionsRuleState)

  return permissionsRule.includes(permission)
}

// Handler permission Delete
export const isPermissionDelete = (permission: string) => {
  const permissionsRule = getRecoil(permissionsRuleState)

  return permissionsRule.includes(permission)
}

// Handler permission Create
export const isPermissionCreate = (permission: string) => {
  const permissionsRule = getRecoil(permissionsRuleState)

  return permissionsRule.includes(permission)
}

// Handler permission View
export const isPermissionView = (permission: string) => {
  const permissionsRule = getRecoil(permissionsRuleState)

  return permissionsRule.includes(permission)
}
