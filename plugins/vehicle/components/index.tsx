import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { getAllShippingUnitOptionsApi } from '@/meta/common'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  isPermissionCreate,
  isPermissionDelete,
  isPermissionUpdate,
  t,
} from '@/utils'
import { QrCode, Visibility } from '@mui/icons-material'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getVehicleApi } from '../api'
import { openQrcodeState, vehicleActiveState, vehicleListState } from '../store'
import { VehicleType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'
import { ModalQrCode } from './modal-qr-code'

export const VehicleContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [openQrcode, setOpenQrcode] = useRecoilState(openQrcodeState)

  const params = useRecoilValue(dataTableParamsState)
  const vehicleList = useRecoilValue(vehicleListState)
  const setVehicleActive = useSetRecoilState<VehicleType | any>(vehicleActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('vehicleIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'shippingUnitId',
      title: t('vehicleShippingUnitIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: '30%',
    },
    {
      id: 'code',
      title: t('vehicleCodeHeadCell'),
      disableSort: false,
      numeric: false,
      width: '30%',
    },
    {
      id: '',
      title: t('vehiclePhoneHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'weight',
      title: t('vehicleWeightHeadCell'),
      disableSort: false,
      numeric: true,
      width: '10%',
    },

    {
      id: 'createdAt',
      title: t('vehicleCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
      width: '20%',
    },
    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 100,
    },
  ]

  const handleOpenDetail = (investor?: VehicleType) => {
    setOpenModalDetail(!openModalDetail)
    setVehicleActive(investor)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getVehicleApi()
  }, [params])

  // Watch options
  useEffect(() => {
    getAllShippingUnitOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={{ xs: 0, lg: 2 }} mr={{ xs: 2, lg: 0 }} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('vehicles_create') && (
        <ButtonAddNew
          btnText={t('vehicleBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setVehicleActive(null)
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
        {vehicleList?.length > 0 &&
          vehicleList.map((item: VehicleType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item.shippingUnit.name}
                />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.code} />
              </TableCell>
              <TableCell>{item.phone}</TableCell>

              <TableCell align="right">{item?.weightFormatted}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      setVehicleActive(item)
                      setOpenQrcode(true)
                    }}
                  >
                    <QrCode />
                  </IconButton>

                  {isPermissionUpdate('vehicles_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('vehicles_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setVehicleActive(item)
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail />}
      {openModalDelete && <ModalDelete />}
      {openQrcode && <ModalQrCode />}
    </>
  )
}
