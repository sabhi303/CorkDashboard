// import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
// import { convertQuarterToDate } from '../../modules/bcd-date.js'
// import { hasCleanValue } from '../../modules/bcd-data.js'

// import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
// import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
// import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
// import { TimeoutError } from '../../modules/TimeoutError.js'

// async function main() {
//   const chartDivIds = ['airport-passengers']
//   //   const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
//   const STATBANK_BASE_URL =
//     'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/6/AS/TAQ01?query=%7B%22query%22:%5B%7B%22code%22:%22C02935V03550%22,%22selection%22:%7B%22filter%22:%22item%22,%22values%22:%5B%22EICK%22%5D%7D%7D%5D,%22response%22:%7B%22format%22:%22json-stat2%22%7D%7D'
//   // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
//   // TAQ01: Passengers by Airports in Ireland, Quarter and Statistic
//   const TABLE_CODE = 'TAQ01'
//   try {
//     addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Passengers by Airports</i>`)
//     const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL)
//     if (json) {
//       removeSpinner('chart-' + chartDivIds[0])
//     }
//     const dataset = JSONstat(json).Dataset(0)
//     // console.log(dataset)

//     const dimensions = dataset.Dimension().map(dim => {
//       return dim.label
//     })
//     // console.log(dimensions)

//     const categoriesAirport = dataset.Dimension(fixLabel(dimensions[2])).Category().map(c => {
//       return c.label
//     })
//     // console.log(categoriesAirport)
//     // //
//     const categoriesStat = dataset.Dimension(fixLabel(dimensions[0])).Category().map(c => {
//       return c.label
//     })
//     // console.log(categoriesStat)

//     const airportPassengersTable = dataset.toTable(
//       { type: 'arrobj' },
//       (d, i) => {
//         if ((d[fixLabel('Statistic')] === categoriesStat[0] ||
//           d[fixLabel('Statistic')] === categoriesStat[2]) &&
//           hasCleanValue(d)) {
//           d.date = convertQuarterToDate(d[fixLabel('Quarter')])
//           d.label = d[fixLabel('Quarter')]
//           d.value = +d.value
//           d.Statistic = getTraceName(d[fixLabel('Statistic')])
//           return d
//         }
//       })
//     // console.log(airportPassengersTable)

//     const airportPassengers = {
//       elementId: 'chart-' + chartDivIds[0],
//       data: airportPassengersTable,
//       tracenames: [categoriesStat[0], categoriesStat[2]],
//       tracekey: dimensions[0],
//       xV: 'date',
//       yV: 'value',
//       tX: 'Year',
//       tY: 'Passengers (Number)',
//       formaty: 'hundredThousandsShort'
//     }

//     const airportPassengersChart = new BCDMultiLineChart(airportPassengers)

//     const redraw = () => {
//       airportPassengersChart.drawChart()
//       airportPassengersChart.addTooltip('Airport passengers in ', '', 'label')
//       airportPassengersChart.showSelectedLabelsY([3, 6, 9])
      
//       // Show all x-axis labels
//       const labelsToShow = airportPassengersTable.map((d, i) => i)
//       // console.log('Labels to show on x-axis:', labelsToShow);  // Debugging line
//       airportPassengersChart.showSelectedLabelsX(labelsToShow)
//     }

//     redraw()

//     window.addEventListener('resize', () => {
//       redraw()
//     })
//   } catch (e) {
//     console.log('Error creating airport pax chart')
//     console.log(e)

//     removeSpinner('chart-' + chartDivIds[0])
//     const eMsg = (e instanceof TimeoutError) ? e : 'An error occurred'
//     const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
//     // console.log('e')
//     // console.log(e)
//     d3.select(`#${errBtnID}`).on('click', function () {
//       removeErrorMessageButton('chart-' + chartDivIds[0])
//       main()
//     })
//   }
// }

// // The API change on 2020-12-01 resulted in a dimension labelling error which is fixed here
// const fixLabel = function (l) {
//   const labelMap = {
//     Statistic: 'STATISTIC',
//     Quarter: 'TLIST(Q1)',
//     'Airports in Ireland': 'C02935V03550'
//   }
//   return labelMap[l] || l
// }

// const getTraceName = function (s) {
//   const SHORTS = {
//     Passengers: 'Passenger Count',
//     'Passengers Trend': 'Trend',
//     'Passengers (Seasonally Adjusted)': 'Seasonally Adj.'
//   }

//   return SHORTS[s] || s
// }

// export { main }

