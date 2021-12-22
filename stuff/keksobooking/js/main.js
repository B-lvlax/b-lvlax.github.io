import { loadMap, generateSimilarAdvertPopups } from './map.js';
import { enableFormFields } from './form.js';
import { getData } from './api.js';
import { showEventMessage } from './messages.js';
import { onFilterChange } from './filter.js';

const initiateForms = (data) => {
  generateSimilarAdvertPopups(data);
  enableFormFields();
  onFilterChange(data);
};

const onMapLoad = () => {
  getData(
    (json) => initiateForms(json),
    () => showEventMessage('alert'),
  );
};

loadMap(onMapLoad);
