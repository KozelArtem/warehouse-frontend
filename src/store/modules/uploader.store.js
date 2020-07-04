import httpClient from '../../api/httpClient';

const initialState = () => ({
  imageUploading: false,
});

const localState = initialState();

const getters = {
  imageUploading: state => state.imageUploading,
};

const actions = {
  async uploadImage({ commit }, data) {
    const formData = new FormData();
    formData.append('image', data);
    commit('SET_IMAGE_UPLOADING', true);

    const response = await httpClient.post('/upload-image', formData);

    commit('SET_IMAGE_UPLOADING', false);
    return response.data;
  },
  async uploadImages({ commit }, images) {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    commit('SET_IMAGE_UPLOADING', true);

    const response = await httpClient.post('/upload-images', formData);

    commit('SET_IMAGE_UPLOADING', false);
    return response.data;
  },
};

const mutations = {
  SET_IMAGE_UPLOADING(state, value) {
    state.imageUploading = value;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};
