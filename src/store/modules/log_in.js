import router from "@/router";

const state = {
  logged_in: false,
};

const getters = {
  isLoggedIn: (state) => state.logged_in,
};

const actions = {
  async LogOut({ dispatch }) {
    try {
      await fetch(`${process.env.VUE_APP_SERVER}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      router.push("/");
    }
    dispatch("changeLogInStatus", false);
    router.push("/");
  },
  // eslint-disable-next-line no-unused-vars
  async SignUp({ commit }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ register_data: data }),
    });
    if (response.status == 200) {
      response = await response.json();
      router.push("/login");
      return {};
    } else {
      if (response.status === 400) {
        response = await response.json();
        if (response.message == "Login exist") {
          return { login_exist: true };
        } else if (response.message == "Email exist") {
          return { email_exist: true };
        }
      }
      if (response.status >= 500) {
        router.push("/505");
        return {};
      }
    }
  },
  async LogIn({ dispatch }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ login_data: data }),
    });
    if (response.status == 200) {
      response = await response.json();
      dispatch("changeLogInStatus", response.success);
      dispatch("user/fetchUser", null, { root: true });
      router.push("/");
      return;
    } else {
      if (response.status >= 500) {
        router.push("/505");
        return {};
      }
      response = await response.json();
      return response;
    }
  },
  changeLogInStatus({ commit }, status) {
    commit("setLoggedIn", status);
  },
};

const mutations = {
  setLoggedIn: (state, logged_in) => (state.logged_in = logged_in),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
