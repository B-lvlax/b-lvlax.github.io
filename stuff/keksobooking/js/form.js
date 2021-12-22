import { mapInfos, generateSimilarAdvertPopups } from './map.js';
import { sendData } from './api.js';
import { showEventMessage } from './messages.js';
import { getData } from './api.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];
const minTypePrice = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalow: 0,
  hotel: 3000,
};

const infoForm = document.querySelector('.ad-form');
const filterForm = document.querySelector('.map__filters');
const allFormFields = Array.from(infoForm.querySelectorAll('fieldset'))
  .concat(Array.from(filterForm.querySelectorAll('select, fieldset')));

const enableFormFields = () => {
  infoForm.classList.remove('ad-form--disabled');
  filterForm.classList.remove('map__filters--disabled');
  allFormFields.forEach((item) => item.disabled = false);
};

/* TITLE
===================================================================== */
const advertTitle = infoForm.querySelector('input[name="title"]');
const minTitleLength = +advertTitle.getAttribute('minlength');
const maxTitleLength = +advertTitle.getAttribute('maxlength');

const checkAdvertTitle = (evt) => {
  const valueLength = advertTitle.value.length;

  if (advertTitle.validity.valueMissing) {
    advertTitle.setCustomValidity('Обязательное поле');
    advertTitle.classList.add('error--input');
  } else if (valueLength < minTitleLength) {
    advertTitle.setCustomValidity(`Ещё ${minTitleLength - valueLength} симв.`);
    advertTitle.classList.add('error--input');
  } else if (valueLength > maxTitleLength) {
    advertTitle.setCustomValidity(`Удалите лишние ${valueLength - maxTitleLength} симв.`);
    advertTitle.classList.add('error--input');
  } else {
    advertTitle.setCustomValidity('');
    advertTitle.classList.remove('error--input');
  }

  if (evt.type === 'input') { advertTitle.reportValidity(); }
};

const onAdvertTitleInvalid = (evt) => checkAdvertTitle(evt);
const onAdvertTitleInput = (evt) => checkAdvertTitle(evt);

advertTitle.addEventListener('invalid', onAdvertTitleInvalid);
advertTitle.addEventListener('input', onAdvertTitleInput);

/* ADDRESS
===================================================================== */
const advertAddress = infoForm.querySelector('input[name="address"]');

advertAddress.setAttribute('readonly', true);
advertAddress.setAttribute('value', mapInfos.address);
mapInfos.getCurrentMarkerPosition(advertAddress);

/* TYPE and PRICE
===================================================================== */
const advertType = infoForm.querySelector('select[name="type"]');
const advertTypeOptions = Array.from(advertType.querySelectorAll('option'));
const advertPrice = infoForm.querySelector('input[name="price"]');

const onAdvertTypeChange = () => {
  advertTypeOptions.forEach((item) => {
    if (item.selected) {
      advertPrice.placeholder = minTypePrice[item.value];
      advertPrice.min = minTypePrice[item.value];
    }
  });
};

onAdvertTypeChange();
advertType.addEventListener('change', onAdvertTypeChange);

/* PRICE
------------------------------------ */
const checkAdvertPrice = (evt) => {
  const minPrice = +advertPrice.getAttribute('min');
  const maxPrice = +advertPrice.getAttribute('max');
  const currentValue = +advertPrice.value;

  if (advertPrice.validity.valueMissing) {
    advertPrice.setCustomValidity('Обязательное поле');
    advertPrice.classList.add('error--input');
  } else if (advertPrice.validity.rangeUnderflow) {
    advertPrice.setCustomValidity(`Цена может быть равна или больше ${minPrice}`);
    advertPrice.classList.add('error--input');
  } else if (advertPrice.validity.rangeOverflow) {
    advertPrice.setCustomValidity(`Цена больше ${maxPrice} на ${currentValue - maxPrice}`);
    advertPrice.classList.add('error--input');
  } else {
    advertPrice.setCustomValidity('');
    advertPrice.classList.remove('error--input');
  }

  if (evt.type === 'input') { advertPrice.reportValidity(); }
};

const onAdvertPriceInvalid = (evt) => checkAdvertPrice(evt);
const onAdvertPriceInput = (evt) => checkAdvertPrice(evt);

advertPrice.addEventListener('invalid', onAdvertPriceInvalid);
advertPrice.addEventListener('input', onAdvertPriceInput);

/* TIME
===================================================================== */
const advertTimeIn = infoForm.querySelector('select[name="timein"]');
const advertTimeOut = infoForm.querySelector('select[name="timeout"]');

