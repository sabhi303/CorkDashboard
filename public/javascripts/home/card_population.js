import { hasCleanValue } from '../modules/bcd-data.js';
import { CardChartLine } from '../modules/CardChartLine.js';
import { fetchJsonFromUrlAsync } from '../modules/bcd-async.js';

async function main(options) {
  const json = await fetchJsonFromUrlAsync("/api/themes/population");

  // Directly use the structure provided in your JSON
  const data = json['Cork'];
  const years = data['Census'];
  const bothSexesPopulation = data['population']['Both sexes'];

  // Filter and prepare the data
  const populationFiltered = years.map((year, index) => {
    if (bothSexesPopulation[index] !== null && hasCleanValue({ value: bothSexesPopulation[index] })) {
      return {
        date: +year,
        value: +bothSexesPopulation[index]
      };
    }
  }).filter(d => d !== undefined);

  const populationConfig = {
    data: populationFiltered,
    elementid: '#' + options.plotoptions.chartid,
    yvaluename: 'value',
    xvaluename: 'date',
    fV: d3.format('.2s'), // format y value
    dL: 'date'
  };

  const populationCard = new CardChartLine(populationConfig);

  window.addEventListener('resize', () => {
    populationCard.drawChart();
  });

  // Initial draw
  populationCard.drawChart();
}

export { main };
