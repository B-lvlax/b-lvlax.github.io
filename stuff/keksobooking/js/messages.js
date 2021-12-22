const FLAG_CLASS = 'error';
const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
const body = document.body;
let elementClass;
let closeEventMessage = null;

const onEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeEventMessage();
  }
};

const onButtonClick = (evt) => {
  evt.preventDefault();
  closeEventMessage();
};

const onWindowClick = () => closeEventMessage();

closeEventMessage = () => {
  const messageElement = document.querySelector(`.${elementClass}`);
  messageElement.remove(messageElement);
  window.removeEventListener('keydown', onEscKeydown);
  document.removeEventListener('click', onWindowClick);
};

const showEventMessage = (elementId) => {
  const messageTemplate = document.querySelector(`#${elementId}`);
  body.appendChild(messageTemplate.content.cloneNode(true));
  const clonedElement = document.querySelector(`.${elementId}`);
  elementClass = clonedElement.className;

  if (elementClass === FLAG_CLASS) {
    const buttonClose = clonedElement.querySelector('.error__button');
    buttonClose.addEventListener('click', onButtonClick);
  }

  window.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onWindowClick);
};

export { showEventMessage };
