import { IconButtonEdit, MainDataTable, SearchField } from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import { calcIndexDataTable, formatDate, t } from '@/utils'
import { Stack, TableCell, TableRow } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getProductDeliveringApi } from '../api'
import { productDeliveringActiveState, productDeliveringListState } from '../store'
import { ProductDeliveringType } from '../type'
import { Filter } from './filter'
import { ModalDetail } from './modal-detail'

export const ProductDeliveringContainer = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const productDelivering = useRecoilValue<ProductDeliveringType[]>(productDeliveringListState)
  const setProductDeliveringActive = useSetRecoilState<ProductDeliveringType | any>(
    productDeliveringActiveState
  )

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('productDeliveringIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'vehicleId',
      title: t('productDeliveringVehicleIdHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'orderId',
      title: t('productDeliveringOrderCodeHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('productDeliveringTypeProductHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('productDeliveringFirstWeightHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'createdAt',
      title: t('productDeliveringCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
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

  const handleOpenDetail = (productDelivering?: ProductDeliveringType) => {
    setOpenModalDetail(!openModalDetail)
    setProductDeliveringActive(productDelivering)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (typeof router == 'undefined') {
      return
    }

    const productDeliveringParam = {
      ...params,
      status: 0,
    }
    getProductDeliveringApi(productDeliveringParam)
  }, [params, router])

  const HeadTable = (
    <Stack direction={'row'} spacing={2}>
      <SearchField />
      <Filter />
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {productDelivering?.length > 0 &&
          productDelivering.map((item: ProductDeliveringType, index: number) => (
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
              <TableCell>{item.firstWeightFormatted}</TableCell>

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell align="right">
                <IconButtonEdit />
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail scheduleId={scheduleId ? +scheduleId : 0} />}
    </>
  )
}
