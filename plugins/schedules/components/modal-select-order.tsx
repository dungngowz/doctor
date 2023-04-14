import { IconButtonClose, MainDataTable, SearchField } from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { loadingState } from '@/components/loading/store'
import { getOrderApi } from '@/plugins/order/api'
import { orderActivedState, orderListState } from '@/plugins/order/store'
import { OrderType } from '@/plugins/order/type'
import { dataTableParamsState, totalPageState } from '@/store/param-data'
import { calcIndexDataTable, formatPrice, formatQty, t, totalPriceQuote } from '@/utils'
import { CheckCircle } from '@mui/icons-material'
import { Box, Button, Stack, TableCell, TableRow } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { currentIndexSelectedOrderIdState, openModalSelectOrderState } from '../store'
import { FilterOfOrder } from './filter-of-order'
// import { FilterOfQuote } from './filter-of-quote'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ModalSelectOrder = () => {
  const openModalSelectOrder = useRecoilValue(openModalSelectOrderState)
  const params = useRecoilValue(dataTableParamsState)
  const orderList = useRecoilValue<OrderType[]>(orderListState)
  const currentIndexSelected = useRecoilValue(currentIndexSelectedOrderIdState)
  const [orderActive, setOrderActive] = useRecoilState<OrderType | any>(orderActivedState)

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
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 160,
    },
  ]

  const handleClose = () => {
    setRecoil(openModalSelectOrderState, false)
    setRecoil(totalPageState, 0)
  }

  // Handle select quote
  const handleSelectOrder = (index: number, item: OrderType) => {
    if (currentIndexSelected == index) {
      return
    }

    setRecoil(currentIndexSelectedOrderIdState, index)
    setOrderActive(item)

    setRecoil(loadingState, true)
    setTimeout(() => {
      handleClose()
      setRecoil(loadingState, false)
    }, 500)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (!openModalSelectOrder) {
      return
    }

    const orderParams = {
      ...params,
      status: 1,
      isFinish: 0,
    }

    getOrderApi(orderParams)
  }, [params, openModalSelectOrder])

  useEffect(() => {
    if (orderActive && orderActive?.id > 0) {
      const orderIndex = orderList.findIndex((item) => item.id === orderActive?.id)
      setRecoil(currentIndexSelectedOrderIdState, orderIndex)
    }
  }, [orderActive, orderList])

  const HeadTable = (
    <Stack direction={'row'} spacing={2} width="100%">
      <SearchField />
      <FilterOfOrder />
    </Stack>
  )

  return (
    <Dialog
      fullScreen
      open={openModalSelectOrder}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography flex={1}>{t('schedulesSelectOrderModalLabel')}</Typography>
          <Stack direction={'row'} spacing={2}>
            <IconButtonClose color="inherit" handleClick={handleClose} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box p="24px">
        <MainDataTable
          headCells={headCells}
          maxHeight={'calc(100vh - 230px)'}
          actionHeadProps={HeadTable}
        >
          {orderList?.length > 0 &&
            orderList.map((item: OrderType, index: number) => (
              <TableRow tabIndex={-1} key={item.id} onClick={() => handleSelectOrder(index, item)}>
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
                          <span
                            style={{ paddingLeft: '6px', fontSize: '12px', fontStyle: 'italic' }}
                          >
                            {formatPrice(quote?.price)} x{' '}
                            {formatQty(quote?.qty) + ' ' + quote?.unit}
                          </span>
                        </Typography>
                      ))}
                  </Stack>
                </TableCell>

                <TableCell align="right">
                  {totalPriceQuote((item?.contract.quote?.items as any) ?? [])}
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    variant={currentIndexSelected == index ? 'contained' : 'filledTonal'}
                    startIcon={currentIndexSelected == index ? <CheckCircle /> : ''}
                  >
                    {currentIndexSelected == index
                      ? t('schedulesSelectedOrderBtn')
                      : t('schedulesSelectedOrderBtn')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </MainDataTable>
      </Box>
    </Dialog>
  )
}
