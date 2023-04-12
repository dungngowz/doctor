import { Box, Card, CardHeader } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import merge from 'lodash/merge'
import dynamic from 'next/dynamic'
import BaseOptionChart from './base-option-chart'
import { ChartLoading } from './chart-loading'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <ChartLoading />,
})

const chartLabels = [
  '01/01/2003',
  '02/01/2003',
  '03/01/2003',
  '04/01/2003',
  '05/01/2003',
  '06/01/2003',
  '07/01/2003',
  '08/01/2003',
  '09/01/2003',
  '10/01/2003',
  '11/01/2003',
]

const chartData = [
  {
    name: 'Team B',
    type: 'area',
    fill: 'gradient',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
  },
  {
    name: 'Team C',
    type: 'area',
    fill: 'gradient',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
  },
]

export const LineChart = () => {
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: any) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`
          }
          return y
        },
      },
    },
  } as ApexOptions)

  return (
    <Card className="card-chart-wrapper">
      <CardHeader
        title="Demo Chart line"
        subheader="(+43%) than last year
"
      />
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="line"
        width="100%"
        height={400}
      />
    </Card>
  )
}
