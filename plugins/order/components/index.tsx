import {
  IconButtonDelete,
  IconButtonEdit,
  Loading,
  MainDataTable,
  SearchField,
  StatusProgress,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { openModalDeleteState, roleState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  initChannel,
  isPermissionUpdate,
  t,
  totalPriceQuote,
} from '@/utils'
import { Visibility } from '@mui/icons-material'
import { Box, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getOrderApi } from '../api'
import { openModalSubmitOrderState, orderActivedState, orderListState } from '../store'
import { OrderType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ProductItem } from './product-item'

const ModalSubmitOrder = dynamic(() => import('@/plugins/order/components/modal-submit-order'), {
  loading: () => <Loading open={true} />,
})

export const OrderContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalSubmitOrderState)
  const params = useRecoilValue(dataTableParamsState)

  const orderList = useRecoilValue<OrderType[]>(orderListState)
  const setOrderActive = useSetRecoilState<OrderType | any>(orderActivedState)
  const role = useRecoilValue(roleState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('orderIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },

    {
      id: 'code',
      title: t('orderCodeHeadCell'),
      disableSort: false,
      numeric: false,
      width: 100,
      disablePadding: true,
    },

    {
      id: 'contractorId',
      title: t('orderContractorNameHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'projectId',
      title: t('orderProjectNameHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('orderAddressHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('orderOrderDetailHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('orderFinalPriceHeadCell'),
      disableSort: true,
      numeric: true,
    },

    {
      id: 'status',
      title: t('orderStatusHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('orderCreatedAtHeadCell'),
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

  const handleOpenDetail = (order?: OrderType) => {
    setOpenModalDetail(!openModalDetail)
    setOrderActive(order)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getOrderApi()

    const channel = initChannel()
    channel.bind(`order.update`, function () {
      getOrderApi()
    })
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} spacing={2} width="100%">
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
        {orderList?.length > 0 &&
          orderList.map((item: OrderType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>

              <TableCell padding="checkbox">
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.code} />
              </TableCell>
              <TableCell>{item?.contract?.quote?.contractor?.name}</TableCell>
              <TableCell>{item?.contract.quote?.project?.name}</TableCell>
              <TableCell>
                {item?.contract?.quote?.district?.title +
                  ', ' +
                  item?.contract?.quote?.province?.title}
              </TableCell>

              <TableCell>
                <ProductItem item={item.contract?.quote?.items} />
              </TableCell>

              <TableCell align="right">
                {totalPriceQuote((item?.contract.quote?.items as any) ?? [])}
              </TableCell>

              <TableCell>
                <Stack spacing={0.5}>
                  {role != 'accountant' && (
                    <Stack spacing={'2px'}>
                      <Typography fontSize={'11px !important'} fontWeight="bold">
                        {t('orderRoomBusiness')}
                      </Typography>
                      <Box>
                        <StatusProgress status={item.status} />
                      </Box>
                    </Stack>
                  )}
                  <Stack spacing={'2px'}>
                    <Typography fontSize={'11px !important'} fontWeight="bold">
                      {t('orderRoomAccountant')}
                    </Typography>
                    <Box>
                      <StatusProgress status={item.statusAccountant} />
                    </Box>
                  </Stack>
                  <Stack spacing={'2px'}>
                    <Typography fontSize={'11px !important'} fontWeight="bold">
                      {t('orderRoomDirector')}
                    </Typography>

                    <Box>
                      <StatusProgress status={item.statusDirector} />
                    </Box>
                  </Stack>
                </Stack>
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>

              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('orders_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionUpdate('orders_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setOrderActive(item)
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalSubmitOrder />}
      {openModalDelete && <ModalDelete />}
    </>
  )
}
