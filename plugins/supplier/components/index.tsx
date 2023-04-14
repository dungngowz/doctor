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
import { getSupplierApi } from '../api'
import { supplierActiveState, supplierListState } from '../store'
import { SupplierType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const SupplierContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const supplierList = useRecoilValue(supplierListState)
  const setSupplierActive = useSetRecoilState<SupplierType | any>(supplierActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('supplierIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'code',
      title: t('supplierCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'name',
      title: t('supplierNameHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'taxCode',
      title: t('supplierTaxCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'phone',
      title: t('supplierPhoneHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('supplierCreatedAtHeadCell'),
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

  const handleOpenDetail = (investor?: SupplierType) => {
    setOpenModalDetail(!openModalDetail)
    setSupplierActive(investor)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getSupplierApi()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={{ xs: 0, lg: 2 }} mr={{ xs: 2, lg: 0 }} width="100%">
        <SearchField />
        {/* <Filter /> */}
      </Stack>

      {isPermissionCreate('suppliers_create') ? (
        <ButtonAddNew
          btnText={t('supplierBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setSupplierActive(null)
          }}
        />
      ) : null}
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {supplierList?.length > 0 &&
          supplierList.map((item: SupplierType, index: number) => (
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
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('suppliers_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('suppliers_delete') ? (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setSupplierActive(item)
                      }}
                    />
                  ) : null}
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
