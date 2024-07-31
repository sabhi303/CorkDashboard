import { fetchJsonFromUrlAsyncTimeout } from "../../modules/bcd-async.js";
import { convertQuarterToDate } from "../../modules/bcd-date.js";
import { BCDMultiLineChart } from "../../modules/BCDMultiLineChart.js";
import {
  addSpinner,
  removeSpinner,
  addErrorMessageButton,
  removeErrorMessageButton,
} from "../../modules/bcd-ui.js";

import { TimeoutError } from "../../modules/TimeoutError.js";

export async function main() {
  const chartDivIds = [
    "employment",
    "labour",
    "ilo-employment",
    "unemployed",
    "ilo-unemployment",
  ];
  const TABLE_CODE = 'QLF08';

  // Initially, set display for each chart div to none
  chartDivIds.forEach(id => d3.select(`#chart-${id}`).style("display", "none"));

  // Explicitly set the display for the charts you want to show initially
  d3.select("#chart-" + chartDivIds[0]).style("display", "block");
  d3.select("#chart-" + chartDivIds[2]).style("display", "block");

  const STATIC_DATA_URL = '/api/themes/economy';

  try {
    addSpinner(
      "chart-" + chartDivIds[0],
      `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`
    );
    addSpinner(
      "chart-" + chartDivIds[2],
      `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Labour Force</i>`
    );

    const json = await fetchJsonFromUrlAsyncTimeout(STATIC_DATA_URL);

    if (json) {
      removeSpinner("chart-" + chartDivIds[0]);
      removeSpinner("chart-" + chartDivIds[2]);
    }

    const parseData = (data, statLabel) => {
      let result = [];
      const quarters = data["Quarter"];
      const regions = data["Region"];
      quarters.forEach((quarter, index) => {
        for (const [region, values] of Object.entries(regions)) {
          result.push({
            Quarter: quarter,
            Region: region,
            value: values[index],
            date: convertQuarterToDate(quarter),
            label: quarter
          });
        }
      });
      return result.filter(d => d.value !== null && d.value !== undefined);
    };

    const employmentData = parseData(json["Persons aged 15 years and over in Employment"], "Persons aged 15 years and over in Employment");
    const unemploymentData = parseData(json["Unemployed Persons aged 15 years and over"], "Unemployed Persons aged 15 years and over");

    // console.log("Employment Data:", employmentData);
    // console.log("Unemployment Data:", unemploymentData);

    const createChart = (elementId, data, traceNames, traceKey, tX, tY, formaty = "") => {
      return new BCDMultiLineChart({
        elementId,
        data,
        tracenames: traceNames,
        tracekey: traceKey,
        xV: "date",
        yV: "value",
        tX,
        tY,
        formaty
      });
    };

    const employedCountChart = createChart("chart-" + chartDivIds[0], employmentData, ["State", "Southern", "South-West"], "Region", "Year", "Persons in Employment");
    const unemployedCountChart = createChart("chart-" + chartDivIds[2], unemploymentData, ["State", "Southern", "South-West"], "Region", "Year", "Unemployed Persons");

    const redraw = () => {
      if (document.querySelector("#chart-" + chartDivIds[0]).style.display !== "none") {
        employedCountChart.drawChart();
        employedCountChart.addTooltip("  ", "", "label");
        employedCountChart.showSelectedLabelsY([4, 8]);
      }
      if (document.querySelector("#chart-" + chartDivIds[2]).style.display !== "none") {
        unemployedCountChart.drawChart();
        unemployedCountChart.addTooltip(" ", "", "label");
        unemployedCountChart.showSelectedLabelsY([3, 6]);
      }
    };
    redraw();

    window.addEventListener("resize", () => {
      redraw();
    });
  } catch (e) {
    console.log("Error creating employment charts");
    console.log(e);

    chartDivIds.forEach(chartId => removeSpinner("chart-" + chartId));

    const eMsg = e instanceof TimeoutError ? e : "An error occurred";
    const errBtnID = addErrorMessageButton("chart-" + chartDivIds[0], eMsg);
    d3.select(`#${errBtnID}`).on("click", function () {
      removeErrorMessageButton("chart-" + chartDivIds[0]);
      main();
    });
  }
}

const getShortLabel = function (s) {
  const SHORTS = {
    "Persons aged 15 years and over in Employment (Thousand)": "Persons in Employment",
    "Unemployed Persons aged 15 years and over (Thousand)": "Unemployed Persons",
    "Persons aged 15 years and over in Labour Force (Thousand)": "Persons in Labour Force",
    "ILO Unemployment Rate (15 - 74 years) (%)": "ILO Unemploy. Rate (%)",
    "ILO Participation Rate (15 years and over) (%)": "ILO Participation Rate (%)",
  };

  return SHORTS[s] || s;
};
