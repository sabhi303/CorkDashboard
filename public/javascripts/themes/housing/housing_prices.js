import { fetchJsonFromUrlAsyncTimeout } from "../../modules/bcd-async.js";
import { BCDMultiLineChart } from "../../modules/BCDMultiLineChart.js";
import { addSpinner, removeSpinner, addErrorMessageButton } from "../../modules/bcd-ui.js";

async function main() {
  const chartDivId = "housing-price-all";

  d3.select("#chart-" + chartDivId).style("display", "block");

  // Create and append buttons dynamically
  const controlsDiv = d3.select("#chart-" + chartDivId).append("div").attr("id", "controls");

  controlsDiv.append("button")
    .attr("id", "show-all")
    .text("All")
    .on("click", () => drawChart("All Dwelling Types"));

  controlsDiv.append("button")
    .attr("id", "show-apartment")
    .text("Apartment")
    .on("click", () => drawChart("Apartment"));

  controlsDiv.append("button")
    .attr("id", "show-house")
    .text("House")
    .on("click", () => drawChart("House"));

  const parseYearMonth = d3.timeParse("%Y %B");
  const formatMonth = d3.timeFormat("%b %Y"); // Format to "Jan 2022"
  const STATIC_DATA_URL = "../data/static/filtered_data.json";

  try {
    addSpinner(
      "chart-" + chartDivId,
      `<b>statbank.cso.ie</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`
    );

    const json = await fetchJsonFromUrlAsyncTimeout(STATIC_DATA_URL);
    if (json) {
      removeSpinner("chart-" + chartDivId);
    }

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
          return {
            date: parsedDate,
            Statistic: statisticType,
            "RPPI Region": region, 
            "label": month,
            value: values[index]
          };
        })
        .filter((d) => d.date && !isNaN(d.value));
    };

    const drawChart = (dwellingType) => {
      // Transform data for Cork City
      const corkCityData = transformData("Cork City", dwellingType, "Mean Sale Price");
      // Transform data for Cork County
      const corkCountyData = transformData("Cork County", dwellingType, "Mean Sale Price");

      // Combine both datasets
      const combinedData = [...corkCityData, ...corkCountyData];

      // Debugging log to check data transformation
      console.log("Combined Data:", combinedData);

      const chartData = {
        elementId: "chart-" + chartDivId,
        data: combinedData,
        tracenames: ["Cork City", "Cork County"],
        tracekey: "RPPI Region", // Use actual date object for x-axis labels
        xV: "date",
        yV: "value",
        tX: "Year", // Label for x-axis (Year-Month, etc.)
        tY: "Mean Sale Price",
        formaty: "hundredThousandsShort",
      };

      const housingPriceChart = new BCDMultiLineChart(chartData);
      housingPriceChart.drawChart();
      housingPriceChart.addTooltip("Mean Sale Price, ", "", "label");

      window.addEventListener("resize", () => {
        housingPriceChart.drawChart();
      });
    };

    // Initial draw with all dwelling types
    drawChart("All Dwelling Types");
  } catch (e) {
    console.error(e);
    removeSpinner("chart-" + chartDivId);
    addErrorMessageButton("chart-" + chartDivId, e);
  }
}

export { main };
