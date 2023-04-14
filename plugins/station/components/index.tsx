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
import { getStationApi } from '../api'
import { stationActiveState, stationListState } from '../store'
import { StationType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const StationContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const stationList = useRecoilValue<StationType[]>(stationListState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setStationActive = useSetRecoilState<StationType | any>(stationActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('stationIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'name',
      title: t('stationNameHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'address',
      title: t('stationAddressHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'createdAt',
      title: t('stationCreateAtHeadCell'),
      disableSort: false,
      numeric: false,
      width: 180,
    },

    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 100,
    },
  ]

  const handleOpenDetail = (station?: StationType) => {
    setOpenModalDetail(!openModalDetail)
    setStationActive(station)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const getApiData = async () => {
      await getStationApi()
    }
    getApiData()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <SearchField />

      {isPermissionCreate('stations_create') && (
        <ButtonAddNew
          btnText={t('stationBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setStationActive(null)
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
        {stationList?.length > 0 &&
          stationList.map((item: StationType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.name} />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.address} />
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('stations_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('stations_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setStationActive(item)
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
