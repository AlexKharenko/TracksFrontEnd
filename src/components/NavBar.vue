<template>
  <div class="nav-bar">
    <div class="nav-left-part">
      <router-link to="/">
        <div class="logo">AudioApp</div>
      </router-link>
    </div>
    <div class="toggle-btn" @click="toggleMenu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>
    <div class="nav-right-part" :class="active ? 'active' : ''">
      <router-link to="/search">
        <p class="nav-link-text">Search</p>
      </router-link>
      <router-link to="/">
        <p class="nav-link-text">Tracks</p>
      </router-link>
      <router-link to="/artists">
        <p class="nav-link-text">Artists</p>
      </router-link>
      <router-link to="/groups">
        <p class="nav-link-text">Groups</p>
      </router-link>
      <router-link to="/albums">
        <p class="nav-link-text">Albums</p>
      </router-link>
      <router-link v-if="!isLoggedIn" to="/login">
        <p class="nav-link-text">Login</p>
      </router-link>
      <router-link v-if="!isLoggedIn" to="/signup">
        <p class="nav-link-text">SignUp</p>
      </router-link>
      <router-link v-if="isLoggedIn && checkIfContentOrAdmin" to="/control">
        <p class="nav-link-text">Control</p>
      </router-link>
      <router-link v-if="isLoggedIn && checkIfAdmin" to="/admin">
        <p class="nav-link-text">Admin</p>
      </router-link>
      <div class="btn-logout" v-if="isLoggedIn" @click="LogOut">
        <p class="nav-link-text">LogOut</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      active: false,
    };
  },
  methods: {
    ...mapActions("log_in", ["LogOut"]),
    toggleMenu() {
      this.active = !this.active;
    },
  },
  watch: {
    $route() {
      this.active = false;
    },
  },
  computed: {
    ...mapGetters("log_in", ["isLoggedIn"]),
    ...mapGetters("user", ["checkIfAdmin", "checkIfContentOrAdmin"]),
  },
};
</script>

<style lang="scss">
.nav-bar {
  position: sticky;
  top: 0;
  width: inherit;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px 20px;
  align-items: center;
  font-size: 18px;
  background: white;
  transition: 0.4s ease-in-out;
  border-bottom: 1px black solid;
  z-index: 100;
  a {
    text-decoration: none;
    color: black;
    &.router-link-exact-active {
      color: grey;
    }
  }
  .nav-left-part {
    display: flex;
    justify-content: left;
    a {
      color: white;
      .logo {
        font-size: 24px;
        padding: 5px;
        background: black;
      }
    }
  }

  .toggle-btn {
    position: absolute;
    right: 20px;
    top: 19px;
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    .bar {
      height: 3px;
      width: 100%;
      background-color: black;
      border-radius: 10px;
    }
  }

  .nav-right-part {
    display: flex;
    justify-content: flex-end;
    a {
      margin-left: 20px;
      border-bottom: 2px solid transparent;
      .nav-link-text {
        white-space: nowrap;
      }
    }
    a:hover {
      border-bottom: 2px solid black;
    }
    .btn-logout {
      border-bottom: 2px solid transparent;
      margin-left: 20px;
      cursor: pointer;
    }
    .btn-logout:hover {
      border-bottom: 2px solid black;
    }
  }
}

@media (max-width: 710px) {
  .nav-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .nav-right-part {
      transition: max-height 0.4s ease-in-out;
      overflow: hidden;
      max-height: 0;
      width: 100%;
      flex-direction: column;
      text-align: center;
      .btn-logout {
        margin-top: 10px;
      }
      a {
        margin-top: 10px;
      }
      .btn-toggle-mode {
        margin-top: 10px;
        align-self: center;
      }
      .locale-changer {
        padding-top: 10px;
      }
    }
    .nav-right-part.active {
      max-height: 300px;
    }
    .toggle-btn {
      display: flex;
      cursor: pointer;
    }
  }
}
</style>
