<template>
  <teleport to="#pop-up" v-if="isChangeRolePopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeRolePopUpActivity(false)"
        >
          Close<!-- <img src="../assets/icons/close.png" /> -->
        </button>
        <form @submit.prevent="handleSubmit">
          <select name="role_id" id="role" v-model="new_role_id">
            <option
              v-for="role in roles"
              :key="role.role_id"
              :value="role.role_id"
              :selected="role_id === role.role_id"
            >
              {{ role.role }}
            </option>
          </select>
          <ButtonSubmit :btn_text="'Change role'" />
        </form>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "../ButtonSubmit.vue";
export default {
  name: "ChangeRolePopUp",
  props: ["roles", "user_id", "role_id"],
  components: {
    ButtonSubmit,
  },
  data() {
    return {
      new_role_id: "",
    };
  },
  computed: {
    ...mapGetters(["isChangeRolePopActive"]),
  },
  methods: {
    ...mapActions("user", ["changeUserRole"]),
    ...mapActions(["changeRolePopUpActivity"]),
    handleSubmit() {
      const data = {
        user_id: this.user_id,
        role_id: this.new_role_id,
        role: this.roles
          .filter((role) => role.role_id === this.new_role_id)
          .map((role) => role.role)[0],
      };
      this.changeUserRole(data);
      this.changeRolePopUpActivity(false);
    },
  },
  watch: {
    role_id() {
      this.new_role_id = this.role_id;
    },
  },
};
</script>

<style scoped>
form {
  display: grid;
  grid-template-rows: 1fr 1fr;
}
form select {
  outline: none;
}
</style>
