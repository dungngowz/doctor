import commonJson from '@/config/common.json'
import contractJson from '@/config/contract.json'
import contractorJson from '@/config/contractor.json'
import customerTypesJson from '@/config/customer-types.json'
import dashboardJson from '@/config/dashboard.json'
import debtJson from '@/config/debt.json'
import departmentJson from '@/config/departments.json'
import districtJson from '@/config/district.json'
import driverJson from '@/config/driver.json'
import formCommonJson from '@/config/form-common.json'
import investorTypeJson from '@/config/investor-type.json'
import investorJson from '@/config/investor.json'
import loginJson from '@/config/login.json'
import menuJson from '@/config/menu.json'
import orderJson from '@/config/order.json'
import productDeliveriesJson from '@/config/product-deliveries.json'
import productDeliveringJson from '@/config/product-delivering.json'
import productInputJson from '@/config/product-input.json'
import productJson from '@/config/product.json'
import projectJson from '@/config/project.json'
import provinceJson from '@/config/province.json'
import quoteJson from '@/config/quote.json'
import regionJson from '@/config/region.json'
import reportExportJson from '@/config/report-export.json'
import reportInputJson from '@/config/report-input.json'
import saleFormJson from '@/config/sale-form.json'
import schedulesJson from '@/config/schedules.json'
import shippingUnitJson from '@/config/shipping-unit.json'
import staffJson from '@/config/staff.json'
import stationJson from '@/config/station.json'
import supplierJson from '@/config/supplier.json'
import userJson from '@/config/user.json'
import validationJson from '@/config/validation.json'
import vehicleJson from '@/config/vehicle.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// The translations (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      ...loginJson,
      ...departmentJson,
      ...shippingUnitJson,
      ...investorTypeJson,
      ...customerTypesJson,
      ...dashboardJson,
      ...formCommonJson,
      ...validationJson,
      ...menuJson,
      ...regionJson,
      ...provinceJson,
      ...districtJson,
      ...productJson,
      ...investorJson,
      ...contractorJson,
      ...staffJson,
      ...projectJson,
      ...commonJson,
      ...quoteJson,
      ...contractJson,
      ...orderJson,
      ...userJson,
      ...schedulesJson,
      ...supplierJson,
      ...driverJson,
      ...vehicleJson,
      ...stationJson,
      ...debtJson,
      ...productInputJson,
      ...reportExportJson,
      ...reportInputJson,
      ...productDeliveriesJson,
      ...productDeliveringJson,
      ...saleFormJson,
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
