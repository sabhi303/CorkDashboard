import { getPercentageChange, formatHundredThousands, formatEuros } from '../modules/bcd-data.js'

const indicatorUpSymbol = '&#x25B2;'
const indicatorDownSymbol = '&#x25BC;'

function initializeMap(mapId, cardId, corkDataUrl, populationDataUrl, staticDataUrl) {
  Promise.all([
    d3.xml(corkDataUrl),
    d3.json(populationDataUrl),
    d3.json(staticDataUrl)
  ])
    .then(files => {
      const [xml, corkRegionsJson, corkPopulationJson] = files

      // about cork card
      const corkCard = d3.select(`#${cardId}`)
      corkCard.select('#cork__area').text(corkRegionsJson.Cork.AREA)

      const populationYear = 2016
      corkCard.select('#cork__population_year')
        .text(populationYear + '')
      corkCard.select('#cork__population-count').text(formatHundredThousands(corkRegionsJson.Cork.POPULATION[populationYear]) + '')
      corkCard.select('#cork__population-change').text(formatHundredThousands(corkRegionsJson.Cork.POPULATION.change) + '')

      const percentPopChangeCork = getPercentageChange(corkRegionsJson.Cork.POPULATION[populationYear], corkRegionsJson.Cork.POPULATION['2011'])

      const trendText = percentPopChangeCork > 0 ? 
        'an <span class=\'trend-up\'>increase</span> of <span class=\'trend-up\'>' + indicatorUpSymbol + percentPopChangeCork + '%</span>' : 
        'a <span class=\'trend-down\'>decrease</span> of <span class=\'trend-down\'>' + indicatorDownSymbol + Math.abs(percentPopChangeCork) + '%</span>'
      
      corkCard.select('#cork__population-trend-text').html(trendText + '. ')

      const htmlSVG = document.getElementById(mapId)
      if (!htmlSVG) {
        console.error('SVG container element not found')
        return
      }

      const corkZoneMap = xml.documentElement.getElementById('cork-zonemap')
      if (!corkZoneMap) {
        console.error('Cork zonemap element not found in the SVG file')
        return
      }
      htmlSVG.appendChild(corkZoneMap)

      const corkSvg = d3.select(htmlSVG)
      const cityRoot = corkSvg.select('#cork_city')
      const countyRoot = corkSvg.select('#cork_county')

      const xmlSVG = xml.getElementsByTagName('svg')[0]
      if (!xmlSVG) {
        console.error('SVG element not found in the XML document')
        return
      }
      corkSvg.attr('viewBox', xmlSVG.getAttribute('viewBox'))

      const paths = [cityRoot.select('path'), countyRoot.select('path')]
      paths.forEach(p => {
        p.on('mouseover', function () {
          d3.select(this).style('stroke', 'rgba(233, 93, 79, 1.0)')
        })

        p.on('mouseout', function () {
          d3.select(this).style('stroke', 'none')
        })

        p.on('click', function () {
          const parent = d3.select(this.parentNode)
          const regionName = parent.attr('data-name')
          if (!regionName) {
            console.error('data-name attribute not found for the clicked region')
            return
          }
          updateInfoText(corkRegionsJson[regionName], cardId)
          d3.select('#regions-info__cta-arrow').style('display', 'none')
          d3.select('#regions-info__cta').style('display', 'none')
          d3.select(`#${cardId}`).style('display', 'flex').style('visibility', 'visible').style('opacity', 1)
          document.getElementById(cardId).scrollTop = 0
        })
      })
    })
    .catch(e => {
      console.error('Error:', e)
    })
}

function updateInfoText(d, cardId) {
  const percentPopChange = getPercentageChange(d.POPULATION[2016], d.POPULATION['2011'])

  const trendTextPop = percentPopChange > 0 ? 
    'an <span class=\'trend-up\'>increase</span> of <span class=\'trend-up\'>' + indicatorUpSymbol + percentPopChange + '%</span>' : 
    'a <span class=\'trend-down\'>decrease</span> of <span class=\'trend-down\'>' + indicatorDownSymbol + Math.abs(percentPopChange) + '%</span>'


  // I need to change just the following, rest works okay after changes
  d3.select(`#${cardId} #local__title`).html(d.ENGLISH + ' (' + d.GAEILGE + ')')
  d3.select(`#${cardId} #local__text-1`).html(d.TEXT_1)
  d3.select(`#${cardId} #local__area`).html(d.AREA + '. ')
  d3.select(`#${cardId} #local__curPopulation`).html(formatHundredThousands(d.POPULATION['2016']) + '')
  d3.select(`#${cardId} #local__prePopulation`).html(formatHundredThousands(d.POPULATION['2011']) + '')
  d3.select(`#${cardId} #local__PopChange`).html(trendTextPop + '')
  d3.select(`#${cardId} #local__text-2`).html(d.TEXT_2 + '')
}

// Initialize the map with specific IDs and data URLs
initializeMap('map', 'regions-info__card', '/images/home/CorkMap_Unselected.svg', '/data/cork-region-data.json', '../data/static/CNA13.json')

// Added Error Handling: Added checks and error messages to ensure that the elements exist before trying to use them.
// Fixed Event Handling Scope: Ensured that this inside event handlers correctly refers to the SVG elements.
// Simplified Initialization: Kept the initialization straightforward and similar to original working code, while ensuring proper element checks.
// Consolidated Logging: Added consolidated error logging for better debugging.