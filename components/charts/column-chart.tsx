import { Card, CardHeader } from '@mui/material'
import { blue, red, yellow } from '@mui/material/colors'
import { ApexOptions } from 'apexcharts'
import merge from 'lodash/merge'
import dynamic from 'next/dynamic'
import BaseOptionChart from './base-option-chart'
import { ChartLoading } from './chart-loading'
import { ColumnChartDataType } from './type'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <ChartLoading />,
})

type IProps = {
  chartTitle?: string
  chartData: ColumnChartDataType[]
  chartColors?: string[]
  chartLabels?: any[]
}

export const ColumnChart = (props: IProps) => {
  const {
    chartTitle = '',
    chartData = [],
    chartColors = [red[600], blue[600], yellow[600]],
    chartLabels = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  } = props

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      type: 'bar',
      height: 350,
    },
    colors: chartColors,
    legend: { floating: true, horizontalAlign: 'center', position: 'bottom' },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },

    xaxis: {
      categories: chartLabels,
    },

    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val + ' thousands'
        },
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
  } as ApexOptions)

  return (
    <Card className="card-chart-wrapper bar-chart-wrapper">
      <CardHeader title={chartTitle} />

      <ReactApexChart
        type="bar"
        options={chartOptions}
        series={chartData}
        width="100%"
        height={350}
      />
    </Card>
  )
}
