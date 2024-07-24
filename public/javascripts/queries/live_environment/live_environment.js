/* Cork

water levels region_id: 6, 15

*/
'use strict'

import { fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { getCityLatLng, getCustomMapMarker, getCustomMapIcon } from '../../modules/bcd-maps.js'

(async function main (waterLevelsOptions) {
  waterLevelsOptions =
  {
    title: 'Water Level Monitors',
    subtitle: '',
    id: '',
    icon: '/images/icons/themes/environment/water-15.svg#Layer_1',
    info: '',
    source: [
      {
        href: 'https://data.corkcity.ie/dataset/parking/resource/6cc1028e-7388-4bc5-95b7-667a59aa76dc',
        name: 'Cork Smart Gateway',
        target: '_blank'
      }],
    displayOptions: {
      displayid: 'car-parks-card__display',
      data: {
        href: '/api/waterLevels/'
      },
      src: '',
      format: ''
    }
  }

  /************************************
   * OPW Water Levels
   ************************************/

  // const STAMEN_TERRAIN_URL = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
  const STAMEN_TERRAIN_URL = 'https://tiles-eu.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}@2x.png' // abhi
  const ATTRIBUTION = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under <a href="https://www.openstreetmap.org/copyright">ODbL</a>.s'

  const liveEnvironmentOSM = new L.TileLayer(STAMEN_TERRAIN_URL, {
    minZoom: 2,
    maxZoom: 20,
    attribution: ATTRIBUTION
  })

  const liveEnvironmentMap = new L.Map('live-environment-map')
  liveEnvironmentMap.setView(getCityLatLng(), 8)
  liveEnvironmentMap.addLayer(liveEnvironmentOSM)

  // Custom map icons
  const waterMapIcon = L.icon({
    iconUrl: '../images/icons/themes/environment/water-15.svg#Layer_1',
    iconSize: [15, 15] // orig size
    // iconAnchor: [iconAX, iconAY] //,
    // popupAnchor: [-3, -76]
  })

  const waterLevelsIconUrl = '../images/icons/themes/environment/water-15.svg#Layer_1'
  const CustomMapIcon = getCustomMapIcon()

  // Adds an id field to the markers
  const CustomMapMarker = getCustomMapMarker()

  const customCarparkLayer = L.Layer.extend({

  })

  const waterLevelsLayerGroup = L.layerGroup()

  const waterLevelsPopupOptions = {
    // 'maxWidth': '500',
    className: 'waterLevelsPopup'
  }

  // addSpinner('chart-' + chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Annual Rate of Population Increase</i>`)

  //   const refreshInterval = 100
  //   let refreshCountdown = refreshInterval

  const TIMEOUT_INTERVAL = 10000 // interval after which request generates a TO error
  const RETRY_INTERVAL = 2000000 // interval to wait after an error response
  const REFRESH_INTERVAL = 1000 * 60 * 10 // n minute interval for data refresh
  let refreshTimeout
  let waterOPWCluster

  async function fetchData () {
    let json
    clearTimeout(refreshTimeout)
    try {
      // json = await fetchJsonFromUrlAsyncTimeout('/data/environment/waterlevel_example.json', TIMEOUT_INTERVAL)
      
      // ******Abhi
      const json = await fetchJsonFromUrlAsyncTimeout('/api/water-levels/stations/list', TIMEOUT_INTERVAL)

      // console.log("original", json)
      // console.log("original type", typeof(json))



      // Abhi *******
      const jsonProcessed = await processWaterLevels(json.features)
      // console.log("json Processed", jsonProcessed)


      if (liveEnvironmentMap.hasLayer(waterOPWCluster)) {
        liveEnvironmentMap.removeLayer(waterOPWCluster)
      }
      waterOPWCluster = getLayerWaterLevels(jsonProcessed, waterMapIcon)
      liveEnvironmentMap.addLayer(waterOPWCluster)

      clearTimeout(refreshTimeout)
      refreshTimeout = setTimeout(fetchData, REFRESH_INTERVAL)

      json = null // for GC
      // }
    } catch (e) {
      // TODO: if data is very stale display error msg in popup
      console.log('data fetch error' + e)
      refreshTimeout = setTimeout(fetchData, RETRY_INTERVAL)
    }
  }
  fetchData() // intiiate first run
})()

// abhi, so this is cork data, ok..,.
function processWaterLevels (data_) {


  // console.log("Data in filter", data_);
  // console.log("Type Data in filter", typeof(data_));


  const regionData = data_.filter(function (d) {
    return d.properties.region_id === 15 || d.properties.region_id === 6
  })
  regionData.forEach(function (d) {
    d.lat = +d.geometry.coordinates[1]
    d.lng = +d.geometry.coordinates[0]
    d.type = 'OPW GPRS Station Water Level Monitor'
  })
  return regionData
};

function getLayerWaterLevels (data_, icon_) {
  const CustomMapMarker = getCustomMapMarker()
  const waterOPWCluster = L.markerClusterGroup()

  data_.forEach(function (d, i) {
    const m = new CustomMapMarker(new L.LatLng(d.lat, d.lng), {
      icon: icon_,
      id: d.properties.station_ref
    })
    m.bindPopup(getPopupWaterLevels(d))
    waterOPWCluster.addLayer(m)
    m.on('popupopen', () => {
      getPopupPlotWaterLevels(d)
    })
  })
  return waterOPWCluster
}

function getPopupWaterLevels (d_) {
  const id = d_.properties.station_ref
  // abhi
  const d = new Date(d_.properties.datetime);
  const simpleTime = d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0')
  const simpleDate = d.getDate() + '/' + (d.getMonth() + 1).toString().padStart(2, '0')

  // if no station id none of the mappings will work so escape
  if (!d_.properties.station_name) {
    const str = '<div class="map-popup-error">' +
      "We can't get the live water level data  for this site right now, please try again later" +
      '</div>'
    return str
  }

  let str = '<div class="map-popup">'
  if (d_.properties.station_name) {
    str += '<div id="waterlevel-name-' + id + '" class="map-popup__title">' // id for name div
    str += '<h1>' + d_.properties.station_name + '</h1>'
    str += '</div>'
  }
  str += '<div id="waterlevel-count-' + id + '" class="map-popup__kpi" >'
  if (d_.properties.value) {
    str += '<h1>' +
      d_.properties.value +
      '</h1><p> at ' + simpleTime + ' on ' + simpleDate + ' </p>'
  } else {
    str += '<div class="map-popup-error">' +
      "We can't get the live water level data  for this site right now, please try again later" +
      '</div>'
  }
  str += '</div>'

  if (d_.properties.sensor_ref) {
    str += '<div id="waterlevel-info-' + id + '" class="map-popup__info" >'
    str += '<p>Sensor: ' + d_.properties.sensor_ref + '</p>'
    str += '</div>'
    // initialise div to hold chart with id linked to station ref
    str += '<div id="waterlevel-popup-chart-' + id + '" class="map-popup__chart" ></div>'
  }

  return str
}

async function getPopupPlotWaterLevels (d) {
  // console.log(d.properties.station_ref)
  const divId = `waterlevels-site-${d.properties.station_ref}`


  const str = '<div class="popup-error">' +
    '<div class="row ">' +
    "We can't get the noise monitoring data for this location right now, please try again later" +
    '</div>' +
    '</div>'
  // return d3.select('#bike-spark-' + sid_)
  //   .html(str)
  // document.getElementById(divId + '-plot').innerHTML = str
  return str
}