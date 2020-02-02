import moment from 'moment';

moment.locale('ru');
const DEFAULT_DATE_FORMAT = 'YYYY.MM.DD';

export const format = (date, formatType = DEFAULT_DATE_FORMAT) => (date ? moment(date).format(formatType) : '');

const sort = (a, b, desc = true) => {
  const dateA = moment(a, DEFAULT_DATE_FORMAT);
  const dateB = moment(b, DEFAULT_DATE_FORMAT);

  return desc ? dateB - dateA : dateA - dateB;
};

export const sortDesc = (a, b) => sort(a, b, true);
export const sortAsc = (a, b) => sort(a, b, false);
