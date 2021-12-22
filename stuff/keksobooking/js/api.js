const DATA_FROM = 'https://23.javascript.pages.academy/keksobooking/data';
const DATA_TO = 'https://23.javascript.pages.academy/keksobooking';

const getData = (onSuccess, onFail) => {
  fetch(DATA_FROM)
    .then((response) => {
      if (response.ok) { return response.json(); }
    })
    .then((json) => onSuccess(json))
    .catch(() => onFail());
};

const sendData = (onSuccess, onFail, body) => {
  fetch(DATA_TO, { method: 'POST', body: body })
    .then((response) => {
      (response.ok) ? onSuccess(): onFail();
    })
    .catch(() => onFail());
};

export { getData, sendData };
