/***
TODO:
#759
- refactor to use urls from lookup data/realtime-data-sources.json
- convert to thin controller, with application logic in service layer
***/

// const getData = async url => {
//     const fetch = require('node-fetch')
//     try {
//         const response = await fetch(url)
//         const json = await response.json()
//         return json
//     } catch (error) {
//         return console.log(error)
//     }
// }

// // this needs to be changes as this an broken api
// exports.getLatest = async (req, res, next) => {
//     const url = 'http://erc.epa.ie/real-time-air/www/aqindex/aqih_json.php'
//     const response = await getData(url)
//     res.send(response)
// }

// -- my stuff

const getData = async url => {
    const fetch = require('node-fetch')
    try {
        const response = await fetch(url)
        const json = await response.json()
        return json
    } catch (error) {
        return console.log(error)
    }
}

// this needs to be changes as this an broken api
exports.getLatest = async (req, res, next) => {

    // here, I will change this link to get the csv and then let's see how can convert that to the json
    const url = ''
    const response = await getData(url)
    res.send(response)
}

