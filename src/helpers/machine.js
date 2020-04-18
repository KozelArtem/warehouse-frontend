import moment from 'moment';

const PERIOD_IN_MONTHS = 12;

const formatService = (service) => {
  if (!service) {
    return {
      class: 'pointer',
      day: '',
      updatable: true,
    };
  }

  if (service.completedAt) {
    return {
      ...service,
      class: 'color-green',
      day: moment(service.completedAt).format('DD'),
      updatable: false,
    };
  }

  if (service.addedAt && moment(service.addedAt).isAfter(moment())) {
    return {
      ...service,
      class: 'color-yellow pointer',
      day: moment(service.addedAt).format('DD'),
      updatable: true,
    };
  }

  return {
    ...service,
    class: 'color-red pointer',
    day: moment(service.addedAt).format('DD'),
    updatable: true,
  };
};

const formatMachine = (machine) => {
  const servicesByMonth = machine.services.reduce((acc, service) => {
    const month = moment(service.completedAt || service.addedAt).month();

    acc[month + 1] = formatService(service);

    return acc;
  }, {});

  new Array(PERIOD_IN_MONTHS).fill(0).forEach((_, i) => {
    servicesByMonth[i + 1] = servicesByMonth[i + 1] || {};
  });

  return {
    ...machine,
    servicesByMonth,
  };
};

const getTechnicalServiceQuery = (year = 2020) => ({
  dateFrom: moment().startOf('year').set('year', year).format(),
  dateTo: moment().endOf('year').set('year', year).format(),
  onlyTO: true,
});

export {
  PERIOD_IN_MONTHS,
  formatMachine,
  getTechnicalServiceQuery,
};
