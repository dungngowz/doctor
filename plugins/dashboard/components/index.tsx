import IconBuild from '@/components/icon/build'
import IconProject from '@/components/icon/project'
import IconStaff from '@/components/icon/staff'
import IconTransaction from '@/components/icon/transaction'
import { Statistics } from '@/components/widget'
import { t } from '@/utils'
import { Grid, Skeleton } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { getDashboardApi } from '../api'
import { dashboardState, widgetsLoadingState } from '../store'

export const DashboardContainer = () => {
  // Recoil
  const isFrisLoading = useRecoilValue(widgetsLoadingState)
  const dashboard = useRecoilValue(dashboardState)

  useEffect(() => {
    getDashboardApi()
  }, [])

  return (
    <Grid container spacing={2}>
      {isFrisLoading ? (
        <>
          {[...Array(4)].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
              <Skeleton
                animation="wave"
                variant="rounded"
                width={'100%'}
                height={140}
                sx={{ bgcolor: grey[200] }}
              />
            </Grid>
          ))}
        </>
      ) : (
        <>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Statistics
              title={t('totalProjects')}
              count={dashboard?.totalProjects}
              bgcolor="indigo"
              icon={<IconProject height={40} width={40} color={'#fff'} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Statistics
              title={t('totalStaffs')}
              count={dashboard?.totalStaffs}
              icon={<IconStaff height={40} width={40} color={'#fff'} />}
              bgcolor="red"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Statistics
              title={t('totalInvestors')}
              count={dashboard?.totalInvestors}
              bgcolor="blue"
              icon={<IconTransaction height={40} width={40} color={'#fff'} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Statistics
              title={t('totalContractors')}
              count={dashboard?.totalContractors}
              bgcolor="green"
              icon={<IconBuild height={40} width={40} color={'#fff'} />}
            />
          </Grid>
        </>
      )}

      {/* <Grid item md={12} lg={6}>
        <LineChart />
      </Grid>

      <Grid item md={12} lg={6}>
        <PieChart
          chartTitle="Demo Pie chart"
          chartData={[
            { label: 'America', value: 4344 },
            { label: 'Asia', value: 5435 },
            { label: 'Europe', value: 1443 },
            { label: 'Africa', value: 4443 },
          ]}
        />
      </Grid>

      <Grid item md={12} lg={6}>
        <ColumnChart
          chartTitle="Column Demo"
          chartData={[
            {
              name: 'Net Profit',
              data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
              name: 'Revenue',
              data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
            {
              name: 'Free Cash Flow',
              data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
            },
          ]}
        />
      </Grid> */}
    </Grid>
  )
}
