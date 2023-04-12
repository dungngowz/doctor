import endpoint from '@/config/endpoint.json'
import {
  constructionProgressesOptionsState,
  contractorOptionsState,
  customerTypeOptionsState,
  departmentOptionsState,
  districtOptionsState,
  investorOptionsState,
  investorTypeOptionsState,
  paymentMethodOptionsState,
  productCategoryOptionsState,
  productOptionsState,
  projectOptionsState,
  provinceOptionsState,
  saleFormOptionsState,
  shippingUnitOptionsState,
  staffOptionsState,
  stationOptionsState,
  suppliersOptionsState,
  vehiclesOptionsState,
} from '@/store/meta'
import { IApiResponse } from '@/types'
import { axiosClient } from '@/utils'
import { setRecoil } from 'recoil-nexus'

export const getAllInvestorTypeApi = async () => {
  return await axiosClient
    .get(endpoint.investorTypes + '?page=1&rowsPerPage=100')
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.investorTypes?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })

        setRecoil(investorTypeOptionsState, options)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllStaffOptionsApi = async (params?: any) => {
  const paramSearch = new URLSearchParams(params).toString()

  return await axiosClient
    .get(endpoint.staffs + '?page=1&rowsPerPage=100&' + paramSearch)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.staffs?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(staffOptionsState, options)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllDistrictOptionsApi = async (params?: any) => {
  const paramSearch = new URLSearchParams(params).toString()

  return await axiosClient
    .get(endpoint.districts + '?page=1&rowsPerPage=100&' + paramSearch)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.districts?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(districtOptionsState, options)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllContractorOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.contractors}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.contractors?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(contractorOptionsState, options)
      } else {
        setRecoil(contractorOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllInvestorOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.investors}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.investors?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(investorOptionsState, options)
      } else {
        setRecoil(investorOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllDepartmentsOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.departments}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.departments?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.label,
          }
        })
        setRecoil(departmentOptionsState, options)
      } else {
        setRecoil(departmentOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllConstructionProgressesOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.constructionProgresses}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.constructionProgresses?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(constructionProgressesOptionsState, options)
      } else {
        setRecoil(constructionProgressesOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllProjectOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.projects}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.projects?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(projectOptionsState, options)
      } else {
        setRecoil(projectOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllProductOptionsApi = async (params?: any) => {
  const paramSearch = new URLSearchParams(params).toString()

  return axiosClient
    .get(`${endpoint.products}?rowsPerPage=100&` + paramSearch)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.products?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
            unit: item.unit,
          }
        })
        setRecoil(productOptionsState, options)
      } else {
        setRecoil(productOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllProductCategoryApi = async () => {
  return await axiosClient
    .get(endpoint.productCategories + '?page=1&rowsPerPage=100')
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.productCategories?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })

        setRecoil(productCategoryOptionsState, options)
      } else {
        console.log('')
      }
    })
    .catch(() => {
      console.log('')
    })
}

export const getAllProvinceOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.provinceList}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.provinces?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(provinceOptionsState, options)
      } else {
        setRecoil(provinceOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllPaymentMethodOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.paymentMethods}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.paymentMethods?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(paymentMethodOptionsState, options)
      } else {
        setRecoil(paymentMethodOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllVehiclesOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.vehicles}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.vehicles?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.code,
          }
        })
        setRecoil(vehiclesOptionsState, options)
      } else {
        setRecoil(vehiclesOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllSuppliersOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.suppliers}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.suppliers?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(suppliersOptionsState, options)
      } else {
        setRecoil(suppliersOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllStationOptionsApi = async () => {
  return axiosClient
    .get(`${endpoint.stations}?rowsPerPage=100`)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.stations?.data.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(stationOptionsState, options)
      } else {
        setRecoil(stationOptionsState, [])
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllShippingUnitOptionsApi = async (params?: any) => {
  const paramSearch = new URLSearchParams(params).toString()

  return await axiosClient
    .get(endpoint.shippingUnit + '?page=1&rowsPerPage=100&' + paramSearch)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.shippingUnits?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
          }
        })
        setRecoil(shippingUnitOptionsState, options)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllCustomerTypeOptionsApi = async (params?: any) => {
  const paramSearch = new URLSearchParams(params).toString()

  return await axiosClient
    .get(endpoint.customerTypes + '?page=1&rowsPerPage=100&' + paramSearch)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.customerTypes?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(customerTypeOptionsState, options)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllSaleFormOptionsApi = async (params?: any) => {
  const paramSearch = new URLSearchParams(params).toString()

  return await axiosClient
    .get(endpoint.saleForm + '?page=1&rowsPerPage=100&' + paramSearch)
    .then((res: IApiResponse | any) => {
      if (res.code == 200) {
        const options = res?.data?.salesForms?.data?.map((item: any) => {
          return {
            id: item.id,
            value: item.id,
            label: item.title,
          }
        })
        setRecoil(saleFormOptionsState, options)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
