export function initializeMap(mapId, cardId, corkDataUrl, data) {
  Promise.all([
    d3.xml(corkDataUrl),
  ])
    .then(files => {
      const [xml] = files;
      const htmlSVG = document.getElementById(mapId);
      if (!htmlSVG) {
        console.error('SVG container element not found');
        return;
      }

      const corkZoneMap = xml.documentElement.getElementById('cork-zonemap');
      if (!corkZoneMap) {
        console.error('Cork zonemap element not found in the SVG file');
        return;
      }
      htmlSVG.appendChild(corkZoneMap);

      const corkSvg = d3.select(htmlSVG);
      const cityRoot = corkSvg.select('#cork_city');
      const countyRoot = corkSvg.select('#cork_county');

      const xmlSVG = xml.getElementsByTagName('svg')[0];
      if (!xmlSVG) {
        console.error('SVG element not found in the XML document');
        return;
      }
      corkSvg.attr('viewBox', xmlSVG.getAttribute('viewBox'));

      const paths = [cityRoot.select('path'), countyRoot.select('path')];
      paths.forEach(p => {
        p.on('mouseover', function () {
          d3.select(this).style('stroke', 'rgba(233, 93, 79, 1.0)');
        });

        p.on('mouseout', function () {
          d3.select(this).style('stroke', 'none');
        });

        p.on('click', function () {
          const parent = d3.select(this.parentNode);
          const regionName = parent.attr('data-name');
          if (!regionName) {
            console.error('data-name attribute not found for the clicked region');
            return;
          }
          updateInfoText(regionName, cardId, data); // Pass correct region data
          d3.select('#regions-info__cta-arrow').style('display',  'none');
          d3.select('#regions-info__cta').style('display', 'none');
          d3.select(`#${cardId}`).style('display', 'flex').style('visibility', 'visible').style('opacity', 1);
          document.getElementById(cardId).scrollTop = 0;
        });
      });
    })
    .catch(e => {
      console.error('Error:', e);
    });
}

function updateInfoText(regionName, cardId, data) {
  var d;
  data.forEach(element => {
    if (element.id == regionName){
      d = element;
    }
  });
  // Ensure you use correct case for properties (English and GAEILGE)
  d3.select(`#${cardId} #local__title`).html(d.English);
  d3.select(`#${cardId} #irish__title`).html(' (' + d.GAEILGE  + ')');
  d3.select(`#${cardId} #region-info-text`).html(d.description);
}

window.initializeMap = initializeMap;
