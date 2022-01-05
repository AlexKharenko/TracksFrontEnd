const state = {
  data_uploaded: true,
};

const getters = {
  isDataUploaded: (state) => state.data_uploaded,
};

const actions = {
  changeDataUploadStatus({ commit }, data_uploaded) {
    commit("setDataUpload", data_uploaded);
  },
};

const mutations = {
  setDataUpload: (state, data_uploaded) =>
    (state.data_uploaded = data_uploaded),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
