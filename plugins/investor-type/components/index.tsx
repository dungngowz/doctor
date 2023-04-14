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
import { getInvestorTypeApi } from '../api'
import { investorTypeActiveState, investorTypeListState } from '../store'
import { IInvestorType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const InvestorTypeContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const investorTypeList = useRecoilValue<IInvestorType[]>(investorTypeListState)
  const setInvestorTypeListActive = useSetRecoilState<IInvestorType | any>(investorTypeActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('investorTypeIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'title',
      title: t('investorTypeTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('investorTypeCreatedAtHeadCell'),
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

  const handleOpenDetail = (investorType?: IInvestorType) => {
    setOpenModalDetail(!openModalDetail)
    setInvestorTypeListActive(investorType)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getInvestorTypeApi()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        {/* <Filter /> */}
      </Stack>

      {isPermissionCreate('investor_types_create') && (
        <ButtonAddNew
          btnText={t('investorTypeBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setInvestorTypeListActive(null)
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
        {investorTypeList?.length > 0 &&
          investorTypeList.map((item: IInvestorType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.title} />
              </TableCell>

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('investor_types_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('investor_types_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setInvestorTypeListActive(item)
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
