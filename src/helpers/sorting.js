import moment from 'moment';

const sortByDate = (a, b, desc = false) => {
  if (desc) {
    return moment(a).diff(b);
  }

  return moment(b).diff(a);
};

export default {
  sortByDate,
};
