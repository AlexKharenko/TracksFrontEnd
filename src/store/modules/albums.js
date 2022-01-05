/* eslint-disable no-unused-vars */
import router from "@/router";

const state = {
  albums: [],
};

const getters = {
  getAlbums: (state) => state.albums,
};

const actions = {
  clearAlbumsState({ state }) {
    state.albums = [];
  },
  async fetchAlbums(
    { state, commit, dispatch },
    {
      data = undefined,
      order_by = undefined,
      limitations = undefined,
      more = false,
      returning = false,
    }
  ) {
    if (!more) commit("setAlbums", []);
    let url = `${process.env.VUE_APP_SERVER}/albums`;
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
        commit("setAlbums", response.data);
        if (returning) {
          return {
            no_more:
              state.albums.length < limitations.offset + limitations.limit,
          };
        }
      } else {
        state.albums = [...state.albums, ...response.data];
        return {
          no_more: state.albums.length < limitations.offset + limitations.limit,
        };
      }
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setAlbums", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setAlbums", []);
      }
      if (response.status === 404) {
        commit("setAlbums", []);
        return { no_more: true };
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
    return {};
  },
  async fetchAlbumById({ commit }, { id }) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/albums/${id}`, {
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
  async createAlbum({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/albums/create`, {
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
  async updateAlbum({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/albums/update`, {
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
  async deleteAlbum({ state }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/albums/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ album: data }),
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
      state.albums = state.albums.filter(
        (album) => album.album_id != data.album_id
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
  setAlbums: (state, albums) => (state.albums = albums),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
