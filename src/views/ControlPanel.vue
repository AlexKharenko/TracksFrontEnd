<template>
  <div class="control-panel">
    <h1>Control Panel</h1>
    <div class="control-panel-nav">
      <router-link to="/control/">
        <p class="nav-link-text">Tracks</p>
      </router-link>
      <router-link to="/control/groups">
        <p class="nav-link-text">Groups</p>
      </router-link>
      <router-link to="/control/artists">
        <p class="nav-link-text">Artists</p>
      </router-link>
      <router-link to="/control/albums">
        <p class="nav-link-text">Albums</p>
      </router-link>
      <router-link to="/control/genres">
        <p class="nav-link-text">Genres</p>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ControlPanel",
  inheritAttrs: false,
  components: {},
  computed: {
    ...mapGetters("log_in", ["isLoggedIn"]),
    ...mapGetters("user", ["checkIfContentOrAdmin"]),
  },
  watch: {
    isLoggedIn() {
      if (!this.isLoggedIn) {
        this.$router.push("/");
      }
    },
    checkIfContentOrAdmin() {
      if (!this.checkIfContentOrAdmin) {
        this.$router.push("/");
      }
    },
  },
  async created() {
    if (!this.isLoggedIn) {
      this.$router.push("/");
    } else if (!this.checkIfContentOrAdmin) {
      this.$router.push("/");
    }
  },
};
</script>

<style lang="scss" scoped>
.control-panel {
  .control-panel-nav {
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    grid-gap: 10px;
    a {
      border-bottom: 2px solid transparent;
      text-decoration: none;
      color: black;
      &.router-link-exact-active {
        border-bottom: 2px solid black;
      }
    }
    a:hover {
      border-bottom: 2px solid grey;
      color: grey;
      &.router-link-exact-active {
        border-bottom: 2px solid black;
        color: black;
      }
    }
  }
}
</style>
