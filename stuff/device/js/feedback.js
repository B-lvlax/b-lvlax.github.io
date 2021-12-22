'use strict';

const msgFormBtn = document.querySelector('.js-msgFormBtn');
const msgForm = document.querySelector('.js-msgForm');
const msgFormFields = msgForm.querySelectorAll('.js-msgFormField');
const msgFormName = msgFormFields[0];
const msgFormMail = msgFormFields[1];
const msgFormTxt = msgFormFields[2];

let isValid = true;
let storageName = '';
let storageMail = '';
let isStorage = true;

try {
  storageName = localStorage.getItem('name');
  storageMail = localStorage.getItem('mail');
} catch (err) {
  isStorage = false;
}

msgFormBtn.addEventListener('click', function(e) {
  e.preventDefault();
  showModals(msgForm);
  msgForm.setAttribute('novalidate', true);

  if (isStorage) {
    msgFormName.value = storageName;
    msgFormMail.value = storageMail;
    msgFormTxt.focus();
  } else {
    msgFormName.focus();
  }
});

function checkField(field) {
  if (!field.value) {
    field.classList.add('invalid');
    isValid = false;
  } else {
    field.classList.remove('invalid');
    isValid = true;
  }
}

msgForm.addEventListener('submit', function(e) {
  msgFormFields.forEach(function(el) {
    checkField(el);
  });

  if (!isValid) {
    e.preventDefault();
    msgForm.classList.remove('error');
    void msgForm.offsetWidth;
    msgForm.classList.add('error');
  } else {
    if (isStorage) {
      localStorage.setItem('name', msgFormName.value);
      localStorage.setItem('mail', msgFormMail.value);
    }
  }
});
