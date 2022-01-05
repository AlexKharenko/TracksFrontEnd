/* eslint-disable no-unused-vars */
import router from "@/router";

const state = {
  artists: [],
};

const getters = {
  getArtists: (state) => state.artists,
};

const actions = {
  clearArtistsState({ state }) {
    state.artists = [];
  },
  async fetchArtists(
    { state, commit, dispatch },
    {
      data = undefined,
      order_by = undefined,
      limitations = undefined,
      more = false,
      returning = false,
    }
  ) {
    if (!more) commit("setArtists", []);
    let url = `${process.env.VUE_APP_SERVER}/artists`;
    let additional_url = "/?";
    if (data != undefined) {
      additional_url += `${Object.keys(data)
        .filter((key) => data[key] !== "")
        .map((key) => `${key}=${data[key]}`)
        .join("&")}&`;
    }
    if (limitations != undefined) {
      additional_url += `limit=${limitations.limit}&offset=${limitations.offset}&`;
    }
    if (order_by != undefined) {
      additional_url += `${order_by.up ? "up&" : ""}${order_by.column}`;
    }
    let response = await fetch(url + additional_url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 200) {
      response = await response.json();
      if (!more) {
        commit("setArtists", response.data);
        if (returning) {
          return {
            no_more:
              state.artists.length < limitations.offset + limitations.limit,
          };
        }
      } else {
        state.artists = [...state.artists, ...response.data];
        return {
          no_more:
            state.artists.length < limitations.offset + limitations.limit,
        };
      }
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setArtists", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setArtists", []);
      }
      if (response.status === 404) {
        if (!more) commit("setArtists", []);
        return { no_more: true };
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
    return {};
  },
  async fetchArtistById({ commit }, { id }) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/artists/${id}`, {
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
  async createArtist({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/artists/create`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
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
  async updateArtist({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/artists/update`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
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
  async deleteArtist({ state }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/artists/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ artist: data }),
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
      state.artists = state.artists.filter(
        (artist) => artist.artist_id != data.artist_id
      );
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
  setArtists: (state, artists) => (state.artists = artists),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
