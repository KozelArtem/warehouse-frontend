const ru = {
  mechanic: 'Механик',
};

const dictionary = {
  ru,
};

const translate = (key, lang = 'ru') => dictionary[lang][key] || key;

export default translate;
