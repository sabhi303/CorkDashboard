import { fetchJsonFromUrlAsync } from "../../modules/bcd-async.js";
import { StackedAreaChart } from "../../modules/StackedAreaChart.js";
import {
  addSpinner,
  removeSpinner,
  addErrorMessageButton,
  removeErrorMessageButton,
} from "../../modules/bcd-ui.js";
import { TimeoutError } from "../../modules/TimeoutError.js";

export async function main() {
  const parseYear = d3.timeParse("%Y");
  const chartDivId = "population";
  const STATIC_DATA_URL = "/data/static/cork_population_data.json"; // Assuming the path to the file is correctly set

  try {
    addSpinner(
      "chart-" + chartDivId,
      `<b>statbank.cso.ie</b>: <i>Annual Population Data</i>`
    );

    const json = await fetchJsonFromUrlAsync(STATIC_DATA_URL);
    if (json) {
      removeSpinner("chart-" + chartDivId);
    }

    const data = json["Cork"];
    const years = data["Census"].map(parseYear);

    const populationData = years.map((year, index) => {
      return {
        date: year,
        Male: data["population"]["Male"][index],
        Female: data["population"]["Female"][index],
      };
    });

    const populationContent = {
      elementId: "chart-" + chartDivId,
      data: populationData,
      tracenames: ["Male", "Female"],
      xV: "date",
      tX: "Year",
      tY: "Population",
    };

    // console.log("Population Content: ", populationContent)

    const populationChart = new StackedAreaChart(populationContent);
    populationChart.drawChart();
    populationChart.addTooltip("Population: ", "Population by Year", "date");
    // populationChart.showSelectedLabelsX(
    //   d3.range(0, populationData.length, Math.ceil(populationData.length / 10))
    // ); // Adjusting x-axis labels
    populationChart.showSelectedLabelsY([0, 2, 4, 6, 8, 10, 12]);

    window.addEventListener("resize", () => {
      populationChart.drawChart();
    });
  } catch (e) {
    console.log("Error creating population chart");
    console.log(e);
    removeSpinner("chart-" + chartDivId);
    const eMsg = e instanceof TimeoutError ? e : "An error occurred";
    const errBtnID = addErrorMessageButton(chartDivId, eMsg);
    d3.select(`#${errBtnID}`).on("click", function () {
      removeErrorMessageButton("chart-" + chartDivId);
      main();
    });
  }
}
