import { hasCleanValue } from '../modules/bcd-data.js';
import { convertQuarterToDate } from '../modules/bcd-date.js';
import { CardChartLine } from '../modules/CardChartLine.js';
import { fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js';
import { addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../modules/bcd-ui.js';
import { TimeoutError } from '../modules/TimeoutError.js';

export async function main(options) {
  const TABLE_CODE = 'QLF08';
  
  try {
    addSpinner(options.plotoptions.chartid, `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`);

    const json = await fetchJsonFromUrlAsyncTimeout(options.plotoptions.data.href);
    if (json) {
      removeSpinner(options.plotoptions.chartid);
    }

    const parseUnemploymentData = (data) => {
      let result = [];
      const quarters = data["Quarter"];
      const regions = data["Region"];


      
      quarters.forEach((quarter, index) => {
        const value = regions["State"][index];
        if ((value)) {
          result.push({
            Quarter: quarter,
            value: value,
            date: convertQuarterToDate(quarter),
            label: quarter
          });
        }
      });

      return result;
    };

    const unemploymentData = parseUnemploymentData(json["Unemployed Persons aged 15 years and over"]);
    
    // Check if the element exists in the DOM before creating the chart
    const chartElement = document.getElementById(options.plotoptions.chartid);
    if (!chartElement) {
      console.error(`Element with ID ${options.plotoptions.chartid} not found in the DOM.`);
      return;
    }
    
    const createChart = (elementId, data, traceName, tX, tY, formaty = "") => {
      return new CardChartLine({
        elementid: "#" + elementId,
        data: data,
        xvaluename: "date",
        yvaluename: "value",
        dL: 'label'
      });
    };

    const unemploymentChart = createChart(
      options.plotoptions.chartid, 
      unemploymentData, 
      "State", 
      "Year", 
      "Unemployed Persons"
    );

  } catch (e) {
    console.error("Error creating employment card chart", e);

    removeSpinner(options.plotoptions.chartid);

    const eMsg = e instanceof TimeoutError ? "Request timed out" : `An error occurred: ${e.message}`;
    const errBtnID = addErrorMessageButton(options.plotoptions.chartid, eMsg);
    d3.select(`#${errBtnID}`).on("click", function () {
      removeErrorMessageButton(options.plotoptions.chartid);
      main(options);
    });
  }
}
