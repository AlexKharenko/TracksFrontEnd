<template>
  <div class="wrapper">
    <NavBar />

    <div v-if="!isDataUploaded" class="loading">
      <div class="spinner">
        <img src="./assets/main_screen/refresh.png" />
      </div>
    </div>
    <router-view class="main" />
    <!-- <Footer /> -->
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
// import Footer from "@/components/Footer.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    NavBar,
    // Footer,
  },
  computed: {
    ...mapGetters("log_in", ["isLoggedIn"]),
    ...mapGetters("uploading", ["isDataUploaded"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
  },
  async created() {
    if (!this.isLoggedIn) {
      this.changeDataUploadStatus(false);
      await this.$store.dispatch("user/fetchUser");
      this.changeDataUploadStatus(true);
    }
  },
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

:root {
  --default-light-mode-color: #2c3e50;
  --default-dark-mode-color: rgb(224, 222, 222);
  --dark-mode-background: black;
  --contact-me-link-light-mode--hover-color: rgb(80, 80, 80);
  --additional-light-mode-color: rgb(0, 0, 0);
  --additional-light-mode-hover-color: rgb(51, 51, 51);
  --additional-dark-mode-color: rgb(175, 172, 172);
  --additional-dark-mode-hover-color: rgb(141, 141, 141);
  --btn-first-bg: rgb(252, 112, 112);
  --btn-first-hover-bg: rgba(252, 112, 112, 0.836);
  --btn-first-color: rgb(243, 243, 243);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  a {
    text-decoration: none;
  }
}
.wrapper {
  min-height: 100vh;
  width: 100%;
  transition: 0.4s ease-in-out;
  .main {
    width: inherit;
    min-height: calc(100vh - 60px);
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 40px;
    h3 {
      padding: 10px;
    }
    .filtration-block {
      display: flex;
      justify-content: center;
      grid-gap: 20px;
      margin-top: 20px;
      .order-by {
        display: flex;
        align-items: center;
        grid-gap: 5px;
        margin-bottom: 20px;
        p {
          white-space: nowrap;
        }
        .multiselect {
          min-width: 200px;
        }
      }
    }
  }
  .loading {
    width: inherit;
    height: calc(100vh - 60px);
    position: fixed;
    top: 60px;
    width: 100%;
    height: 100vh;
    background-color: white;
    z-index: 1000;
    .spinner {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      img {
        height: 150px;
        width: 150px;
        filter: invert(1);
        animation: fullRotate 1s ease-in-out infinite;
      }
    }
  }
}
.search-block {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  input {
    outline: none;
    border: none;
    border-bottom: 2px solid black;
    padding: 0 15px 0 15px;
  }
}

.login-signup-container {
  .error-message {
    margin: 5;
    color: rgb(250, 98, 98);
  }
  padding: 30px 20px;
  .btn {
    outline: none;
    height: 30px;
    width: 80px;
    margin: 10px 0;
    cursor: pointer;
  }
  form {
    .input-block {
      grid-gap: 5px;
      align-items: center;
      margin-bottom: 10px;
      .invalid-message {
        margin: 5;
        color: rgb(250, 98, 98);
      }
      .form-field {
        outline: none;
        padding: 5px 5px;
        border-radius: 6px;
      }
      .form-field.textarea {
        height: 300px;
        resize: unset;
      }
    }
  }
}

#pop-up {
  .pop-up {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    min-height: 100vh;
    width: 100%;
    background: rgba(53, 42, 42, 0.836);
    padding: 70px 20px 0 20px;
    .pop-up-content-container {
      .error-message {
        margin: 5;
        color: rgb(250, 98, 98);
      }
      position: absolute;
      top: 50%;
      left: 50%;
      max-height: 70vh;
      min-width: 400px;
      overflow-y: scroll;
      transform: translate(-50%, -50%);
      background-color: #202429;
      color: rgb(172, 172, 172);
      padding: 30px 20px;
      .btn {
        outline: none;
        height: 30px;
        width: 80px;
        margin: 10px 0;
        cursor: pointer;
      }
      form {
        display: grid;
        .input-block {
          display: grid;
          grid-gap: 5px;
          align-items: center;
          margin-bottom: 10px;
          .invalid-message {
            margin: 5;
            color: rgb(250, 98, 98);
          }
          .form-field {
            outline: none;
            padding: 5px 5px;
            border-radius: 6px;
          }
          .form-field.textarea {
            height: 300px;
            resize: unset;
          }
        }
      }
    }
  }
  .pop-up.artist {
    z-index: 205;
  }
  .pop-up.group {
    z-index: 204;
  }
  .pop-up.album {
    z-index: 203;
  }
}

@keyframes fullRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
