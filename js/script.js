const fromText = document.querySelector('.from-text'),
  toText = document.querySelector('.to-text'),
  selectTad = document.querySelectorAll('select'),
  exchangeIcon = document.querySelector('.exchange'),
  translateBtn = document.querySelector('button'),
  icons = document.querySelectorAll('.row i');

selectTad.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected;
    // Выбор перевода с английского на русский по умолчанию
    if (id == 0 && country_code == 'en-GB') {
      selected = 'selected';
    } else if (id == 1 && country_code == 'ru-RU') {
      selected = 'selected';
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML('beforeend', option); // добавление options тег в select тег
  }
});
// взаимодействие с кнопкой смены
exchangeIcon.addEventListener('click', () => {
  // смена textarea и select значений
  let tempText = fromText.value,
    tempLang = selectTad[0].value;

  fromText.value = toText.value;
  selectTad[0].value = selectTad[1].value;

  toText.value = tempText;
  selectTad[1].value = tempLang;
});
// взаимодействие с кнопкой перевода
translateBtn.addEventListener('click', () => {
  let text = fromText.value,
    translateFrom = selectTad[0].value,
    translateTo = selectTad[1].value;

  if (!text) return;
  toText.setAttribute('placeholder', 'Translating...');

  let apiURL = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFrom}|${translateTo}`;
  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute('placeholder', 'Translation');
    })
    .catch((err) => {
      console.log(err);
    });
});
// взаимодействие с иконками воспроизведения и копирования
icons.forEach((icon) => {
  icon.addEventListener('click', ({ target }) => {
    if (target.classList.contains('fa-copy')) {
      if (target.id == 'from') {
        navigator.clipboard.writeText(fromText.value);
      } else if (target.id == 'to') {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == 'from') {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTad[0].value;
      } else if (target.id == 'to') {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTad[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
