<template>
  <teleport to="#pop-up" v-if="isCreateArtistPopActive">
    <div class="pop-up artist">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeCreateArtistPopUpActivity(false)"
        >
          Close
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="input-block">
            <p class="form-field-title">Nick name</p>
            <input
              v-model.trim="nick_name"
              class="form-field"
              :class="v$.nick_name.$error ? 'invalid-input' : ''"
              type="text"
              name="nick_name"
              placeholder="Nick name"
              id="nick_name"
            />
            <p
              v-if="v$.nick_name.$dirty && v$.nick_name.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.nick_name.$dirty && v$.nick_name.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 100 symbols
            </p>
          </div>
          <div class="input-block">
            <p class="form-field-title">First name</p>
            <input
              v-model.trim="first_name"
              class="form-field"
              :class="v$.first_name.$error ? 'invalid-input' : ''"
              type="text"
              name="first_name"
              placeholder="First name"
              id="first_name"
            />
            <p
              v-if="v$.first_name.$dirty && v$.first_name.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.first_name.$dirty && v$.first_name.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 50 symbols
            </p>
          </div>
          <div class="input-block">
            <p class="form-field-title">Last name</p>
            <input
              v-model.trim="last_name"
              class="form-field"
              :class="v$.last_name.$error ? 'invalid-input' : ''"
              type="text"
              name="last_name"
              placeholder="Last name"
              id="last_name"
            />
            <p
              v-if="v$.last_name.$dirty && v$.last_name.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.last_name.$dirty && v$.last_name.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 50 symbols
            </p>
          </div>
          <div class="input-block">
            <p class="form-field-title">Details</p>
            <textarea
              v-model.trim="details"
              class="form-field textarea"
              name="details"
              placeholder="Details"
              id="details"
              maxlength="1000"
            />
          </div>
          <FileUpload
            title="Cover"
            types="image/*"
            @fileUpload="onImageUpload"
          />
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
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import FileUpload from "@/components/FileUpload.vue";
import replaceSpecialSymbol from "@/functions/index.js";

export default {
  name: "CreateArtist",
  components: {
    ButtonSubmit,
    FileUpload,
  },
  data() {
    return {
      nick_name: "",
      first_name: "",
      last_name: "",
      details: "",
      image_file: undefined,
      cover_on_server: false,
      cover_url: "",
      error: "",
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      nick_name: { required, maxLength: maxLength(100) },
      first_name: { required, maxLength: maxLength(50) },
      last_name: { required, maxLength: maxLength(50) },
    };
  },
  computed: {
    ...mapGetters(["isCreateArtistPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateArtistPopUpActivity"]),
    initialData() {
      this.nick_name = "";
      this.first_name = "";
      this.last_name = "";
      this.details = "";
      this.image_file = undefined;
      this.cover_on_server = false;
      this.cover_url = "";
      this.error = "";
    },
    onImageUpload(data) {
      const { file, url, on_server } = data;
      this.image_file = file;
      this.cover_url = url;
      this.cover_on_server = on_server;
    },

    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      const data = {
        nick_name: this.nick_name,
        first_name: this.first_name,
        last_name: this.last_name,
        details: replaceSpecialSymbol(this.details),
        cover_on_server: this.cover_on_server,
        cover_url: this.cover_url,
      };
      const formData = new FormData();

      formData.append("cover_file", this.image_file);
      formData.append("artist", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "createArtist",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeCreateArtistPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    isCreateArtistPopActive() {
      if (!this.isCreateArtistPopActive) this.initialData();
    },
  },
};
</script>
