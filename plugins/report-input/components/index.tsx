import { MainDataTable, SearchField } from '@/components'
import { brand } from '@/components/colors/brand'
import { HeadCellsType } from '@/components/data-table/type'
import { openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import { calcIndexDataTable, formatDate, t, totalPriceReportProduct } from '@/utils'
import { RemoveRedEye } from '@mui/icons-material'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getReportInputApi } from '../api'
import { reportInputActiveState, reportInputListState } from '../store'
import { ReportInputType } from '../type'
import { Filter } from './filter'
import { ModalDetail } from './modal-detail'

export const ReportInputContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const reportInputList = useRecoilValue<ReportInputType[]>(reportInputListState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setReportInputActive = useSetRecoilState<ReportInputType | any>(reportInputActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('productInputIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },

    {
      id: 'supplierId',
      title: t('reportInputCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: '',
      title: t('reportInputPlaceDeliveryHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('reportInputProductTypeHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('reportInputVehicleCodeHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('reportInputProductWeightHeadCell'),
      disableSort: true,
      numeric: true,
    },
    {
      id: '',
      title: t('reportInputPriceHeadCell'),
      disableSort: true,
      numeric: true,
    },
    {
      id: '',
      title: t('reportInputTotalPriceHeadCell'),
      disableSort: true,
      numeric: true,
    },
    {
      id: '',
      title: t('reportInputShipUnitHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('reportInputCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 80,
    },
  ]

  const handleOpenDetail = (product?: ReportInputType) => {
    setOpenModalDetail(!openModalDetail)
    setReportInputActive(product)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const getApiData = async () => {
      await getReportInputApi(params)
    }
    getApiData()
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
        {reportInputList?.length > 0 &&
          reportInputList.map((item: ReportInputType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.supplier?.name}
                />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.placeDelivery} />
              </TableCell>

              <TableCell>{item.product?.productCategory?.title}</TableCell>
              <TableCell>{item.vehicle.code}</TableCell>
              <TableCell align="right">{item.productWeightFormatted}</TableCell>
              <TableCell align="right">{item.priceFormatted}</TableCell>
              <TableCell align="right">{totalPriceReportProduct(item)}</TableCell>
              <TableCell>{item.shippingUnit}</TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <RemoveRedEye sx={{ color: brand.gray600 }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail />}
    </>
  )
}
