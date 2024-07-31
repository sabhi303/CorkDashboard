import { fetchJsonFromUrlAsyncTimeout } from "../../modules/bcd-async.js";
import { convertQuarterToDate } from "../../modules/bcd-date.js";
import { hasCleanValue } from "../../modules/bcd-data.js";

import JSONstat from "https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs";
import { BCDMultiLineChart } from "../../modules/BCDMultilineChart.js";
import {
  addSpinner,
  removeSpinner,
  addErrorMessageButton,
  removeErrorMessageButton,
} from "../../modules/bcd-ui.js";
import { TimeoutError } from "../../modules/TimeoutError.js";

async function main() {
  const chartDivIds = ["airport-passengers"];
  const STATBANK_BASE_URL = "/api/themes/transport";
  const TABLE_CODE = "TAQ01";

  try {
    addSpinner(
      "chart-" + chartDivIds[0],
      `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Passengers by Airports</i>`
    );
    const json = await fetchJsonFromUrlAsyncTimeout(STATBANK_BASE_URL);
    if (json) {
      removeSpinner("chart-" + chartDivIds[0]);
    }

    const dataset = JSONstat(json).Dataset(0);
    const dimensions = dataset.Dimension().map((dim) => dim.label);
    const categoriesAirport = dataset
      .Dimension(fixLabel(dimensions[2]))
      .Category()
      .map((c) => c.label);
    const categoriesStat = dataset
      .Dimension(fixLabel(dimensions[0]))
      .Category()
      .map((c) => c.label);

    const airportPassengersTable = dataset.toTable(
      { type: "arrobj" },
      (d, i) => {
        if (
          (d[fixLabel("Statistic")] === categoriesStat[0] ||
            d[fixLabel("Statistic")] === categoriesStat[2]) &&
          hasCleanValue(d)
        ) {
          d.date = convertQuarterToDate(d[fixLabel("Quarter")]);
          d.label = d[fixLabel("Quarter")];
          d.value = +d.value;
          d.Statistic = getTraceName(d[fixLabel("Statistic")]);
          return d;
        }
      }
    );

    const airportPassengers = {
      elementId: "chart-" + chartDivIds[0],
      data: airportPassengersTable,
      tracenames: [categoriesStat[0], categoriesStat[2]],
      tracekey: dimensions[0],
      xV: "date",
      yV: "value",
      tX: "Year",
      tY: "Passengers (Number)",
      formaty: "hundredThousandsShort",
      // Adding options for interactive legend and data highlights
      options: {
        legend: {
          display: true,
          position: "bottom",
          onClick: (e, legendItem) => {
            const index = legendItem.datasetIndex;
            const ci = airportPassengersChart.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden =
              meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          },
        },
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: "2020Q2",
              borderColor: "red",
              borderWidth: 2,
              label: {
                content: "COVID-19 Impact",
                enabled: true,
                position: "top",
              },
            },
          ],
        },
      },
    };

    const airportPassengersChart = new BCDMultiLineChart(airportPassengers);

    const redraw = () => {
      airportPassengersChart.drawChart();
      airportPassengersChart.addTooltip("Airport passengers in ", "", "label");
      airportPassengersChart.showSelectedLabelsY([3, 6, 9]);

      const labelsToShow = airportPassengersTable.map((d, i) => i);
      airportPassengersChart.showSelectedLabelsX(labelsToShow);
    };

    redraw();

    window.addEventListener("resize", () => {
      redraw();
    });

    // Adding event listeners for additional user interaction
    document.getElementById("filter-year").addEventListener("change", (e) => {
      const selectedYear = e.target.value;
      const filteredData = airportPassengersTable.filter(
        (d) => d.date.getFullYear() === parseInt(selectedYear)
      );
      airportPassengersChart.updateData(filteredData);
      redraw();
    });
  } catch (e) {
    console.log("Error creating airport pax chart");
    console.log(e);

    removeSpinner("chart-" + chartDivIds[0]);
    // const eMsg = e instanceof TimeoutError ? e : "An error occurred";
    // const errBtnID = addErrorMessageButton("chart-" + chartDivIds[0], eMsg);
    d3.select(`#${errBtnID}`).on("click", function () {
      removeErrorMessageButton("chart-" + chartDivIds[0]);
      main();
    });
  }
}

const fixLabel = function (l) {
  const labelMap = {
    Statistic: "STATISTIC",
    Quarter: "TLIST(Q1)",
    "Airports in Ireland": "C02935V03550",
  };
  return labelMap[l] || l;
};

const getTraceName = function (s) {
  const SHORTS = {
    Passengers: "Passenger Count",
    "Passengers Trend": "Trend",
    "Passengers (Seasonally Adjusted)": "Seasonally Adj.",
  };

  return SHORTS[s] || s;
};

export { main };
