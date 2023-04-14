import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import {
  getAllContractorOptionsApi,
  getAllDistrictOptionsApi,
  getAllInvestorOptionsApi,
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
import { RequestQuote, Visibility } from '@mui/icons-material'
import { Box, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getProjectApi } from '../api'
import { projectActiveState, projectListState } from '../store'
import { ProjectType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ProjectContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue<any>(dataTableParamsState)
  const projectList = useRecoilValue(projectListState)
  const setProjectActive = useSetRecoilState<ProjectType | any>(projectActiveState)

  // Hooks
  const router = useRouter()
  const investorIdQuery = router?.query?.investorId
  const contractorIdQuery = router?.query?.contractorId

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('projectIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'code',
      title: t('projectCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'name',
      title: t('projectNameHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'contractorId',
      title: t('projectContractorHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'investorId',
      title: t('projectInvestorHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'createdAt',
      title: t('projectCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 200,
    },
  ]

  const handleOpenDetail = (investor?: ProjectType) => {
    setOpenModalDetail(!openModalDetail)
    setProjectActive(investor)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const extraParams = {
      investorId: investorIdQuery ?? params?.investorId ?? '',
      contractorId: contractorIdQuery ?? params?.contractorId ?? '',
    }

    getProjectApi(extraParams)
  }, [params, investorIdQuery, contractorIdQuery])

  // Get meta data
  useEffect(() => {
    getAllDistrictOptionsApi()
    getAllInvestorOptionsApi()
    getAllContractorOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={{ xs: 0, lg: 2 }} mr={{ xs: 2, lg: 0 }} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('projects_create') && (
        <ButtonAddNew
          btnText={t('projectBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setProjectActive(null)
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
        {projectList?.length > 0 &&
          projectList.map((item: ProjectType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.code} />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.name} />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.contractor?.name}
                />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.investor?.name}
                />
              </TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack
                  direction={'row'}
                  spacing={1}
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                >
                  {isPermissionCreate('quotes_create') && (
                    <Tooltip title="Tạo báo giá" arrow>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/sales/quote?project_id=${item.id}#create`)
                          }}
                        >
                          <RequestQuote />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  )}

                  <Box>
                    {isPermissionUpdate('projects_update') ? (
                      <IconButtonEdit />
                    ) : (
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    )}
                  </Box>

                  <Box>
                    {isPermissionDelete('projects_delete') && (
                      <IconButtonDelete
                        handleClick={(e) => {
                          e.stopPropagation()
                          setOpenModalDelete(!openModalDelete)
                          setProjectActive(item)
                        }}
                      />
                    )}
                  </Box>
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
