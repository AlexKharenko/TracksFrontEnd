<template>
  <div class="admin-page">
    <FilterUsersPopUp :roles="getRoles" />
    <div class="control-buttons-block">
      <ButtonFunction
        btn_text="Filter"
        @click="changeFilterUsersPopUpActivity(true)"
      />
    </div>
    <UsersTable :users="getUsers" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UsersTable from "@/components/UsersTable.vue";
import ButtonFunction from "@/components/ButtonFunction.vue";
import FilterUsersPopUp from "@/components/pop-ups/FilterUsersPopUp.vue";

export default {
  name: "Admin",
  components: {
    UsersTable,
    FilterUsersPopUp,
    ButtonFunction,
  },
  computed: {
    ...mapGetters("log_in", ["isLoggedIn"]),
    ...mapGetters("user", ["checkIfAdmin", "getUsers", "getRoles"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeFilterUsersPopUpActivity"]),
  },
  watch: {
    isLoggedIn() {
      if (!this.isLoggedIn) {
        this.$router.push("/");
      }
    },
    checkIfAdmin() {
      if (!this.checkIfAdmin) {
        this.$router.push("/");
      }
    },
  },
  async created() {
    if (!this.isLoggedIn) {
      this.$router.push("/");
    } else if (!this.checkIfAdmin) {
      this.$router.push("/");
    } else {
      this.changeDataUploadStatus(false);
      await this.$store.dispatch("user/fetchUsers");
      await this.$store.dispatch("user/fetchRoles");
      this.changeDataUploadStatus(true);
    }
  },
};
</script>

<style lang="scss">
.admin-page {
  .control-buttons-block {
    padding-top: 10px;
    display: flex;
    justify-content: center;
  }
  .no-works {
    text-align: center;
  }
  .redirect-btn-block {
    grid-gap: 20px;
    padding: 40px 0;
    display: flex;
    justify-content: center;
  }
  .admin-works {
    padding: 0 40px;
  }
}
</style>
