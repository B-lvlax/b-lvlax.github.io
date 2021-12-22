const advertType = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало',
  hotel: 'Отель',
};

const advertTemplate = document.querySelector('#card').content.querySelector('.popup');

/* PRICE
 =================================================================== */
const fillPrice = (template, field) => {
  const price = template.querySelector('.popup__text--price');
  const priceInfoBlock = document.createElement('span');
  priceInfoBlock.textContent = price.querySelector('span').textContent;
  price.textContent = `${field} `;
  price.appendChild(priceInfoBlock);
};

/* FEATURES
 =================================================================== */
const fillFeatures = (template, array) => {
  const featuresList = template.querySelector('.popup__features');
  const featuresFragment = document.createDocumentFragment();

  if (!array) {
    featuresList.classList.add('hidden');
    return;
  }

  featuresList.innerHTML = '';

  array.forEach((feature) => {
    const li = document.createElement('li');
    li.classList = (`popup__feature popup__feature--${feature}`);
    featuresFragment.appendChild(li);
  });

  featuresList.appendChild(featuresFragment);
};

/* DESCRIPTION
 =================================================================== */
const fillDescription = (template, field) => {
  const description = template.querySelector('.popup__description');

  if (!field) {
    description.classList.add('hidden');
    return;
  }
  description.textContent = field;
};

/* PHOTOS
 =================================================================== */
const fillPhotos = (template, field) => {
  const photosBlock = template.querySelector('.popup__photos');
  const photoTemplate = photosBlock.querySelector('.popup__photo');
  const photosFragment = document.createDocumentFragment();

  if (!field) {
    photosBlock.classList.add('hidden');
    return;
  }

  field.forEach((item) => {
    const clonedPhoto = photoTemplate.cloneNode(true);
    clonedPhoto.src = item;
    photosFragment.appendChild(clonedPhoto);
  });

  photoTemplate.remove();
  photosBlock.appendChild(photosFragment);
};

/* Complete ADVERTS
 =================================================================== */
const generateAdvert = ({ author, offer }) => {
  const newAdvert = advertTemplate.cloneNode(true);

  newAdvert.querySelector('.popup__avatar').src = author.avatar;
  newAdvert.querySelector('.popup__title').textContent = offer.title;
  newAdvert.querySelector('.popup__text--address').textContent = offer.address;
  newAdvert.querySelector('.popup__type').textContent = advertType[offer.type];
  fillPrice(newAdvert, offer.price);
  newAdvert.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  newAdvert.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  fillFeatures(newAdvert, offer.features);
  fillDescription(newAdvert, offer.description);
  fillPhotos(newAdvert, offer.photos);

  return newAdvert;
};

export { generateAdvert };
