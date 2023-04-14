import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { totalRemainingMass } from '@/plugins/product-delivering/handlers'
import { getScheduleDetailApi } from '@/plugins/schedules/api'
import { schedulesActiveState } from '@/plugins/schedules/store'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import { calcIndexDataTable, formatDate, t } from '@/utils'
import { Stack, TableCell, TableRow } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getProductDeliveryApi } from '../api'
import { productDeliveryActiveState, productDeliveryListState } from '../store'
import { ProductDeliveryType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ProductDeliveryContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const productDelivery = useRecoilValue<ProductDeliveryType[]>(productDeliveryListState)
  const setProductDeliveryActive = useSetRecoilState<ProductDeliveryType | any>(
    productDeliveryActiveState
  )
  const schedulesActive = useRecoilValue(schedulesActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('productDeliveryIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'vehicleId',
      title: t('productDeliveryVehicleIdHeadCell'),
      disableSort: true,
      numeric: false,
      width: 120,
    },
    {
      id: 'orderId',
      title: t('productDeliveryOrderCodeHeadCell'),
      disableSort: true,
      numeric: false,
      width: 100,
    },
    {
      id: '',
      title: t('productDeliveryTypeProductHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('productDeliveryFirstWeightHeadCell'),
      disableSort: true,
      numeric: true,
      width: 120,
    },

    {
      id: '',
      title: t('productDeliverySecondWeightHeadCell'),
      disableSort: true,
      numeric: true,
      width: 120,
    },

    {
      id: '',
      title: t('productDeliveryTotalPriceHeadCell'),
      disableSort: true,
      numeric: true,
      width: 120,
    },

    {
      id: 'createdAt',
      title: t('productDeliveryCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
      width: 120,
    },
    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 100,
    },
  ]

  // Hooks
  const router = useRouter()
  const scheduleId = router?.query?.scheduleId
  // State
  const [isCreate, setIsCreate] = useState(true)

  const handleOpenDetail = (productDelivery?: ProductDeliveryType) => {
    setOpenModalDetail(!openModalDetail)
    setProductDeliveryActive(productDelivery)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (typeof router == 'undefined') {
      return
    }

    const productDeliveryParam = {
      ...params,
      scheduleId: scheduleId,
    }
    getProductDeliveryApi(productDeliveryParam)

    if (scheduleId) {
      getScheduleDetailApi(+scheduleId)
    }

    if (schedulesActive?.remainingMass == 0) {
      setIsCreate(true)
    } else {
      setIsCreate(false)
    }
  }, [params, router, scheduleId])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2}>
        <SearchField />
        <Filter />
      </Stack>

      <ButtonAddNew
        btnText={t('productDeliveryBtnAddNew')}
        disabled={isCreate}
        handleClick={() => {
          setOpenModalDetail(!openModalDetail)
          setProductDeliveryActive(null)
        }}
      />
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {productDelivery?.length > 0 &&
          productDelivery.map((item: ProductDeliveryType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.vehicle.code} />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item.schedule?.orderCode}
                />
              </TableCell>

              <TableCell>{item.schedule?.product?.title}</TableCell>
              <TableCell align="right">{item.firstWeightFormatted}</TableCell>
              <TableCell align="right">{item.secondaryWeightFormatted}</TableCell>
              <TableCell align="right">
                {totalRemainingMass(item?.secondaryWeight, item?.firstWeight)}
              </TableCell>

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1}>
                  <IconButtonEdit />

                  <IconButtonDelete
                    handleClick={(e) => {
                      e.stopPropagation()
                      setOpenModalDelete(!openModalDelete)
                      setProductDeliveryActive(item)
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail scheduleId={scheduleId ? +scheduleId : 0} />}
      {openModalDelete && <ModalDelete />}
    </>
  )
}
