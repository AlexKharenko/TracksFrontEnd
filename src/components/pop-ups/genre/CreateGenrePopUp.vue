<template>
  <teleport to="#pop-up" v-if="isCreateGenrePopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeCreateGenrePopUpActivity(false)"
        >
          Close
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="input-block">
            <p class="form-field-title">Genre</p>
            <input
              v-model.trim="genre_name"
              class="form-field"
              :class="v$.genre_name.$error ? 'invalid-input' : ''"
              type="text"
              name="genre_name"
              placeholder="Genre"
              id="genre"
            />
            <p
              v-if="v$.genre_name.$dirty && v$.genre_name.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.genre_name.$dirty && v$.genre_name.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 20 symbols
            </p>
          </div>
          <ButtonSubmit btn_text="Create" />
        </form>
      </div>
    </div>
  </teleport>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "../../ButtonSubmit.vue";
export default {
  name: "CreateGenre",
  components: {
    ButtonSubmit,
  },
  data() {
    return {
      genre_name: "",
      error: "",
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      genre_name: { required, maxLength: maxLength(20) },
    };
  },
  computed: {
    ...mapGetters(["isCreateGenrePopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateGenrePopUpActivity"]),

    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      const data = {
        genre_name: this.genre_name,
      };
      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "createGenre",
        data
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeCreateGenrePopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    isCreateGenrePopActive() {
      if (!this.isCreateGenrePopActive) this.error = "";
    },
  },
};
</script>
