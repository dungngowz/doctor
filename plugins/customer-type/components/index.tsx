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
import { getCustomerTypesApi } from '../api'
import { customerTypesActiveState, customerTypesListState } from '../store'
import { CustomerTypesType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const CustomerTypesContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const customerTypesList = useRecoilValue<CustomerTypesType[]>(customerTypesListState)
  const setCustomerTypesListActive = useSetRecoilState<CustomerTypesType | any>(
    customerTypesActiveState
  )

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('customerTypesIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'title',
      title: t('customerTypesTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('customerTypesCreatedAtHeadCell'),
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

  const handleOpenDetail = (customerTypes?: CustomerTypesType) => {
    setOpenModalDetail(!openModalDetail)
    setCustomerTypesListActive(customerTypes)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getCustomerTypesApi()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
      </Stack>

      {isPermissionCreate('customer_types_create') && (
        <ButtonAddNew
          btnText={t('customerTypesBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setCustomerTypesListActive(null)
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
        {customerTypesList?.length > 0 &&
          customerTypesList.map((item: CustomerTypesType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.title} />
              </TableCell>

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('customer_types_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small" sx={{ flexShrink: 0 }}>
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('customer_types_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setCustomerTypesListActive(item)
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
