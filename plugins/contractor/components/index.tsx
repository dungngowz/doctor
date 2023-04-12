import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { getAllCustomerTypeOptionsApi, getAllStaffOptionsApi } from '@/meta/common'
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
import { getContractorDataApi } from '../api'
import { contractorActiveState, contractorListState } from '../store'
import { ContractorType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ContractorContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const contractorList = useRecoilValue<ContractorType[]>(contractorListState)
  const setContractorActive = useSetRecoilState<ContractorType | any>(contractorActiveState)

  // Hooks
  const router = useRouter()

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('contractorIdHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'code',
      title: t('contractorCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'name',
      title: t('contractorNameHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'email',
      title: t('contractorEmailHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'customerTypeId',
      title: t('contractorCustomerTYpeHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'staffId',
      title: t('contractorStaffHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'contractorContact',
      title: t('contractorContactHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('contractorCreatedAtHeadCell'),
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

  const handleOpenDetail = (investor?: ContractorType) => {
    setOpenModalDetail(!openModalDetail)
    setContractorActive(investor)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getContractorDataApi()
  }, [params])

  // Get meta data
  useEffect(() => {
    const staffParam = {
      departmentId: 2,
    }
    getAllStaffOptionsApi(staffParam)
    getAllCustomerTypeOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('contractors_create') && (
        <ButtonAddNew
          btnText={t('contractorBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setContractorActive(null)
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
        {contractorList?.length > 0 &&
          contractorList.map((item: ContractorType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>

              <TableCell
                onClick={(e) => {
                  e.stopPropagation()
                  router.push('/project?contractorId=' + item.id)
                }}
              >
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.code?.toString()}
                  className="text-link"
                />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.name} />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.email} />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.customerType?.title}
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
                    textToHighlight={item?.positionContact}
                  />
                </Stack>
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('contractors_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('contractors_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setContractorActive(item)
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
