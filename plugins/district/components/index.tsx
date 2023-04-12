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
import { getDistrictDataApi } from '../api'
import { districtActiveState, districtListState } from '../store'
import { DistrictType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const DistrictContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const districtList = useRecoilValue<DistrictType[]>(districtListState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setDistrictActive = useSetRecoilState<DistrictType | any>(districtActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('districtIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'provinceId',
      title: t('districtNameProvinceHeadCell'),
      disableSort: false,
      numeric: false,
      width: '20%',
    },
    {
      id: 'title',
      title: t('districtNameHeadCell'),
      disableSort: false,
      numeric: false,
      width: '20%',
    },

    {
      id: 'createdAt',
      title: t('districtDateHeadCell'),
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

  const handleOpenDetail = (district?: DistrictType) => {
    setOpenModalDetail(!openModalDetail)
    setDistrictActive(district)
  }

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('districts_create') && (
        <ButtonAddNew
          btnText={t('districtBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setDistrictActive(null)
          }}
        />
      )}
    </Stack>
  )

  useEffect(() => {
    getDistrictDataApi()
  }, [params])

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {districtList?.length > 0 &&
          districtList.map((item: DistrictType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.province?.title}
                />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.title} />
              </TableCell>

              <TableCell>{formatDate(item?.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('districts_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('districts_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setDistrictActive(item)
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
