import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
  StatusProgress,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import endpoint from '@/config/endpoint.json'
import { getAllContractorOptionsApi, getAllProjectOptionsApi } from '@/meta/common'
import { ProductItem } from '@/plugins/order/components/product-item'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  formatPrice,
  initChannel,
  isPermissionCreate,
  isPermissionDelete,
  isPermissionUpdate,
  t,
} from '@/utils'
import { LocalPrintshop, Visibility } from '@mui/icons-material'
import { Box, IconButton, Stack, TableCell, TableRow } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getQuoteApi } from '../api'
import { quoteActiveState, quoteListState } from '../store'
import { QuoteType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'

const ModalDetail = dynamic(() => import('./modal-detail'))

export const QuoteContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const quoteList = useRecoilValue<QuoteType[]>(quoteListState)
  const setQuoteActive = useSetRecoilState<QuoteType | any>(quoteActiveState)

  // State
  const router = useRouter()

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('quoteIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'code',
      title: t('quoteCodeHeadCell'),
      disableSort: false,
      numeric: false,
      disablePadding: true,
      width: 50,
    },
    {
      id: 'contractorId',
      title: t('quoteCustomerHeadCell'),
      disableSort: false,
      numeric: false,
      width: 200,
    },

    {
      id: 'projectId',
      title: t('quoteProjectHeadCell'),
      disableSort: false,
      numeric: false,
      width: 100,
    },

    {
      id: '',
      title: t('quoteAddressHeadCell'),
      disableSort: true,
      numeric: false,
      width: 260,
    },

    {
      id: '',
      title: t('quoteOrderDetailHeadCell'),
      disableSort: true,
      numeric: false,
      width: 160,
    },

    {
      id: 'finalPrice',
      title: t('quoteFinalPriceHeadCell'),
      disableSort: true,
      numeric: true,
      width: 160,
    },
    {
      id: '',
      title: t('quoteDurationQuoteHeadCell'),
      disableSort: true,
      numeric: false,
      width: 100,
    },
    {
      id: 'status',
      title: t('quoteStatusHeadCell'),
      disableSort: false,
      numeric: false,
      width: 200,
    },

    {
      id: 'createdAt',
      title: t('quoteCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
      width: 100,
    },
    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      // width: 180,
    },
  ]

  const handleOpenDetail = (quote?: QuoteType) => {
    setOpenModalDetail(!openModalDetail)
    setQuoteActive(quote)
  }

  // Handle export pdf
  const handleExportPDF = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, token: any) => {
    e.stopPropagation()
    window.open(`${process.env.API_URL}/${endpoint.exportPdfQuote}${token}`)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getQuoteApi()
    const channel = initChannel()
    channel.bind(`quote.update`, function () {
      getQuoteApi()
    })
  }, [params])

  // check from project
  useEffect(() => {
    if (router.asPath.includes('#create') || router?.query?.project_id) {
      setOpenModalDetail(!openModalDetail)
      setQuoteActive(null)
    }
  }, [router])

  // Fetch api
  useEffect(() => {
    getAllProjectOptionsApi()
    getAllContractorOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('quotes_create') && (
        <ButtonAddNew
          btnText={t('quoteBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setQuoteActive(null)
          }}
        />
      )}
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {quoteList?.length > 0 &&
          quoteList.map((item: QuoteType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>

              <TableCell padding="checkbox">
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.code} />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.contractor?.name}
                />
              </TableCell>

              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.project.name} />
              </TableCell>

              <TableCell>{item.district?.title + ', ' + item?.province?.title}</TableCell>
              <TableCell>
                <ProductItem item={item.items} />
              </TableCell>
              <TableCell align="right">{formatPrice(+item?.finalPrice)}</TableCell>
              <TableCell>{formatDate(item.durationQuote, 'DD/MM/YYYY')}</TableCell>

              <TableCell>
                <StatusProgress status={item.status} />
              </TableCell>

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  <IconButton size="small" onClick={(e) => handleExportPDF(e, item?.token ?? '')}>
                    <LocalPrintshop />
                  </IconButton>

                  <Box>
                    {isPermissionUpdate('quotes_update') ? (
                      <IconButtonEdit />
                    ) : (
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    )}
                  </Box>

                  <Box>
                    {isPermissionDelete('quotes_delete') && (
                      <IconButtonDelete
                        handleClick={(e) => {
                          e.stopPropagation()
                          setOpenModalDelete(!openModalDelete)
                          setQuoteActive(item)
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail />}
      {openModalDelete && <ModalDelete />}
    </>
  )
}
