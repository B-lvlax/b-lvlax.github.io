import { generateAdvert } from './advert.js';
import { filterAdverts } from './filter.js';

const MAX_ADVERTS_AMOUNT = 10;

/* MAP
===================================================================== */
const MAIN_ICON = {
  url: 'img/main-pin.svg',
  size: [52, 52],
  anchor: [26, 52],
};

const ADVERT_ICON = {
  url: 'img/pin.svg',
  size: [40, 40],
  anchor: [20, 40],
};

const mapOptions = {
  initialLatLng: {
    lat: 35.69,
    lng: 139.78,
  },
  initialScale: 12,
  limitDecimals: 5,
  bounceOptions: {
    bounceHeight: 90,
    bounceSpeed: 84,
    exclusive: true,
  },
  advertBounceOptions: {
    bounceHeight: 10,
    bounceSpeed: 54,
    exclusive: true,
    elastic: true,
  },
  popupOptions: {
    keepInView: true,
    closeOnEscapeKey: true,
    offset: [0, -40],
  },
};

const map = L.map('map-canvas', { scrollWheelZoom: false })
  .on('click', () => L.Marker.stopAllBouncingMarkers());

const loadMap = (cb) => {
  map.on('load', () => { cb(); }).setView(mapOptions.initialLatLng, mapOptions.initialScale);
};

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/* MARKER
 =================================================================== */
L.Marker.setBouncingOptions(mapOptions.bounceOptions);
const mainMarkerIcon = L.icon({
  iconUrl: MAIN_ICON.url,
  iconSize: MAIN_ICON.size,
  iconAnchor: MAIN_ICON.anchor,
});

const mainMarker = L.marker(mapOptions.initialLatLng, {
  draggable: true,
  riseOnHover: true,
  icon: mainMarkerIcon,
  title: 'Для выбора координат вашего жилья',
}).addTo(map).bounce(2);

/* POPUP
===================================================================== */
const markerGroup = L.layerGroup().addTo(map);
let popupCloseBtn;

const generateAdvertPopup = (info) => {
  const advertMarkerIcon = L.icon({
    iconUrl: ADVERT_ICON.url,
    iconSize: ADVERT_ICON.size,
    iconAnchor: ADVERT_ICON.anchor,
  });

  const advertMarker = L.marker({
    lat: info.location.lat,
    lng: info.location.lng,
  }, {
    clickable: true,
    riseOnHover: true,
    icon: advertMarkerIcon,
  });

  advertMarker
    .addTo(markerGroup)
    .bindPopup(generateAdvert(info), mapOptions.popupOptions)
    .setBouncingOptions(mapOptions.advertBounceOptions)
    .on('click', () => {
      advertMarker.toggleBouncing();
      popupCloseBtn = document.querySelector('.leaflet-popup-close-button');
      popupCloseBtn.addEventListener('click', () => L.Marker.stopAllBouncingMarkers());
    });

  return advertMarker;
};

const generateSimilarAdvertPopups = (data) => {
  data
    .slice()
    .filter(filterAdverts)
    .slice(0, MAX_ADVERTS_AMOUNT)
    .forEach((advertData) => generateAdvertPopup(advertData));
};

/* ---------------------------------- */

const mapInfos = {
  map: () => map.setView(mapOptions.initialLatLng, mapOptions.initialScale),
  marker: () => mainMarker.setLatLng(mapOptions.initialLatLng),
  address: `${mapOptions.initialLatLng.lat}00, ${mapOptions.initialLatLng.lng}0000`,
  getCurrentMarkerPosition: (field) => {
    mainMarker.on('moveend', (evt) => {
      field.value = `${evt.target.getLatLng().lat.toFixed(mapOptions.limitDecimals)}, ${evt.target.getLatLng().lng.toFixed(mapOptions.limitDecimals)}`;
    });
  },
  clearMarkers: () => markerGroup.clearLayers(),
};

export { mapInfos, generateAdvertPopup, generateSimilarAdvertPopups, loadMap };
