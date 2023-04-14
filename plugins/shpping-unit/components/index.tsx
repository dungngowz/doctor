import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
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
import { Visibility } from '@mui/icons-material'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getShippingUnitApi } from '../api'
import { shippingUnitActiveState, shippingUnitListState } from '../store'
import { ShippingUnitType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ShippingUnitContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const shippingUnitList = useRecoilValue<ShippingUnitType[]>(shippingUnitListState)
  const setShippingUnitListActive = useSetRecoilState<ShippingUnitType | any>(
    shippingUnitActiveState
  )

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('shippingUnitIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'code',
      title: t('shippingUnitCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'name',
      title: t('shippingUnitNameHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'taxCode',
      title: t('shippingUnitTaxCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'phone',
      title: t('shippingUnitPhoneHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('shippingUnitCreatedAtHeadCell'),
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

  const handleOpenDetail = (shippingUnit?: ShippingUnitType) => {
    setOpenModalDetail(!openModalDetail)
    setShippingUnitListActive(shippingUnit)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getShippingUnitApi()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
      </Stack>

      {isPermissionCreate('shipping_unit_create') && (
        <ButtonAddNew
          btnText={t('shippingUnitBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setShippingUnitListActive(null)
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
        {shippingUnitList?.length > 0 &&
          shippingUnitList.map((item: ShippingUnitType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.code} />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.name} />
              </TableCell>

              <TableCell>{item?.taxCode}</TableCell>
              <TableCell>{item?.phone}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1}>
                  {isPermissionUpdate('shipping_unit_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('shipping_unit_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setShippingUnitListActive(item)
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
    </>
  )
}
