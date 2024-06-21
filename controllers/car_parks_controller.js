/***
TODO:
#759
- refactor to use urls from lookup data/realtime-data-sources.json
- convert to thin controller, with application logic in service layer
***/

const getData = async url => {
  const fetch = require('node-fetch')
  try {
    const response = await fetch(url)
    const csv = await response.text()
    // console.log(csv)
    return csv
  } catch (error) {
    console.log(error)
    return error
  }
}

exports.getLatest = async (req, res, next) => {
  // const url = 'https://data.corkcity.ie/datastore/dump/6cc1028e-7388-4bc5-95b7-667a59aa76dc'
  const url = 'https://data.corkcity.ie/datastore/dump/f4677dac-bb30-412e-95a8-d3c22134e3c0'
  const response = await getData(url)
  res.send(response)
}

exports.getError = async (req, res, next) => {
  res.send()
}
