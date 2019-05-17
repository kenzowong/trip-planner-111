const mapboxgl = require('mapbox-gl');
const buildMarker = require('./marker.js');
// const data = require('../server/locations')

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2Vuem93b25nODYiLCJhIjoiY2p2Mml4ZmxvMW85YjQ0bTI1d2dhaHJqYyJ9.o3ZXgf5YUqjKekQEHcFJxw';

const home = [74.017, 40.64]; // NY
// const fullstackCoords = [-87.6320523, 41.8881084] // CHI

const map = new mapboxgl.Map({
  container: 'map',
  center: home,
  zoom: 12, // starting zoom
  style: 'mapbox://styles/mapbox/streets-v10', // mapbox has lots of different map styles available.
});

const marker = buildMarker(-1, 'activities', home);
marker.addTo(map);

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
