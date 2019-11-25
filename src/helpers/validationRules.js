const MIN_LENGTH = 2;

const required = value => !!value || 'Поле обязательно для заполнения';

const minLength = value => (!!value && value.length >= MIN_LENGTH)
  || `Минимальная длина должна быть ${MIN_LENGTH} символа`;

const positiveNumber = value => (!!value && value >= 0) || 'Значение должно быть положительным';

module.exports = {
  required,
  minLength,

  positiveNumber,
};
