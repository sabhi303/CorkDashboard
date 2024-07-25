import { hasCleanValue } from '../modules/bcd-data.js';
import { CardChartLine } from '../modules/CardChartLine.js';
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js';
import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs';

async function main(options) {
  // Fetch JSON data
  // const json = await fetchJsonFromUrlAsync("../data/static/filtered_data.json");
  const json = await fetchJsonFromUrlAsync("/api/themes/housing");

  // Check if data is fetched
  if (!json) {
    console.error('Failed to fetch data');
    return;
  }

  const parseYearMonth = d3.timeParse('%Y %B');
  const formatMonth = d3.timeFormat('%b %Y'); // Format to "Jan 2022"

  const transformData = (region, dwellingType, statisticType) => {
    if (!json[region]) {
      throw new Error(`Region "${region}" not found in JSON data`);
    }

    if (!json[region]["Month"]) {
      throw new Error(`Months not found for region "${region}" in JSON data`);
    }

    const months = json[region]["Month"];
    const values =
      json[region]["Type of Dwelling"][dwellingType][statisticType]["Values"];

    if (!values) {
      throw new Error(
        `Values for ${dwellingType} and ${statisticType} not found in region "${region}"`
      );
    }

    return months
      .map((month, index) => {
        const parsedDate = parseYearMonth(month);
        const value = +values[index]; // Ensure value is a number
        if (isNaN(value) || !parsedDate) {
          console.warn(`Invalid value or date for month: ${month}`);
          return null; // Filter out invalid data
        }
        return {
          date: parsedDate,
          Statistic: statisticType,
          "RPPI Region": region, 
          "label": month,
          value: value
        };
      })
      .filter(d => d && d.date); // Ensure only valid data is kept
  };

  // Transform data for Cork City and Cork County
  const corkCityData = transformData("Cork City", "All Dwelling Types", "Mean Sale Price");
  const corkCountyData = transformData("Cork County", "All Dwelling Types", "Mean Sale Price");
  const combinedData = [...corkCityData, ...corkCountyData];

  // Calculate average values
  const housePricesNested = d3.nest()
    .key(d => d.date)
    .entries(combinedData);

  const housePricesAverage = housePricesNested.map(d => {
    const date = new Date(d.key); // Convert key to Date object
    const formattedDate = formatMonth(date); // Format the Date object

    const obj = {
      date: date,
      label: formattedDate // Use formatted date
    };
    const values = d.values.map(v => v.value);
    obj.value = d3.mean(values); // Calculate average
    return obj;
  });

  // Log data for debugging
  // console.log("Combined Data for Chart:", combinedData);
  // console.log("House Prices Average Data:", housePricesAverage);

  // Check for NaN values in final data
  const hasNaN = housePricesAverage.some(d => isNaN(d.value));
  if (hasNaN) {
    console.error("Data contains NaN values:", housePricesAverage);
    return; // Exit if data is invalid
  }

  // Chart configuration
  const housePricesConfig = {
    elementid: '#' + options.plotoptions.chartid,
    data: housePricesAverage,
    yvaluename: 'value',
    xvaluename: 'date',
    fV: d3.format('.3s'), // Format y value
    dL: 'label',
    tX: 'Year', // Label for x-axis
    tY: 'Mean Sale Price' // Label for y-axis
  };

  // Create and draw the chart
  const housePricesCardChart = new CardChartLine(housePricesConfig);
  housePricesCardChart.drawChart();

  // Handle window resize
  window.addEventListener('resize', () => {
    housePricesCardChart.drawChart();
  });
}

export { main };
