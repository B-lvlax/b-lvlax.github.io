'use strict';

/*===================================================================
  GLOBAL FUNCTIONS
=====================================================================*/

/* VARS
=====================================================================*/
var
  screenMD = 768,
  date = new Date(),
  bodyWidth = document.body.offsetWidth;


/* TESTING
=====================================================================*/
function isNum(elem) {
  var val = elem.innerHTML || elem.value;
  return !isNaN(parseInt(val)) && val !== '' && val !== ' ';
}

window.addEventListener('resize', function() {
  bodyWidth = document.body.offsetWidth;
});

/*===================================================================*/

var isMobile = {
  android: function android() {
    return navigator.userAgent.match(/Android/i);
  },
  blackberry: function blackberry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  ios: function ios() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  opera: function opera() {
    return navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/opr/i) && typeof window.orientation !== "undefined";
  },
  windows: function windows() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function any() {
    return isMobile.android() || isMobile.blackberry() || isMobile.ios() || isMobile.opera() || isMobile.windows();
  }
};


/* EFFECTS
=====================================================================*/
// function bgPrlx(items, sizeX, sizeY, step) {
// var elems = document.querySelectorAll(items);
//
//   if (isMobile.any()) {
//     var scrolledY = Math.round(window.pageYOffset);
//
//     elems.forEach(function(elem) {
//       elem.style.backgroundAttachment = 'scroll';
//       elem.style.backgroundSize = sizeX + ' ' + sizeY;
//       elem.style.backgroundPosition =
//         'center ' +
//         ((scrolledY - Math.round(elem.offsetTop)) / step) + 'px';
//     });
//   }
// }

/*===================================================================*/

// function elemPrlx(e) {
//   var elems = document.querySelectorAll('.js-moveTitle');
//
//   elems.forEach(function(el) {
//     el.parentElement.addEventListener('mousemove', function(e) {
//       if (!isMobile.any() && bodyWidth >= screenMD) {
//         var elem = this.querySelector('.js-moveTitle');
//
//         elem.style.transform =
//         'translate3d(' +
//         (e.clientX / 4 - (elem.offsetWidth / 3)) + 'px, ' +
//         (e.clientY / 8 - (elem.offsetHeight / 2)) + 'px, 0)';
//       }
//     });
//   });
// }


/* MODAL windows
=====================================================================*/
var modal = null,
  modalTitle, modalContent;

function checkListener(e) {
  if (e.target === modal && e.target.classList.contains('active')) return hideModal();
  if (e.keyCode === 27) return hideModal();
}

function showModal() {
  if (modal === null) modal = document.querySelector('.js-modal');

  modalTitle = modal.querySelector('.js-modalTitle');
  modalContent = modal.querySelector('.js-modalContent');

  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');
  modal.classList.add('active');

  modal.querySelector('button[class$="-btnClose"]').addEventListener('click', hideModal);
  if (isMobile.ios()) {
    modal.querySelector('button[class$="-btnClose"]').addEventListener('touchstart', hideModal);
    window.addEventListener('touchend', checkListener);
  }
  window.addEventListener('keydown', checkListener);
  window.addEventListener('click', checkListener);
}

function hideModal() {
  if (modal === null) return;

  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.classList.remove('active');

  modal.querySelector('button[class$="-btnClose"]').removeEventListener('click', hideModal);
  if (isMobile.ios()) {
    modal.querySelector('button[class$="-btnClose"]').removeEventListener('touchstart', hideModal);
    window.removeEventListener('touchend', checkListener);
  }
  window.removeEventListener('keydown', checkListener);
  window.removeEventListener('click', checkListener);

  modal = null;
}


