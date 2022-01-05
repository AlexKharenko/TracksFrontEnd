const state = {
  delete_popup: false,
  change_role_active: false,
  filter_users_active: false,
  filter_tracks: false,
  create_genre: false,
  update_genre: false,
  create_artist: false,
  update_artist: false,
  create_group: false,
  update_group: false,
  create_album: false,
  update_album: false,
  create_track: false,
  update_track: false,
};

const getters = {
  isDeletePopActive: (state) => state.delete_popup,
  isChangeRolePopActive: (state) => state.change_role_active,
  isFilterUsersPopActive: (state) => state.filter_users_active,
  isFilterTracksPopActive: (state) => state.filter_tracks,
  isCreateGenrePopActive: (state) => state.create_genre,
  isUpdateGenrePopActive: (state) => state.update_genre,
  isCreateArtistPopActive: (state) => state.create_artist,
  isUpdateArtistPopActive: (state) => state.update_artist,
  isCreateGroupPopActive: (state) => state.create_group,
  isUpdateGroupPopActive: (state) => state.update_group,
  isCreateAlbumPopActive: (state) => state.create_album,
  isUpdateAlbumPopActive: (state) => state.update_album,
  isCreateTrackPopActive: (state) => state.create_track,
  isUpdateTrackPopActive: (state) => state.update_track,
};

const actions = {
  changeDeletePopUpActivity({ commit }, status) {
    commit("setDeletePopUpActivity", status);
  },
  changeRolePopUpActivity({ commit }, status) {
    commit("setRolePopUpActivity", status);
  },
  changeFilterUsersPopUpActivity({ commit }, status) {
    commit("setFilterUsersPopUpActivity", status);
  },
  changeFilterTracksPopUpActivity({ commit }, status) {
    commit("setFilterTracksPopUpActivity", status);
  },
  changeCreateGenrePopUpActivity({ commit }, status) {
    commit("setCreateGenrePopUpActivity", status);
  },
  changeUpdateGenrePopUpActivity({ commit }, status) {
    commit("setUpdateGenrePopUpActivity", status);
  },
  changeCreateArtistPopUpActivity({ commit }, status) {
    commit("setCreateArtistPopUpActivity", status);
  },
  changeUpdateArtistPopUpActivity({ commit }, status) {
    commit("setUpdateArtistPopUpActivity", status);
  },
  changeCreateGroupPopUpActivity({ commit }, status) {
    commit("setCreateGroupPopUpActivity", status);
  },
  changeUpdateGroupPopUpActivity({ commit }, status) {
    commit("setUpdateGroupPopUpActivity", status);
  },
  changeCreateAlbumPopUpActivity({ commit }, status) {
    commit("setCreateAlbumPopUpActivity", status);
  },
  changeUpdateAlbumPopUpActivity({ commit }, status) {
    commit("setUpdateAlbumPopUpActivity", status);
  },
  changeCreateTrackPopUpActivity({ commit }, status) {
    commit("setCreateTrackPopUpActivity", status);
  },
  changeUpdateTrackPopUpActivity({ commit }, status) {
    commit("setUpdateTrackPopUpActivity", status);
  },
};

const mutations = {
  setDeletePopUpActivity: (state, activity) => (state.delete_popup = activity),
  setRolePopUpActivity: (state, activity) =>
    (state.change_role_active = activity),
  setFilterUsersPopUpActivity: (state, activity) =>
    (state.filter_users_active = activity),
  setFilterTracksPopUpActivity: (state, activity) =>
    (state.filter_tracks = activity),
  setCreateGenrePopUpActivity: (state, activity) =>
    (state.create_genre = activity),
  setUpdateGenrePopUpActivity: (state, activity) =>
    (state.update_genre = activity),
  setCreateArtistPopUpActivity: (state, activity) =>
    (state.create_artist = activity),
  setUpdateArtistPopUpActivity: (state, activity) =>
    (state.update_artist = activity),
  setCreateGroupPopUpActivity: (state, activity) =>
    (state.create_group = activity),
  setUpdateGroupPopUpActivity: (state, activity) =>
    (state.update_group = activity),
  setCreateAlbumPopUpActivity: (state, activity) =>
    (state.create_album = activity),
  setUpdateAlbumPopUpActivity: (state, activity) =>
    (state.update_album = activity),
  setCreateTrackPopUpActivity: (state, activity) =>
    (state.create_track = activity),
  setUpdateTrackPopUpActivity: (state, activity) =>
    (state.update_track = activity),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
