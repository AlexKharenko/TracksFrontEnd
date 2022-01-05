<template>
  <teleport to="#pop-up" v-if="isFilterUsersPopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeFilterUsersPopUpActivity(false)"
        >
          Close
        </button>
        <form @submit.prevent="handleSubmit">
          <div class="filter-block">
            <h4>Filters</h4>
            <div class="options-block">
              <div class="option-check">
                <p class="check-box-label">By first name:</p>
                <input
                  class="filter-input"
                  type="text"
                  maxlength="30"
                  name="first_name"
                  v-model="filter.first_name"
                />
              </div>
              <div class="option-check">
                <p class="check-box-label">By last name:</p>
                <input
                  class="filter-input"
                  type="text"
                  maxlength="30"
                  name="last_name"
                  v-model="filter.last_name"
                />
              </div>
              <div class="option-check">
                <p class="check-box-label">By login:</p>
                <input
                  class="filter-input"
                  type="text"
                  maxlength="30"
                  name="login"
                  v-model="filter.login"
                />
              </div>
              <div class="option-check">
                <p class="check-box-label">By email:</p>
                <input
                  class="filter-input"
                  type="text"
                  maxlength="50"
                  name="email"
                  v-model="filter.email"
                />
              </div>
              <div class="option-check">
                <p class="check-box-label">By role:</p>
                <select name="role_id" id="role" v-model="filter.role_id">
                  <option value="0" selected>none</option>
                  <option
                    v-for="role in roles"
                    :key="role.role_id"
                    :value="role.role_id"
                  >
                    {{ role.role }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="btn clear" @click="ClearAllFields()">Clear</div>
          <ButtonSubmit :btn_text="'Filter'" />
        </form>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "../ButtonSubmit.vue";
export default {
  name: "FilterUsersPopUp",
  components: {
    ButtonSubmit,
  },
  props: ["roles"],
  data() {
    return {
      filter: {
        first_name: "",
        last_name: "",
        login: "",
        email: "",
        role_id: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["isFilterUsersPopActive"]),
  },
  methods: {
    ...mapActions("user", ["fetchUsers"]),
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeFilterUsersPopUpActivity"]),
    ClearAllFields() {
      Object.keys(this.filter).forEach((key) =>
        key != "role_id" ? (this.filter[key] = "") : (this.filter[key] = 0)
      );
    },
    async handleSubmit() {
      const data = {
        first_name: this.filter.first_name,
        last_name: this.filter.last_name,
        login: this.filter.login,
        email: this.filter.email,
        role: this.filter.role_id == 0 ? "" : this.filter.role_id,
      };
      this.changeDataUploadStatus(false);
      this.changeFilterUsersPopUpActivity(false);
      await this.$store.dispatch("user/fetchUsers", data);
      this.changeDataUploadStatus(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-block {
  h4 {
    margin-bottom: 5px;
  }
  .options-block {
    margin-bottom: 10px;
    .option-check {
      margin-bottom: 5px;
      display: grid;
    }
  }
}
.clear:hover {
  color: rgb(216, 216, 216);
}
</style>
