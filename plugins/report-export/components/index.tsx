import { MainDataTable, SearchField } from '@/components'
import { brand } from '@/components/colors/brand'
import { HeadCellsType } from '@/components/data-table/type'
import { openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  formatPrice,
  formatQty,
  t,
  totalPriceReportProduct,
} from '@/utils'
import { RemoveRedEye } from '@mui/icons-material'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getReportExportApi } from '../api'
import { reportExportActiveState, reportExportListState } from '../store'
import { ReportExportType } from '../type'
import { Filter } from './filter'
import { ModalDetail } from './modal-detail'

export const ReportExportContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const reportExportList = useRecoilValue<ReportExportType[]>(reportExportListState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setReportExportActive = useSetRecoilState<ReportExportType | any>(reportExportActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('productDeliveryIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },

    {
      id: '',
      title: t('reportExportCodeHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('reportExportPlaceDeliveryHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('reportExportProductTypeHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('reportExportVehicleCodeHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('reportExportProductWeightHeadCell'),
      disableSort: true,
      numeric: true,
    },
    {
      id: '',
      title: t('reportExportPriceHeadCell'),
      disableSort: true,
      numeric: true,
    },
    {
      id: '',
      title: t('reportExportTotalPriceHeadCell'),
      disableSort: true,
      numeric: true,
    },
    {
      id: '',
      title: t('reportExportShipUnitHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('reportExportCreatedAtHeadCell'),
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

  const handleOpenDetail = (product?: ReportExportType) => {
    setOpenModalDetail(!openModalDetail)
    setReportExportActive(product)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const getApiData = async () => {
      await getReportExportApi(params)
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
        {reportExportList?.length > 0 &&
          reportExportList.map((item: ReportExportType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.schedule?.supplier?.code}
                />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.placeDelivery} />
              </TableCell>

              <TableCell>{item.schedule?.product?.title}</TableCell>
              <TableCell>{item.vehicle.code}</TableCell>
              <TableCell align="right">
                {formatQty(Math.abs(item?.secondaryWeight - item?.firstWeight))} {item?.unit}
              </TableCell>
              <TableCell align="right">{formatPrice(+item?.price)}</TableCell>
              <TableCell align="right">{totalPriceReportProduct(item)}</TableCell>
              <TableCell>{item.schedule.shippingUnit}</TableCell>

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
