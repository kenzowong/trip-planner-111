const mapboxgl = require('mapbox-gl');
const buildMarker = require('./marker.js');
// const data = require('../server/locations')

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2Vuem93b25nODYiLCJhIjoiY2p2Mml4ZmxvMW85YjQ0bTI1d2dhaHJqYyJ9.o3ZXgf5YUqjKekQEHcFJxw';

const home = [-74.017, 40.64]; // NY
// const fullstackCoords = [-87.6320523, 41.8881084] // CHI

const map = new mapboxgl.Map({
  container: 'map',
  center: home,
  zoom: 12, // starting zoom
  style: 'mapbox://styles/mapbox/streets-v10', // mapbox has lots of different map styles available.
});

// const marker = buildMarker(-1, 'activities', home);
// marker.addTo(map);

const storeDropDown = function(placeType, element) {
  let option = document.createElement('option');
  option.textContent = element.name;
  option.value = element.id;
  // console.log(element.place.location);
  option.setAttribute('data-attribute', element.place.location);
  document.getElementById(`${placeType}-choices`).append(option);
};

const loadDropdowns = async function() {
  // console.log(data, 'THIS IS MY DATA I AM HERE');
  try {
    const result = await fetch('/api');
    const data = await result.json();
    data[0].forEach(element => {
      storeDropDown('hotels', element);
    });
    data[1].forEach(element => {
      storeDropDown('restaurants', element);
    });
    data[2].forEach(element => {
      storeDropDown('activities', element);
    });
  } catch (error) {
    console.error(error);
  }
};

loadDropdowns();

//---------------------------------------------------------------------------

let addButtonList = Array.from(document.getElementsByClassName('options-btn'));

addButtonList.forEach(btn => {
  btn.addEventListener('click', addPlace);
});

function addPlace(event) {
  if (event.target.id === 'hotels-add') {
    logPlace('hotels');
  } else if (event.target.id === 'restaurants-add') {
    logPlace('restaurants');
  } else if (event.target.id === 'activities-add') {
    logPlace('activities');
  }
}

function logPlace(place) {
  const placeEle = document.getElementById(`${place}-choices`);
  const selectedPlace = placeEle.options[placeEle.selectedIndex].text;
  const selectedPlaceID = placeEle.options[placeEle.selectedIndex].value;
  // console.log(placeEle.options[placeEle.selectedIndex].getAttribute('data-attribute'));
  const selectedPlaceCoords = placeEle.options[placeEle.selectedIndex]
    .getAttribute('data-attribute')
    .split(',');
  const placeListItem = document.createElement('li');
  placeListItem.appendChild(document.createTextNode(selectedPlace));
  placeListItem.id = place + '-' + selectedPlaceID + '-li';
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.className = 'remove-btn';
  removeBtn.id = place + '-' + selectedPlaceID;
  removeBtn.addEventListener('click', removePlace);
  placeListItem.appendChild(removeBtn);
  document.getElementById(`${place}-list`).append(placeListItem);
  const dynamicMarker = buildMarker(
    selectedPlaceID,
    place,
    selectedPlaceCoords
  );
  dynamicMarker.addTo(map);
  map.flyTo({ center: selectedPlaceCoords, zoom: 15, curve: 2, speed: 0.5 });
}

function removeElement(id) {
  console.log(id);
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
}

function removePlace(event) {
  // console.log(event.target);
  removeElement(event.target.id);
  removeElement(event.target.id + '-marker');
  removeElement(event.target.id + '-li');
  map.flyTo({ center: home, zoom: 15, curve: 2, speed: 0.5 });
}

map.on('load', function() {
  // Add a layer showing the places.
  map.addLayer({
    id: 'places',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              description: "<strong>Kenzo's Home</strong>",
              icon: 'star',
            },
            geometry: {
              type: 'Point',
              coordinates: [-74.017, 40.64],
            },
          },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
          //     icon: 'theatre',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.038659, 38.931567],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>',
          //     icon: 'theatre',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.003168, 38.894651],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href="http://tallulaeatbar.ticketleap.com/2012beachblanket/" target="_blank" title="Opens in a new window">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>',
          //     icon: 'bar',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.090372, 38.881189],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Ballston Arts & Crafts Market</strong><p>The <a href="http://ballstonarts-craftsmarket.blogspot.com/" target="_blank" title="Opens in a new window">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>',
          //     icon: 'art-gallery',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.111561, 38.882342],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year\'s <a href="http://dandiesandquaintrelles.com/2012/04/the-seersucker-social-is-set-for-june-9th-save-the-date-and-start-planning-your-look/" target="_blank" title="Opens in a new window">Seersucker Social</a> bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>',
          //     icon: 'bicycle',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.052477, 38.943951],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Capital Pride Parade</strong><p>The annual <a href="http://www.capitalpride.org/parade" target="_blank" title="Opens in a new window">Capital Pride Parade</a> makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>',
          //     icon: 'star',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.043444, 38.909664],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist <a href="http://www.muhsinah.com" target="_blank" title="Opens in a new window">Muhsinah</a> plays the <a href="http://www.blackcatdc.com">Black Cat</a> (1811 14th Street NW) tonight with <a href="http://www.exitclov.com" target="_blank" title="Opens in a new window">Exit Clov</a> and <a href="http://godsilla.bandcamp.com" target="_blank" title="Opens in a new window">Gods’illa</a>. 9:00 p.m. $12.</p>',
          //     icon: 'music',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.031706, 38.914581],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>A Little Night Music</strong><p>The Arlington Players\' production of Stephen Sondheim\'s  <a href="http://www.thearlingtonplayers.org/drupal-6.20/node/4661/show" target="_blank" title="Opens in a new window"><em>A Little Night Music</em></a> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>',
          //     icon: 'music',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.020945, 38.878241],
          //   },
          // },
          // {
          //   type: 'Feature',
          //   properties: {
          //     description:
          //       '<strong>Truckeroo</strong><p><a href="http://www.truckeroodc.com/www/" target="_blank">Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>',
          //     icon: 'music',
          //   },
          //   geometry: {
          //     type: 'Point',
          //     coordinates: [-77.007481, 38.876516],
          //   },
          // },
        ],
      },
    },
    layout: {
      'icon-image': '{icon}-15',
      'icon-allow-overlap': true,
    },
  });

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'places', function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'places', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'places', function() {
    map.getCanvas().style.cursor = '';
  });
});
