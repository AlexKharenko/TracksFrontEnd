/* eslint-disable no-unused-vars */
import router from "@/router";

const state = {
  genres: [],
};

const getters = {
  getGenres: (state) => state.genres,
};

const actions = {
  clearGenresState({ state }) {
    state.genres = [];
  },
  async fetchGenres({ commit }) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/genres`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 200) {
      response = await response.json();
      commit("setGenres", response.data);
    } else {
      if (response.status === 404) {
        response = await response.json();
        commit("setGenres", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async fetchGenreById({ commit }, { id }) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/genres/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 200) {
      response = await response.json();
      return response.data;
    } else {
      if (response.status === 404) {
        return "";
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async createGenre({ state }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/genres/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ genre: data }),
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
      state.genres.push(data);
      return response;
    } else {
      if (response.status >= 500) {
        router.push("/505");
        return;
      }
      response = await response.json();
      return response;
    }
  },
  async updateGenre({ state }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/genres/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ genre: data }),
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
      var foundIndex = state.genres.findIndex(
        (x) => x.genre_id == data.genre_id
      );
      state.genres[foundIndex].genre_name = data.genre_name;
      return response;
    } else {
      if (response.status >= 500) {
        router.push("/505");
        return;
      }
      response = await response.json();
      return response;
    }
  },
};

const mutations = {
  setGenres: (state, genres) => (state.genres = genres),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
