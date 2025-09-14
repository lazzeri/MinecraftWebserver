function sleep(milliseconds) {
  if (milliseconds < 0)
    return new Promise((resolve) => {
      resolve();
    });

  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

String.prototype.startsWith = function (searchString) {
  return this.slice(0, searchString.length) === searchString;
};

String.prototype.replaceAll = function (search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function noDelaySetInterval(func, interval) {
  func();
  return setInterval(func, interval);
}

function scrollToTop() {
  $([document.documentElement, document.body]).animate(
    {
      scrollTop: 0,
    },
    500,
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function numberWithCommas(num) {
  const lookup = [
    {
      value: 1,
      symbol: '',
    },
    {
      value: 1e3,
      symbol: 'k',
    },
    {
      value: 1e6,
      symbol: 'M',
    },
    {
      value: 1e9,
      symbol: 'G',
    },
    {
      value: 1e12,
      symbol: 'T',
    },
    {
      value: 1e15,
      symbol: 'P',
    },
    {
      value: 1e18,
      symbol: 'E',
    },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(1).replace(rx, '$1') + item.symbol : '0';
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function hasCommonElementsInArrays(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item));
}

function getDistinctAttributesForType(array, type) {
  return [...new Set(array.map((item) => item[type]))];
}

function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function createLoadingSpinnerForButton(spinnerElem, textElem) {
  //This just removes the node rather then all in it
  textElem
    .contents()
    .filter(function () {
      return this.nodeType === 3;
    })
    .each(function () {
      this.textContent = '';
    });

  spinnerElem.show();
}

function removeLoadingSpinnerForButton(spinnerElem, textElem, text) {
  spinnerElem.hide();
  textElem.text(text);
}

function basicToatrError(errorMsg) {
  toastr.error(errorMsg, 'ERROR', { timeOut: 8000 });
  console.log(errorMsg.toString().red);
}

function basicToatrSuccess(input) {
  toastr.success(input, 'SUCCESS', { timeOut: 8000 });
}

function getRandomArrayItem(array) {
  if (!array || array.length === 0) {
    console.log('Array empty');
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

function randomIntNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntWithSeed(seed, min, max) {
  // min and max included
  return Math.floor(new Math.seedrandom(seed)() * (max - min + 1) + min);
}

function randomFloatNumber(min, max) {
  return Math.random() * max + min; // returns a random integer from 1 to 100
}

Array.prototype.remove = function () {
  let what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

Array.prototype.containsObjectWithValue = function (objectAttr, value) {
  return (
    this.filter((elem) => {
      return elem[objectAttr] === value;
    }).length > 0
  );
};

Array.prototype.updateArrayObjectThatHasAValueWithValue = function (
  attribute,
  attributeValue,
  newValue,
) {
  return this.map((obj) =>
    obj[attribute] === attributeValue
      ? {
          ...obj,
          [attribute]: newValue,
        }
      : obj,
  );
};

Array.prototype.addAttributeToObjectInArrayWithASpecificAttribute = function (
  attribute,
  attributeValueEqual,
  otherAttribute,
  newValue,
) {
  return this.map((obj) =>
    obj[attribute] === attributeValueEqual
      ? {
          ...obj,
          [otherAttribute]: newValue,
        }
      : obj,
  );
};

Array.prototype.filterOutObjectWithValue = function (objectAttr, value) {
  return this.filter((elem) => {
    return elem[objectAttr] === value;
  })[0];
};

Array.prototype.hasDuplicates = function () {
  let valuesSoFar = Object.create(null);
  for (let i = 0; i < this.length; ++i) {
    let value = this[i];
    if (value in valuesSoFar) {
      return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
};

Array.prototype.includesInLowerCase = function (input) {
  for (let i = 0; i < this.length; ++i) {
    let value = this[i];
    if (value.toLowerCase() === input.toLowerCase()) {
      return true;
    }
  }
  return false;
};

function toAfterCommaX(num, x) {
  let result = Math.round(num * 1000) / 1000;
  return result.toFixed(x);
}

function createLoadingScreen(text) {
  let div = document.createElement('div');
  div.id = 'loader';
  div.classList.add('loader');
  div.classList.add('loader-default');
  div.classList.add('is-active');
  div.setAttribute('data-text', text);
  document.body.appendChild(div);
}

function createStreamNowIntro() {
  return new Promise((resolve) => {
    let div = document.createElement('div');
    div.classList.add('streamNowIntro');
    div.id = 'streamNowIntro';
    div.classList.add('streamNowIntro-default');
    div.classList.add('is-active');
    let intro = $('<div id="streamNowIntroLogo"> </div>');
    $(div).append(intro);
    $(div).append('<div id="introProgress"></div>');

    document.body.appendChild(div);
    updateIntroPercentage(0, 0);
    $('#introProgress').hide();
    intro
      .animate(
        { marginTop: '15%' },
        {
          duration: 1000,
          queue: false,
        },
      )
      .animate(
        { opacity: '1' },
        {
          duration: 2000,
          complete() {
            $('#introProgress').show();
            resolve();
          },
        },
      );
  });
}

function updateIntroPercentage(percentage, duration) {
  return new Promise(async (resolve) => {
    if (typeof lineProgressBarExists !== 'undefined')
      $('#introProgress').LineProgressbar({
        percentage: percentage,
        ShowProgressCount: false,
        fillBackgroundColor: '#74CCD4',
        radius: '50px',
        height: '20px',
        duration: duration,
      });
    await sleep(duration);
    resolve();
  });
}

function removeStreamNowIntro(callBack) {
  $('#introProgress').animate({ opacity: '0' }, { duration: 500 });
  $('#streamNowIntroLogo')
    .animate(
      {
        marginTop: '40%',
        opacity: '0',
      },
      { duration: 500 },
    )
    .animate(
      { opacity: '0' },
      {
        duration: 300,
        complete() {
          $('.streamNowIntro').animate(
            { opacity: '0' },
            {
              duration: 250,
              complete() {
                $('.streamNowIntro').remove();
                if (typeof callBack === 'function') callBack();
              },
            },
          );
        },
      },
    );
}

function removeLoadingScreen() {
  $('div').remove('#loader');
}

function notificationPopUp(input, type) {
  if (type.includes('success')) {
    toastr.success(input, 'SUCCESS', { timeOut: 8000 });
  } else {
    toastr.error(input, 'ERROR', { timeOut: 8000 });
  }
}

function getUserPicture(userId, $userPic) {
  return new Promise((resolve) => {
    $userPic.attr('src', 'https://ynassets.younow.com/user/live/' + userId + '/' + userId + '.jpg');
    $userPic.attr('onerror', "this.onerror=null;this.src='/images/icon-user.svg';");
    resolve();
  });
}

function shortenName(name, maxLength) {
  if (name.length > maxLength - 2) {
    name = name.substr(0, maxLength - 2) + '..';
  }

  return name;
}

function downloadObjectAsJson(exportObj) {
  let data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
  $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo(document.body);
}

function downloadAsFile(exportObj) {
  let data = 'text/json;charset=utf-8,' + encodeURIComponent(exportObj);
  $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo(document.body);
}

function arrayIsEmpty(arr) {
  if (!arr) return true;

  return arr.length === 0;
}

function roundTo1Decimal(num) {
  return Math.round(num * 10) / 10;
}

function roundTo2Decimal(num) {
  return Math.round(num * 100) / 100;
}

function allEmojis() {
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFE])|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])?|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]/g;
}

function numberArrayStringToArray(input) {
  let foundNums = [];

  if (!input || input === '[]') return [];

  input.match(/[0-9]+/g).forEach((user) => {
    foundNums.push(user);
  });
  return foundNums;
}

function createDate() {
  let date = new Date(Date.now());
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds()
  );
}

function isInTestingPhase() {
  return new URLSearchParams(window.location.search).get('isTesting') === 'true';
}

function updateObj(toolToObj, update) {
  return $.extend(true, toolToObj, update);
}

function isJson(str) {
  if (typeof str === 'object') return true;

  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function convertCheckBoxInputToBoolean(input) {
  if (input === 'on') return true;
  else return input;
}

function getHourlyAverage(seconds, input) {
  let minutes = secondsToMinutes(seconds);
  if (minutes <= 60) return input;
  return Math.round(input / (minutes / 60));
}

let averageOfArray = (array) => {
  if (array.length === 0) return 0;

  return array.reduce((a, b) => a + b) / array.length;
};

function setToMonday(date) {
  let day = date.getDay() || 7;
  if (day !== 1) date.setHours(-24 * (day - 1));
  return date;
}

function toTimestamp(strDate) {
  let datum = Date.parse(strDate);
  return datum / 1000;
}

function timeStampToDate(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let time = date + ' ' + month + ' ' + year;
  return time;
}

function timeStampToTime(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let hour = a.getHours();
  let min = a.getMinutes();
  return addZeroIf1Digit(hour) + ':' + addZeroIf1Digit(min);
}

function secondsToTime(seconds) {
  // 2- Extract hours:
  let hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return hours + ' hours ' + addZeroIf1Digit(minutes) + ' minutes';
}

function secondsToTimeClean(seconds) {
  // 2- Extract hours:
  let hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return hours + ':' + addZeroIf1Digit(minutes);
}

function secondsToMinutes(seconds) {
  return parseInt(seconds / 60); // 60 seconds in 1 minute
}

function addZeroIf1Digit(input) {
  if (input.toString().length === 1) {
    return '0' + input;
  } else return input;
}

function trueFalseToYesNo(input) {
  if (input) return 'Yes';
  else return 'No';
}

jQuery.fn.textNodes = function () {
  return this.contents().filter(function () {
    return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== '';
  });
};

function youtubeAlert(url) {
  alertify.YoutubeDialog(url).set({
    frameless: false,
    pinnable: false,
    modal: true,
    onclose: function () {},
  });
  //show the dialog
}

function isHigherOrEqualThan0(num) {
  return !isNaN(num) && num >= 0;
}

alertify.YoutubeDialog ||
  alertify.dialog('YoutubeDialog', function () {
    let iframe;
    return {
      // dialog constructor function, this will be called when the user calls alertify.YoutubeDialog(videoId)
      main: function (videoId) {
        //set the videoId setting and return current instance for chaining.
        return this.set({
          videoId: videoId,
        });
      },
      // we only want to override two options (padding and overflow).
      setup: function () {
        return {
          options: {
            //disable both padding and overflow control.
            padding: !1,
            overflow: !1,
          },
        };
      },
      // This will be called once the DOM is ready and will never be invoked again.
      // Here we create the iframe to embed the video.
      build: function () {
        // create the iframe element
        iframe = document.createElement('iframe');
        iframe.frameBorder = 'no';
        iframe.width = '100%';
        iframe.height = '100%';
        // add it to the dialog
        this.elements.content.appendChild(iframe);

        //give the dialog initial height (half the screen height).
        this.elements.body.style.minHeight = screen.height * 0.5 + 'px';
      },
      // dialog custom settings
      settings: {
        videoId: undefined,
      },
      // listen and respond to changes in dialog settings.
      settingUpdated: function (key, oldValue, newValue) {
        switch (key) {
          case 'videoId':
            iframe.src = 'https://www.youtube.com/embed/' + newValue + '?enablejsapi=1';
            break;
        }
      },
      // listen to internal dialog events.
      hooks: {
        // triggered when the dialog is closed, this is seperate from user defined onclose
        onclose: function () {
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*',
          );
          scrollToTop();
        },
        // triggered when a dialog option gets update.
        // warning! this will not be triggered for settings updates.
        onupdate: function (option, oldValue, newValue) {
          switch (option) {
            case 'resizable':
              if (newValue) {
                this.elements.content.removeAttribute('style');
                iframe && iframe.removeAttribute('style');
              } else {
                this.elements.content.style.minHeight = 'inherit';
                iframe && (iframe.style.minHeight = 'inherit');
              }
              break;
          }
        },
      },
    };
  });

//With this we can add to date objects hours
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

Date.prototype.removeHours = function (h) {
  this.setTime(this.getTime() - h * 60 * 60 * 1000);
  return this;
};

Date.prototype.addMinutes = function (h) {
  this.setTime(this.getTime() + h * 60 * 1000);
  return this;
};

Date.prototype.removeMinutes = function (h) {
  this.setTime(this.getTime() - h * 60 * 1000);
  return this;
};

Date.prototype.addSeconds = function (h) {
  this.setTime(this.getTime() + h * 1000);
  return this;
};

Date.prototype.removeSeconds = function (h) {
  this.setTime(this.getTime() - h * 1000);
  return this;
};

const getRainbowHexArray = function () {
  let size = 12;
  let rainbow = new Array(size);

  for (let i = 0; i < size; i++) {
    let red = sin_to_hex(i, (0 * Math.PI * 2) / 3); // 0   deg
    let blue = sin_to_hex(i, (1 * Math.PI * 2) / 3); // 120 deg
    let green = sin_to_hex(i, (2 * Math.PI * 2) / 3); // 240 deg

    rainbow[i] = '#' + red + green + blue;
  }

  function sin_to_hex(i, phase) {
    let sin = Math.sin((Math.PI / size) * 2 * i + phase);
    let int = Math.floor(sin * 127) + 128;
    let hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  }

  return rainbow;
};

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

function changeAlphaFromColor(color, change) {
  // Get all color components (alpha may not be there if = 1):
  const parts = color.match(/[\d.]+/g);

  // If alpha is not there, add it:
  if (parts.length === 3) {
    parts.push(1);
  }

  // Modify alpha:
  parts[3] = change;

  // Apply new value:
  return `rgba(${parts.join(',')})`;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function hexToRgb(hex) {
  hex = hex.replaceAll('#', '');
  var arrBuff = new ArrayBuffer(4);
  var vw = new DataView(arrBuff);
  vw.setUint32(0, parseInt(hex, 16), false);
  var arrByte = new Uint8Array(arrBuff);

  return 'rgb(' + arrByte[1] + ',' + arrByte[2] + ',' + arrByte[3] + ')';
}

function lightenDarkenColor(col, amt) {
  col = col.replaceAll('#', '');
  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;
  var b = ((num >> 8) & 0x00ff) + amt;
  var g = (num & 0x0000ff) + amt;
  var newColor = g | (b << 8) | (r << 16);
  return newColor.toString(16);
}

function csvJSON(csv) {
  var lines = csv.split('\n');

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers = lines[0].split(',');

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

//ENGLISH WEIRD VERSION
function numberWithDotsForNumbers(x) {
  if (x === null) return 0;

  if (x === undefined) return 0;

  x = x.toString().replace(/\D/g, '');
  if (isNaN(parseInt(x))) return 0;

  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts[0];
}

const arrayEqualsArray = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function randomizeArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function randomizeArrayWithSeed(array, seed) {
  return array.sort(() => 0.5 - new Math.seedrandom(seed)());
}

let fixCommentNumberWithKorM = (comment) => {
  if (comment.startsWith('!K') || comment.startsWith('!M')) return comment;

  if (comment.endsWith('K')) {
    if (comment.includes('.')) return comment.replace(/\./g, '').slice(0, -1) + '00';

    return comment.slice(0, -1) + '000';
  }

  if (comment.endsWith('M')) {
    if (comment.includes('.')) return comment.replace(/\./g, '').slice(0, -1) + '00000';

    return comment.slice(0, -1) + '000000';
  }

  return comment;
};

function repeatFunctionXTimes(func, times) {
  func();
  times && --times && repeatFunctionXTimes(func, times);
}

function loopAudioSound(url) {
  const audio = new Audio(url);
  audio.play();
  audio.addEventListener(
    'ended',
    function () {
      console.log('ENDED SOUND');
      this.currentTime = 0;
      this.play();
    },
    false,
  );
}

async function playAudio(url, volume = 1, callback = 0) {
  const audio = new Audio(url);
  audio.volume = volume;
  await audio.play();
  if (callback) {
    callback();
  }
}

function addToCopyLineWithBody(textToCopy) {
  //Copies the text into the copy clipboard

  // create a text element
  const textEl = document.createElement('textarea');
  textEl.value = textToCopy;

  // append to body
  document.body.appendChild(textEl);

  // copy to clipboard
  textEl.select();
  document.execCommand('copy');

  // remove text element
  document.body.removeChild(textEl);
}
