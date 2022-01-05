/* eslint-disable no-unused-vars */
import router from "@/router";

const actions = {
  async search({ state }, { data = undefined }) {
    let url = `${process.env.VUE_APP_SERVER}/search`;
    let additional_url = "/?";
    if (data != undefined) {
      additional_url += `${Object.keys(data)
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
      return response.data;
    } else {
      if (response.status === 404) {
        return [];
      }
      if (response.status >= 500) {
        router.push("/505");
      }
    }
    return {};
  },
};

export default {
  actions,
};
