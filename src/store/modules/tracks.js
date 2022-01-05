/* eslint-disable no-unused-vars */
import router from "@/router";

const state = {
  tracks: [],
};

const getters = {
  getTracks: (state) => state.tracks,
};

const actions = {
  clearTracksState({ state }) {
    state.tracks = [];
  },
  async fetchTracks(
    { state, commit, dispatch },
    {
      data = undefined,
      order_by = undefined,
      limitations = undefined,
      more = false,
      returning = false,
    }
  ) {
    if (!more) commit("setTracks", []);
    let url = `${process.env.VUE_APP_SERVER}/tracks`;
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
        commit("setTracks", response.data);
        if (returning) {
          return {
            no_more:
              state.tracks.length < limitations.offset + limitations.limit,
          };
        }
      } else {
        state.tracks = [...state.tracks, ...response.data];
        return {
          no_more: state.tracks.length < limitations.offset + limitations.limit,
        };
      }
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setTracks", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setTracks", []);
      }
      if (response.status === 404) {
        if (!more) commit("setTracks", []);
        return { no_more: true };
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
    return {};
  },
  async fetchTrackById({ commit }, { id }) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/tracks/${id}`, {
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
  async createTrack({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/tracks/create`, {
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
  async updateTrack({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/tracks/update`, {
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
  async deleteTrack({ state }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/tracks/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ track: data }),
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
      state.tracks = state.tracks.filter(
        (track) => track.track_id != data.track_id
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
  setTracks: (state, tracks) => (state.tracks = tracks),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