const checkAdvertTime = (evt) => {
  const currentOptions = Array.from(evt.currentTarget.querySelectorAll('option'));
  const targetSelect = (evt.currentTarget === advertTimeIn) ? advertTimeOut : advertTimeIn;
  const targetOptions = Array.from(targetSelect.querySelectorAll('option'));

  currentOptions.forEach((item, ii) => {
    if (item.selected) { targetOptions[ii].selected = true; }
  });
};

const onAdvertTimeInChange = (evt) => checkAdvertTime(evt);
const onAdvertTimeOutChange = (evt) => checkAdvertTime(evt);

advertTimeIn.addEventListener('change', onAdvertTimeInChange);
advertTimeOut.addEventListener('change', onAdvertTimeOutChange);

/* ROOMS and GUESTS
===================================================================== */
const advertRoom = infoForm.querySelector('select[name="rooms"]');
const advertRoomOptions = Array.from(advertRoom.querySelectorAll('option'));
const advertGuest = infoForm.querySelector('select[name="capacity"]');
const advertGuestOptions = Array.from(advertGuest.querySelectorAll('option'));
const advertGuestFirstOption = advertGuestOptions[0];

const advertRoomIndexes = {
  first: 0,
  second: 1,
  third: 2,
  fourth: 3,
};

const enableOptions = (from, length) => {
  for (let ii = from; ii <= length; ii++) {
    advertGuestOptions[ii].disabled = false;
  }
};

const disableOptions = () => advertGuestOptions.forEach((item) => item.disabled = true);

const onAdvertRoomChange = () => {
  advertRoomOptions.forEach((item, index) => {
    if (item.selected) {
      const selectedIndex = advertGuestOptions.findIndex((el) => el.value === item.value);

      switch (index) {
        case advertRoomIndexes.first: {
          disableOptions();
          advertGuestOptions[selectedIndex].disabled = false;
          advertGuestOptions[selectedIndex].selected = true;
          break;
        }
        case advertRoomIndexes.second: {
          disableOptions();
          advertGuestOptions[selectedIndex].selected = true;
          enableOptions(index, 2);
          break;
        }
        case advertRoomIndexes.third: {
          disableOptions();
          advertGuestOptions[selectedIndex].selected = true;
          enableOptions(advertRoomIndexes.first, 2);
          break;
        }
        case advertRoomIndexes.fourth: {
          disableOptions();
          advertGuestOptions[index].disabled = false;
          advertGuestOptions[index].selected = true;
          break;
        }
      }
    }
  });
};

onAdvertRoomChange();
advertRoom.addEventListener('change', onAdvertRoomChange);

/* IMAGES
===================================================================== */
const avatarFileChooser = document.querySelector('input[name="avatar"]');
const avatarPreview = document.querySelector('.ad-form-header__preview img');
const avatarPreviewDefaultImage = avatarPreview.src;
const houseFileChooser = document.querySelector('input[name="images"]');
const housePreview = document.querySelector('.ad-form__photo');
const houseImageSize = {
  width: '70',
  height: '70',
};

const setImgPreview = (from, to) => {
  if (from.name === 'images') {
    const housePreviewImg = document.createElement('img');
    housePreviewImg.width = houseImageSize.width;
    housePreviewImg.height = houseImageSize.height;
    housePreview.appendChild(housePreviewImg);
    to = housePreviewImg;
  }

  from.addEventListener('change', () => {
    const file = from.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      const reader = new FileReader();
      reader.addEventListener('load', () => to.src = reader.result);
      reader.readAsDataURL(file);
    }
  });
};

setImgPreview(avatarFileChooser, avatarPreview);
setImgPreview(houseFileChooser, housePreview);

/* SUBMIT
===================================================================== */
const setInitialFormState = () => {
  infoForm.reset();
  filterForm.reset();
  onAdvertTypeChange();
  onAdvertRoomChange();
  advertGuestFirstOption.removeAttribute('selected');
  avatarPreview.src = avatarPreviewDefaultImage;
  housePreview.innerHTML = '';
  mapInfos.map();
  mapInfos.marker();
  mapInfos.clearMarkers();
  getData(
    (json) => generateSimilarAdvertPopups(json),
    () => showEventMessage('alert'),
  );
};

/* ---------------------------------- */

const onSuccessForm = () => {
  showEventMessage('success');
  setInitialFormState();
};

infoForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const formData = new FormData(evt.target);

  sendData(
    () => onSuccessForm(),
    () => showEventMessage('error'),
    formData,
  );
});

/* RESET
===================================================================== */
const buttonReset = infoForm.querySelector('.ad-form__reset');

buttonReset.addEventListener('click', () => {
  setInitialFormState();
});

export { enableFormFields };
