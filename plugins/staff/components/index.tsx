import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { getAllDepartmentsOptionsApi } from '@/meta/common'
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
import { getStaffDataApi } from '../api'
import { staffActiveState, staffListState } from '../store'
import { StaffType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const StaffContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const staffList = useRecoilValue<StaffType[]>(staffListState)
  const setStaffActive = useSetRecoilState<StaffType | any>(staffActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('staffIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'departmentId',
      title: t('staffDepartmentTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'code',
      title: t('staffCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'name',
      title: t('staffNameHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'email',
      title: t('staffEmailHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'phone',
      title: t('staffPhoneHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('staffCreatedAtHeadCell'),
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

  /**
   * It's a function that takes an optional investor parameter and returns a function that toggles the
   * openModalDetail state and sets the staffActive state to the investor parameter
   * @param {StaffType} [investor] - StaffType
   */
  const handleOpenDetail = (investor?: StaffType) => {
    setOpenModalDetail(!openModalDetail)
    setStaffActive(investor)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getStaffDataApi()
  }, [params])

  // Get meta data
  useEffect(() => {
    getAllDepartmentsOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('staffs_create') && (
        <ButtonAddNew
          btnText={t('staffBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setStaffActive(null)
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
        {staffList?.length > 0 &&
          staffList.map((item: StaffType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Stack direction={'row'} alignItems="center">
                  <Highlighter
                    searchWords={[params.keyword]}
                    textToHighlight={item?.department?.title}
                  />
                </Stack>
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.code} />
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
                  textToHighlight={item?.phone.toString()}
                />
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('staffs_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('staffs_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setStaffActive(item)
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
