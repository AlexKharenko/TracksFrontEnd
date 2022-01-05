/* eslint-disable no-unused-vars */
import router from "@/router";

const state = {
  languages: [],
  works: [],
  work: "",
};

const getters = {
  getAllLanguages: (state) => state.languages,
  getAllWorks: (state) => state.works,
  getWork: (state) => state.work,
};

const actions = {
  async fetchAllLanguages({ commit }) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/get/alllang`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status == 200) {
      response = await response.json();
      await commit("setLanguages", response.data);
    } else {
      if (response.status === 404) {
        response = await response.json();
        await commit("setLanguages", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async createWork({ commit }, data) {
    let response = await fetch(`${process.env.VUE_APP_SERVER}/works/add/work`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (response.status == 201) {
      response = await response.json();
      return response;
    } else {
      response = await response.json();
      return response;
    }
  },
  async addLanguage({ commit }, data) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/add/language`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (response.status == 201) {
      response = await response.json();
      return response;
    } else {
      response = await response.json();
      return response;
    }
  },
  async addWorkDetails({ commit }, data) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/add/details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (response.status == 201) {
      response = await response.json();
      return response;
    } else {
      response = await response.json();
      return response;
    }
  },
  async fetchAllWorks({ commit }) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/get/allworks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status == 200) {
      response = await response.json();
      await commit("setWorks", response.data);
    } else {
      if (response.status === 404) {
        response = await response.json();
        await commit("setWorks", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async fetchAllWorksByLang({ commit, dispatch }, data) {
    await commit("setWorks", []);
    dispatch("uploading/changeDataUploadStatus", false, { root: true });
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/get/works?language_short=${data.language_short}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch("uploading/changeDataUploadStatus", true, { root: true });
    if (response.status == 200) {
      response = await response.json();
      await commit("setWorks", response.data);
    } else {
      if (response.status === 404) {
        response = await response.json();
        await commit("setWorks", []);
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async fetchWork({ commit, dispatch }, data) {
    await commit("setWork", "");
    dispatch("uploading/changeDataUploadStatus", false, { root: true });
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/get/work?work_id=${data.work_id}&language_short=${data.language_short}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch("uploading/changeDataUploadStatus", true, { root: true });
    if (response.status == 200) {
      response = await response.json();
      await commit("setWork", response.data);
    } else {
      if (response.status === 404) {
        response = await response.json();
        await commit("setWork", "");
        router.push("/404");
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
  },
  async updateWorkDetails({ commit }, data) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/update/details`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (response.status == 200) {
      response = await response.json();
      return response;
    } else {
      response = await response.json();
      return response;
    }
  },
  async updateWork({ commit }, data) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/update/work`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (response.status == 200) {
      response = await response.json();
      return response;
    } else {
      response = await response.json();
      return response;
    }
  },
  async deleteWork({ commit }, data) {
    let response = await fetch(
      `${process.env.VUE_APP_SERVER}/works/delete/work`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (response.status == 200) {
      response = await response.json();
      return response;
    } else {
      response = await response.json();
      return response;
    }
  },
};

const mutations = {
  setLanguages: (state, languages) => (state.languages = languages),
  setWorks: (state, works) => (state.works = works),
  setWork: (state, work) => (state.work = work),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
