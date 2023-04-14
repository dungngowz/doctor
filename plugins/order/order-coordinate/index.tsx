import { IconButtonEdit, MainDataTable, SearchField } from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  formatPrice,
  formatQty,
  initChannel,
  t,
  totalPriceQuote,
} from '@/utils'
import { CheckCircle, Info } from '@mui/icons-material'
import { Chip, Stack, TableCell, TableRow, Typography } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getOrderApi } from '../api'
import { orderActivedState, orderListState } from '../store'
import { OrderType } from '../type'
import { Filter } from './filter'
import { ModalDetail } from './modal-detail'

export const OrderCoordinateContainer = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)

  const orderList = useRecoilValue<OrderType[]>(orderListState)
  const setOrderActive = useSetRecoilState<OrderType | any>(orderActivedState)

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
                <Stack>
                  {item.contract?.quote?.items?.length > 0 &&
                    item.contract?.quote?.items?.map((quote: any) => (
                      <Typography key={quote?.productId}>
                        • <span>{quote && quote?.title}:</span>
                        <span style={{ paddingLeft: '6px', fontSize: '12px', fontStyle: 'italic' }}>
                          {formatPrice(quote?.price)} x {formatQty(quote?.qty) + ' ' + quote?.unit}
                        </span>
                      </Typography>
                    ))}
                </Stack>
              </TableCell>

              <TableCell align="right">
                {totalPriceQuote((item?.contract.quote?.items as any) ?? [])}
              </TableCell>

              <TableCell>
                {item?.isFinish ? (
                  <Chip
                    className="badge-success"
                    avatar={<CheckCircle />}
                    label={t('orderStatusCompleted')}
                    size="small"
                    color="success"
                  />
                ) : (
                  <Chip
                    className="badge-warning"
                    avatar={<Info />}
                    label={t('orderStatusNotCompleted')}
                    size="small"
                    color="warning"
                  />
                )}
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>

              <TableCell align="right">
                <IconButtonEdit />
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail />}
    </>
  )
}
