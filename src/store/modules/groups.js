/* eslint-disable no-unused-vars */
import router from "@/router";

const state = {
  groups: [],
};

const getters = {
  getGroups: (state) => state.groups,
};

const actions = {
  clearGroupsState({ state }) {
    state.groups = [];
  },
  async fetchGroups(
    { state, commit, dispatch },
    {
      data = undefined,
      order_by = undefined,
      limitations = undefined,
      more = false,
      returning = false,
    }
  ) {
    if (!more) commit("setGroups", []);
    let url = `${process.env.VUE_APP_SERVER}/groups`;
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
        commit("setGroups", response.data);
        if (returning) {
          return {
            no_more:
              state.groups.length < limitations.offset + limitations.limit,
          };
        }
      } else {
        state.groups = [...state.groups, ...response.data];
        return {
          no_more: state.groups.length < limitations.offset + limitations.limit,
        };
      }
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setGroups", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setGroups", []);
      }
      if (response.status === 404) {
        response = await response.json();
        commit("setGroups", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
    return {};
  },
  async fetchGroupById({ commit }, { id }) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/groups/${id}`, {
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
  async createGroup({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/groups/create`, {
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
  async updateGroup({ state }, formData) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/groups/update`, {
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
  async deleteGroup({ state }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/groups/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ group: data }),
    });
    if (response.status >= 200 || response.status <= 220) {
      response = await response.json();
      state.groups = state.groups.filter(
        (group) => group.group_id != data.group_id
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
  setGroups: (state, groups) => (state.groups = groups),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