// Abhijeet
import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { convertQuarterToDate } from '../../modules/bcd-date.js'
import { hasCleanValue } from '../../modules/bcd-data.js'

import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { BCDMultiLineChart } from '../../modules/BCDMultiLineChart.js'
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { TimeoutError } from '../../modules/TimeoutError.js'

async function main() {
  const chartDivIds = ['airport-passengers']
  const STATBANK_BASE_URL = 'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/6/AS/TAQ01?query=%7B%22query%22:%5B%7B%22code%22:%22C02935V03550%22,%22selection%22:%7B%22filter%22:%22item%22,%22values%22:%5B%22EICK%22%5D%7D%7D%5D,%22response%22:%7B%22format%22:%22json-stat2%22%7D%7D'
  const TABLE_CODE = 'TAQ01'
  
  try {
    addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Passengers by Airports</i>`)
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL)
    if (json) {
      removeSpinner('chart-' + chartDivIds[0])
    }
    
    const dataset = JSONstat(json).Dataset(0)
    const dimensions = dataset.Dimension().map(dim => dim.label)
    const categoriesAirport = dataset.Dimension(fixLabel(dimensions[2])).Category().map(c => c.label)
    const categoriesStat = dataset.Dimension(fixLabel(dimensions[0])).Category().map(c => c.label)

    const airportPassengersTable = dataset.toTable(
      { type: 'arrobj' },
      (d, i) => {
        if ((d[fixLabel('Statistic')] === categoriesStat[0] ||
          d[fixLabel('Statistic')] === categoriesStat[2]) &&
          hasCleanValue(d)) {
          d.date = convertQuarterToDate(d[fixLabel('Quarter')])
          d.label = d[fixLabel('Quarter')]
          d.value = +d.value
          d.Statistic = getTraceName(d[fixLabel('Statistic')])
          return d
        }
      })

    const airportPassengers = {
      elementId: 'chart-' + chartDivIds[0],
      data: airportPassengersTable,
      tracenames: [categoriesStat[0], categoriesStat[2]],
      tracekey: dimensions[0],
      xV: 'date',
      yV: 'value',
      tX: 'Year',
      tY: 'Passengers (Number)',
      formaty: 'hundredThousandsShort',
      // Adding options for interactive legend and data highlights
      options: {
        legend: {
          display: true,
          position: 'bottom',
          onClick: (e, legendItem) => {
            const index = legendItem.datasetIndex;
            const ci = airportPassengersChart.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          }
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: '2020Q2',
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: 'COVID-19 Impact',
              enabled: true,
              position: 'top'
            }
          }]
        }
      }
    }

    const airportPassengersChart = new BCDMultiLineChart(airportPassengers)

    const redraw = () => {
      airportPassengersChart.drawChart()
      airportPassengersChart.addTooltip('Airport passengers in ', '', 'label')
      airportPassengersChart.showSelectedLabelsY([3, 6, 9])
      
      const labelsToShow = airportPassengersTable.map((d, i) => i)
      airportPassengersChart.showSelectedLabelsX(labelsToShow)
    }

    redraw()

    window.addEventListener('resize', () => {
      redraw()
    })

    // Adding event listeners for additional user interaction
    document.getElementById('filter-year').addEventListener('change', (e) => {
      const selectedYear = e.target.value
      const filteredData = airportPassengersTable.filter(d => d.date.getFullYear() === parseInt(selectedYear))
      airportPassengersChart.updateData(filteredData)
      redraw()
    })

  } catch (e) {
    console.log('Error creating airport pax chart')
    console.log(e)

    removeSpinner('chart-' + chartDivIds[0])
    const eMsg = (e instanceof TimeoutError) ? e : 'An error occurred'
    const errBtnID = addErrorMessageButton('chart-' + chartDivIds[0], eMsg)
    d3.select(`#${errBtnID}`).on('click', function () {
      removeErrorMessageButton('chart-' + chartDivIds[0])
      main()
    })
  }
}

const fixLabel = function (l) {
  const labelMap = {
    Statistic: 'STATISTIC',
    Quarter: 'TLIST(Q1)',
    'Airports in Ireland': 'C02935V03550'
  }
  return labelMap[l] || l
}

const getTraceName = function (s) {
  const SHORTS = {
    Passengers: 'Passenger Count',
    'Passengers Trend': 'Trend',
    'Passengers (Seasonally Adjusted)': 'Seasonally Adj.'
  }

  return SHORTS[s] || s
}

export { main }
