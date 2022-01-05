import router from "@/router";

const state = {
  user: {},
  users: [],
  roles: [],
};

const getters = {
  getUser: (state) => state.user,
  getUserId: (state) => state.user.user_id,
  getUsers: (state) => state.users,
  getRoles: (state) => state.roles,
  checkIfAdmin: (state) => {
    if (state.user !== {} && state.user.role === "admin") return true;
    return false;
  },
  checkIfContentOrAdmin: (state) => {
    if (
      state.user !== {} &&
      (state.user.role === "content_maker" || state.user.role === "admin")
    )
      return true;
    return false;
  },
};

const actions = {
  async fetchUser({ commit, dispatch }) {
    const res = await fetch(`${process.env.VUE_APP_SERVER}/users/profile`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          dispatch("log_in/changeLogInStatus", true, { root: true });
          return response.json();
        }
        if (response.status == 404) {
          dispatch("log_in/changeLogInStatus", false, { root: true });
          router.push("/404");
          return;
        }
        if (response.status == 401 || response.status == 403) {
          dispatch("log_in/changeLogInStatus", false, { root: true });
          return response.json();
        }

        if (response.status >= 500) {
          dispatch("log_in/changeLogInStatus", false, { root: true });
          router.push("/505");
          return;
        }
      })
      .catch(() => {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/505");
      });
    await commit("setUser", res?.data || {});
  },
  async fetchUsers({ commit, dispatch }, data = undefined) {
    commit("setUsers", []);
    let url = `${process.env.VUE_APP_SERVER}/users`;
    let additional_url = "";
    if (data != undefined) {
      additional_url = `/?${Object.keys(data)
        .filter((key) => data[key] !== "")
        .map((key) => `${key}=${data[key]}`)
        .join("&")}`;
    }
    let response = await fetch(url + additional_url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 200) {
      response = await response.json();
      commit("setUsers", response.data);
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setUsers", []);
        commit("setRoles", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setUsers", []);
        commit("setRoles", []);
      }
      if (response.status === 404) {
        response = await response.json();
        commit("setUsers", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async fetchRoles({ commit, dispatch }) {
    commit("setRoles", []);
    let response = await fetch(`${process.env.VUE_APP_SERVER}/users/roles`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 200) {
      response = await response.json();
      commit("setRoles", response.data);
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setRoles", []);
        commit("setUsers", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setRoles", []);
        commit("setUsers", []);
      }
      if (response.status === 404) {
        response = await response.json();
        commit("setRoles", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async changeUserRole({ state, commit, dispatch }, data) {
    if (state.user.user_id == data.user_id) {
      return;
    }
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/users/changerole`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ user_data: data }),
      }
    );
    if (response.status == 200) {
      var foundIndex = state.users.findIndex((x) => x.user_id == data.user_id);
      state.users[foundIndex].role_id = data.role_id;
      state.users[foundIndex].role = data.role;
      return;
    } else {
      if (response.status === 401) {
        dispatch("log_in/changeLogInStatus", false, { root: true });
        router.push("/");
        commit("setUser", {});
        commit("setUsers", []);
        commit("setRoles", []);
      }
      if (response.status === 403) {
        router.push("/");
        commit("setUsers", []);
        commit("setRoles", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  // async deleteUser({ state, commit, dispatch }, data) {
  //   state.users.filter((user) => user.user_id !== data.user_id);
  //   let response = await fetch(`${process.env.VUE_APP_SERVER}/users/delete`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({ user_data: data }),
  //   });
  //   if (response.status == 200) {
  //     return;
  //   } else {
  //     if (response.status === 401) {
  //       dispatch("log_in/changeLogInStatus", false, { root: true });
  //       router.push("/");
  //       commit("setUser", {});
  //       commit("setUsers", []);
  //       commit("setRoles", []);
  //     }
  //     if (response.status === 403) {
  //       router.push("/");
  //       commit("setUsers", []);
  //       commit("setRoles", []);
  //     }
  //     if (response.status >= 500) {
  //       router.push("/505");
  //     }
  //   }
  // },
};

const mutations = {
  setUser: (state, user) => (state.user = user),
  setUsers: (state, users) => (state.users = users),
  setRoles: (state, roles) => (state.roles = roles),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
