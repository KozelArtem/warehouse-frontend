import {
  request,
  METHODS,
  buildUrl,
} from './axiosWrapper';

const MACHINES = '/machines';
const MACHINE_BY_ID = '/machines/:machineId';
const MACHINE_SERVICES = '/machines/:machineId/services';
const MACHINE_SERVICE_ID = '/machines/:machineId/services/:id';

const loadMachines = async (query) => {
  try {
    const url = buildUrl(MACHINES, query);

    const response = await request(METHODS.GET, url);
    const count = response.headers['x-total-count'];

    return { data: response.data || [], count };
  } catch (err) {
    return {};
  }
};

const createMachine = async (data) => {
  try {
    const response = await request(METHODS.POST, MACHINES, data);

    return { data: response.data || {} };
  } catch (err) {
    return {};
  }
};

const updateMachine = async (machineId, data) => {
  try {
    const url = MACHINE_BY_ID.replace(':machineId', machineId);
    const response = await request(METHODS.PUT, url, data);

    return { data: response.data || {} };
  } catch (err) {
    return {};
  }
};

const loadMachineInfo = async (machineId, query = {}) => {
  try {
    const url = buildUrl(MACHINE_BY_ID.replace(':machineId', machineId), query);

    const response = await request(METHODS.GET, url);

    return { data: response.data || {} };
  } catch (err) {
    return {};
  }
};

const loadMachineServices = async (machineId, query) => {
  try {
    const url = buildUrl(MACHINE_SERVICES.replace(':machineId', machineId), query);

    const response = await request(METHODS.GET, url);
    const count = response.headers['x-total-count'];

    return { data: response.data || [], count };
  } catch (err) {
    return {};
  }
};

const createMachineService = async (machineId, data) => {
  try {
    const response = await request(METHODS.POST, MACHINE_SERVICES.replace(':machineId', machineId), data);

    return { data: response.data || [] };
  } catch (err) {
    return {};
  }
};

const updateMachineService = async (machineId, id, data) => {
  try {
    const url = MACHINE_SERVICE_ID.replace(':machineId', machineId).replace(':id', id);

    const response = await request(METHODS.PUT, url, data);

    return { data: response.data || [] };
  } catch (err) {
    return {};
  }
};

const deleteMachineService = async (machineId, id) => {
  try {
    const url = MACHINE_SERVICE_ID.replace(':machineId', machineId).replace(':id', id);

    const response = await request(METHODS.DELETE, url);

    return { data: response.data || [] };
  } catch (err) {
    return {};
  }
};


export default {
  loadMachines,
  createMachine,
  updateMachine,
  loadMachineInfo,
  loadMachineServices,
  createMachineService,
  updateMachineService,
  deleteMachineService,
};