/*===================================================================
  OTHER SCRIPTS ONLOAD
=====================================================================*/
document.addEventListener('DOMContentLoaded', function() {

  if (isMobile.opera()) alert('В браузере Opera Mini сайт может неправильно выглядеть и работать. Если это так - попробуйте воспользоваться другим браузером.');

  // window.onscroll = function() {
  //   bgPrlx('.js-bgPrlx', '100%', '140%', 5);
  // };

  // elemPrlx();


  /* Modals
  =====================================================================*/
  var btnShow = document.querySelectorAll('.js-showModal');
  btnShow.forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      if (e.target.hasAttribute('href')) {
        modal = document.querySelector(e.target.getAttribute('href'));
        showModal();
      }
    });
  });


  /* Responsive tables
  =====================================================================*/
  // (function() {
  //   var
  //     allTr = document.querySelectorAll('.js-table tr'),
  //     labels = [];
  //
  //   allTr.forEach(function(tr) {
  //     var childs = tr.children;
  //
  //     for (var i = 0; i < childs.length; i++) {
  //       if (childs[i].tagName === 'TH') labels.push(childs[i].innerHTML);
  //       else childs[i].dataset.label = labels[i];
  //     };
  //   });
  // })();


  /* Lazy loading
  =====================================================================*/
  (function() {
    var
      lazyLoadItems = document.querySelectorAll('.js-lazy'),
      lazyLoadThrottleTimeout;

    function lazyLoad() {
      if (lazyLoadThrottleTimeout) clearTimeout(lazyLoadThrottleTimeout);

      lazyLoadThrottleTimeout = setTimeout(function() {
        lazyLoadItems.forEach(function(item) {
          if (item.offsetTop < (window.innerHeight + window.pageYOffset)) {
            if (item.tagName !== 'IMG' && item.tagName !== 'IFRAME') item.style.backgroundImage = 'url(' + item.dataset.src + ')';
            item.src = item.dataset.src;
            item.classList.remove('js-lazy');
          }
        });

        if (lazyLoadItems.length === 0) {
          document.removeEventListener('scroll', lazyLoad);
          window.removeEventListener('resize', lazyLoad);
          window.removeEventListener('orientationChange', lazyLoad);
        }
      }, 20);
    }

    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
  })();



  /* Smooth scrolling
  =====================================================================*/
  (function() {
    var anchors = document.querySelectorAll('a[href~="#"]');

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  })();


  /* Button to scroll Up or Down
  =====================================================================*/
  // (function() {
  //   var
  //     btn = document.querySelector('.js-scrollBtn'),
  //     icon = btn.querySelector('svg'),
  //     flag;
  //
  //   icon.style.transform = 'rotate(180deg)';
  //
  //   function setScroll() {
  //     if (scrollThrottleTimeout) clearTimeout(scrollThrottleTimeout);
  //
  //     var scrollThrottleTimeout = setTimeout(function() {
  //       if (window.pageYOffset <= document.body.scrollHeight / 1.75) {
  //         icon.style.transform = 'rotate(180deg)';
  //         flag = true;
  //       } else {
  //         icon.style.transform = 'rotate(0deg)';
  //         flag = false;
  //       }
  //     }, 20);
  //   }
  //
  //   document.addEventListener('scroll', setScroll);
  //
  //   function moveTo(e) {
  //     e.preventDefault();
  //     if (flag) window.scrollBy(0, window.innerHeight);
  //     else window.scrollTo(0, 0);
  //   }
  //
  //   btn.addEventListener('click', moveTo);
  // })();

  (function() {
    var btn = document.querySelector('.js-scrollBtn');

    btn.addEventListener('click', function() {
      window.scrollBy(0, window.innerHeight);
    });
  })();


  /* Calls from link for mobile devices only
  =====================================================================*/
  (function() {
    if (isMobile.any() && bodyWidth <= screenMD) {
      var linksPhone = document.querySelectorAll('.js-linkPhone');

      linksPhone.forEach(function(el) {
        el.href = 'tel:' + el.dataset.phone;
      });
    }
  })();


  /* Nav on side
  =====================================================================*/
  (function() {
    var
      navBlocks = document.querySelectorAll('.js-navBlock'),
      navLinks = document.querySelectorAll('.js-sideNav a');

    function removeClass() {
      navLinks.forEach(function(link) {
        link.classList.remove('active');
      });
    }

    document.addEventListener('scroll', function() {
      navBlocks.forEach(function(block, i) {
        if (window.pageYOffset >= block.offsetTop - window.innerHeight * 0.3) {
          removeClass();
          navLinks[i].classList.add('active');
        }
      });
    });
  })();


  /* Updating year in footer
  =====================================================================*/
  (function() {
    var elem = document.querySelector('.js-year');
    elem.innerHTML = ' ' + date.getFullYear() + ' ';
  })();


  /* Main nav
  =====================================================================*/
  (function() {
    var
      btnShow = document.querySelector('.js-showMenu '),
      btnClose = document.querySelector('.js-closeMenu'),
      menu = document.querySelector('.js-mobMenu'),
      menuItems = menu.querySelectorAll('a, button');

    function checkListener(e) {
      if (e.offsetX < e.target.offsetWidth && menu.classList.contains('active')) return closeMenu();
      if (e.keyCode === 27) return closeMenu();
    }

    function showMenu() {
      menu.classList.add('active');
      btnShow.setAttribute('aria-hidden', true);
      btnClose.removeAttribute('aria-hidden');

      if (isMobile.ios()) menu.addEventListener('touchend', closeMenu);
      window.addEventListener('keydown', checkListener);
      window.addEventListener('click', checkListener);
    }

    function closeMenu() {
      menu.classList.remove('active');
      btnClose.setAttribute('aria-hidden', true);
      btnShow.removeAttribute('aria-hidden');

      if (isMobile.ios()) menu.removeEventListener('touchend', closeMenu);
      window.removeEventListener('keydown', checkListener);
      window.removeEventListener('click', checkListener);
    }

    window.addEventListener('resize', function() {
      if (bodyWidth <= screenMD) btnShow.removeAttribute('aria-hidden');
      else btnShow.setAttribute('aria-hidden', true);
    });

    btnShow.addEventListener('click', showMenu);
    menuItems.forEach(function(item) {
      item.addEventListener('click', closeMenu);
    });
    if (isMobile.ios()) {
      btnShow.addEventListener('touchstart', showMenu);
      btnClose.addEventListener('touchstart', closeMenu);
    }
  })();

});
/*===================================================================
  Forms
=====================================================================*/
'use strict';

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var
      forms = document.querySelectorAll('.js-validate'),
      inputPhones = document.querySelectorAll('.js-inpPhone'),
      resets = document.querySelectorAll('.js-btnReset');

    /*===================================================================*/

    function removeStyles(form) {
      form.classList.remove('formError');
      form.querySelectorAll('input').forEach(function(el) {
        el.classList.remove('fieldError');
        el.classList.remove('fieldValid');
      });
    }

    function addStyles(elem, state) {
      if (state) {
        elem.classList.remove('fieldError');
        elem.classList.add('fieldValid');
        return true;
      } else {
        elem.classList.remove('fieldValid');
        elem.classList.add('fieldError');
        return false;
      }
    }

    inputPhones.forEach(function(el) {
      el.addEventListener('blur', function() {
        if (this.value.length === 10) {
          var x = this.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{2})(\d{2})/);
          this.value = '(' + x[1] + ') ' + x[2] + '-' + x[3] + '-' + x[4];
        }
      });
    });

    /*===================================================================*/

    function showResponse(response) {
      showModal();
      modalTitle.innerHTML = modalTitle.innerHTML;
      modalContent.innerHTML = '<b>' + response + '</b>';
    }

    function sendRequest(someForm) {
      var
        xhr = new XMLHttpRequest(),
        formData = new FormData(someForm);

      if (!xhr) {
        // showResponse('Cannot create an XMLHTTP instance.');
        showResponse('Не удалось установить XMLHTTP соединение.');
        return false;
      }

      xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) showResponse(this.responseText);
          else showResponse(this.responseText);
        }
      };

      xhr.open('POST', 'send.php', true);
      xhr.send(formData);
    }

    /*===================================================================*/

    function checkForm(form, e) {
      e.preventDefault();

      var
        whisperer = form.querySelector('input[hidden]'),
        name = form.querySelector('input[name="name"]'),
        pass = form.querySelector('input[type="password"]'),
        url = form.querySelector('input[type="url"]'),
        mail = form.querySelector('input[type="email"]'),
        phone = form.querySelector('input[type="tel"]'),
        num = form.querySelector('input[type="number"]'),
        date = form.querySelector('input[type="date"]'),
        allFields = [name, pass, url, mail, phone, num, date],
        hasError = [];

      allFields.forEach(function(el) {
        if (el !== null && el.name === 'name') {
          var test = /^([a-zа-яё]+)(\s[a-zа-яё]+)?$/i.test(name.value) && name.value.length >= 3;
          if (!addStyles(el, test)) hasError.push(el);
        }
        if (el !== null && el.type === 'password') {
          var test = /^(?=(?:.*?\d){1})(?=(?:.*?[A-Z]))(?=(?:.*?[a-z]))\w{1,}$/.test(pass.value) && 6 <= pass.value.length;
          if (!addStyles(el, test)) hasError.push(el);
        }
        if (el !== null && el.type === 'url') {
          var test = /^(((https?|ftp)\:\/\/)?([\w-]+\.)?([\w-])+\.(\w)+\/?[\w\?\.\=\&\-\#\+\/]+)$/.test(url.value);
          if (!addStyles(el, test)) hasError.push(el);
        }
        if (el !== null && el.type === 'email') {
          var test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value);
          if (!addStyles(el, test)) hasError.push(el);
        }
        if (el !== null && el.type === 'tel') {
          var test = /^\(\d{3}\)\s\d{3}(\-\d{2}){2}$/.test(phone.value);
          if (!addStyles(el, test)) hasError.push(el);
        }
        if (el !== null && el.type === 'number') {
          var test = /^[\d]+([.|,][\d])?$/.test(num.value) && 3 >= num.value.length; // For it's work well with decimals input must have attribute step.
          if (!addStyles(el, test)) hasError.push(el);
        }
        if (el !== null && el.type === 'date') {
          var test = /^\d{4}(\-\d{2}){2}$/.test(date.value);
          if (!addStyles(el, test)) hasError.push(el);
        }
      });

      if (hasError.length !== 0) form.classList.add('formError');
      else if (whisperer.value.length !== 0) return;
      else sendRequest(form);

      setTimeout(function() {
        form.classList.remove('formError');
      }, 600);
    }

    /*===================================================================*/

    forms.forEach(function(form) {
      form.setAttribute('novalidate', true);
      form.addEventListener('submit', checkForm.bind(form, form));

      resets.forEach(function(reset) {
        reset.addEventListener('click', removeStyles.bind('reset', form));
      });
    });
  });
})();
//# sourceMappingURL=bundle.js.map