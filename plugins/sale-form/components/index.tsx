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
import { getSaleFormApi } from '../api'
import { saleFormActiveState, saleFormListState } from '../store'
import { SaleFormType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const SaleFormContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const saleFormList = useRecoilValue<SaleFormType[]>(saleFormListState)
  const setSaleFormListActive = useSetRecoilState<SaleFormType | any>(saleFormActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('saleFormIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },

    {
      id: 'title',
      title: t('saleFormTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'createdAt',
      title: t('saleFormCreatedAtHeadCell'),
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

  const handleOpenDetail = (saleForm?: SaleFormType) => {
    setOpenModalDetail(!openModalDetail)
    setSaleFormListActive(saleForm)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getSaleFormApi()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        {/* <Filter /> */}
      </Stack>

      {isPermissionCreate('sales_forms_create') ? (
        <ButtonAddNew
          btnText={t('saleFormBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setSaleFormListActive(null)
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
        {saleFormList?.length > 0 &&
          saleFormList.map((item: SaleFormType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.title} />
              </TableCell>

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('sales_forms_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}
                  {isPermissionDelete('sales_forms_delete') ? (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setSaleFormListActive(item)
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
