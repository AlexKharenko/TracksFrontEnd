<template>
  <teleport to="#pop-up" v-if="isCreateGroupPopActive">
    <div class="pop-up group">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeCreateGroupPopUpActivity(false)"
        >
          Close
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="input-block">
            <p class="form-field-title">Group name</p>
            <input
              v-model.trim="group_name"
              class="form-field"
              :class="v$.group_name.$error ? 'invalid-input' : ''"
              type="text"
              name="group_name"
              placeholder="Group name"
              id="group_name"
            />
            <p
              v-if="v$.group_name.$dirty && v$.group_name.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.group_name.$dirty && v$.group_name.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 50 symbols
            </p>
          </div>
          <ArtistsSelect @pickedArtists="changeArtists" />
          <p
            v-if="v$.artists.$dirty && v$.artists.required.$invalid"
            class="invalid-message"
          >
            Required field
          </p>
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
    <CreateArtistPopUp v-if="isCreateArtistPopActive" />
  </teleport>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import replaceSpecialSymbol from "@/functions/index.js";

import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import FileUpload from "@/components/FileUpload.vue";
import ArtistsSelect from "@/components/selects/ArtistsSelect.vue";
import CreateArtistPopUp from "@/components/pop-ups/artist/CreateArtistPopUp.vue";

export default {
  name: "CreateGroup",
  components: {
    ButtonSubmit,
    FileUpload,
    ArtistsSelect,
    CreateArtistPopUp,
  },
  data() {
    return {
      group_name: "",
      artists: [],
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
      group_name: { required, maxLength: maxLength(50) },
      artists: { required },
    };
  },
  computed: {
    ...mapGetters(["isCreateGroupPopActive", "isCreateArtistPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateGroupPopUpActivity"]),
    initialData() {
      this.group_name = "";
      this.artists = [];
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
    changeArtists(data) {
      this.artists = data;
    },

    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      const data = {
        group_name: this.group_name,
        details: replaceSpecialSymbol(this.details),
        artists: this.artists,
        cover_on_server: this.cover_on_server,
        cover_url: this.cover_url,
      };
      const formData = new FormData();

      formData.append("cover_file", this.image_file);
      formData.append("group", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "createGroup",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeCreateGroupPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    isCreateGroupPopActive() {
      if (!this.isCreateGroupPopActive) this.initialData();
    },
  },
};
</script>
