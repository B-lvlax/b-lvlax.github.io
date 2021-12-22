import { mapInfos, generateSimilarAdvertPopups } from './map.js';

const UPDATE_DELAY = 500;
const DEFAULT_VALUE = 'any';
const FilterPrices = {
  MIDDLE: 10000,
  HIGH: 50000,
};
const FilterValues = {
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high',
};

const filterForm = document.querySelector('.map__filters');
const filterType = filterForm.querySelector('select[name="housing-type"]');
const filterPrice = filterForm.querySelector('select[name="housing-price"]');
const filterRooms = filterForm.querySelector('select[name="housing-rooms"]');
const filterGuests = filterForm.querySelector('select[name="housing-guests"]');
const filterFeatures = filterForm.querySelectorAll('.map__checkbox');

const debounce = (callback, timeoutDelay) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const filterAdverts = (data) => {
  const checkPrice = () => {
    if (filterPrice.value === DEFAULT_VALUE) { return true; }
    if (filterPrice.value === FilterValues.LOW && data.offer.price < FilterPrices.MIDDLE) { return true; }
    if (filterPrice.value === FilterValues.MIDDLE && data.offer.price >= FilterPrices.MIDDLE && data.offer.price < FilterPrices.HIGH) { return true; }
    if (filterPrice.value === FilterValues.HIGH && data.offer.price >= FilterPrices.HIGH) { return true; }
    return false;
  };

  const checkFeatures = () => {
    const checkedFeatures = [];

    filterFeatures.forEach((item) => {
      if (item.checked) { checkedFeatures.push(item.value); }
    });

    if (!data.offer.features) { return false; }

    return checkedFeatures.every((feature) => data.offer.features.includes(feature));
  };

  const fieldStates = {
    type: data.offer.type === filterType.value || filterType.value === DEFAULT_VALUE,
    price: checkPrice(),
    rooms: data.offer.rooms === +filterRooms.value || filterRooms.value === DEFAULT_VALUE,
    guests: data.offer.guests === +filterGuests.value || filterGuests.value === DEFAULT_VALUE,
    features: checkFeatures(),
  };

  if (fieldStates.type && fieldStates.price && fieldStates.rooms && fieldStates.guests && fieldStates.features) {
    return data;
  }
};

const onFilterChange = (data) => {
  filterForm.addEventListener('change', debounce(() => {
    mapInfos.clearMarkers();
    generateSimilarAdvertPopups(data);
  }, UPDATE_DELAY));
};

export { onFilterChange, filterAdverts };
