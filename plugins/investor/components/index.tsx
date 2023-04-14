import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import {
  getAllDistrictOptionsApi,
  getAllInvestorTypeApi,
  getAllStaffOptionsApi,
} from '@/meta/common'
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
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getInvestorDataApi } from '../api'
import { investorActiveState, investorListState } from '../store'
import { InvestorType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const InvestorContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const investorList = useRecoilValue<InvestorType[]>(investorListState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setProductActive = useSetRecoilState<InvestorType | any>(investorActiveState)

  // Hooks
  const router = useRouter()

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('investorIdHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'code',
      title: t('investorCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'name',
      title: t('investorTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'investorType',
      title: t('investorTypeHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'staffId',
      title: t('investorStaffNameHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'nameContact',
      title: t('investorContactHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('investorCreateAtHeadCell'),
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

  const handleOpenDetail = (investor?: InvestorType) => {
    setOpenModalDetail(!openModalDetail)
    setProductActive(investor)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getInvestorDataApi()
  }, [params])

  /* Calling the getAllProductCategoryApi() function every time the component is mounted. */
  useEffect(() => {
    const staffParam = {
      departmentId: 2,
    }
    getAllInvestorTypeApi()
    getAllStaffOptionsApi(staffParam)
    getAllDistrictOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />

        <Filter />
      </Stack>

      {isPermissionCreate('investors_create') && (
        <ButtonAddNew
          btnText={t('investorBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setProductActive(null)
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
        {investorList?.length > 0 &&
          investorList.map((item: InvestorType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>

              <TableCell
                className="text-link"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push('/project?investorId=' + item.id)
                }}
              >
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.code} />
              </TableCell>

              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.name} />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.investorType.title}
                />
              </TableCell>

              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.staff?.name} />
              </TableCell>

              <TableCell>
                <Stack>
                  <Highlighter searchWords={[params.keyword]} textToHighlight={item?.nameContact} />
                  <Highlighter
                    searchWords={[params.keyword]}
                    textToHighlight={item?.phoneContact}
                  />
                  <Highlighter
                    searchWords={[params.keyword]}
                    textToHighlight={item?.emailContact}
                  />
                </Stack>
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('investors_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('investors_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setProductActive(item)
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
