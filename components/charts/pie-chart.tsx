import { fNumber, theme } from '@/utils'
import { Card, CardHeader } from '@mui/material'
import { blue, red, yellow } from '@mui/material/colors'
import { ApexOptions } from 'apexcharts'
import merge from 'lodash/merge'
import dynamic from 'next/dynamic'
import BaseOptionChart from './base-option-chart'
import { ChartLoading } from './chart-loading'
import { PieChartDataType } from './type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <ChartLoading />,
})

type IProps = {
  chartTitle?: string
  chartData: PieChartDataType[]
  chartColors?: string[]
}

export const PieChart = (props: IProps) => {
  const {
    chartTitle = '',
    chartData = [],
    chartColors = [theme.palette.primary.main, blue[600], red[600], yellow[600]],
  } = props

  const chartLabels = chartData.map((i) => i.label)

  const chartSeries = chartData.map((i) => i.value)

  // Chart options
  const chartOptions = merge(BaseOptionChart(), {
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center', position: 'bottom' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: any) => fNumber(seriesName),
        title: {
          formatter: (seriesName: any) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  } as ApexOptions)

  return (
    <Card className="card-chart-wrapper">
      <CardHeader title={chartTitle} />

      <ReactApexChart
        type="pie"
        options={chartOptions}
        series={chartSeries}
        width="100%"
        height={400}
      />
    </Card>
  )
}
