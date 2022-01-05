<template>
  <teleport to="#pop-up" v-if="isCreateAlbumPopActive">
    <div class="pop-up album">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeCreateAlbumPopUpActivity(false)"
        >
          Close
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="input-block">
            <p class="form-field-title">Album title</p>
            <input
              v-model.trim="album_title"
              class="form-field"
              :class="v$.album_title.$error ? 'invalid-input' : ''"
              type="text"
              name="album_title"
              placeholder="Album title"
              id="album_title"
            />
            <p
              v-if="v$.album_title.$dirty && v$.album_title.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.album_title.$dirty && v$.album_title.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 30 symbols
            </p>
          </div>
          <div class="input-block">
            <p class="form-field-title">Release date</p>
            <input
              v-model.trim="release_date"
              class="form-field date"
              type="date"
              name="release_date"
              id="release_date"
            />
          </div>
          <AuthorSelect @pickedAuthor="changeAuthor" />
          <p
            v-if="v$.author.$dirty && v$.author.required.$invalid"
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
    <CreateGroupPopUp v-if="isCreateGroupPopActive" />
  </teleport>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import replaceSpecialSymbol from "@/functions/index.js";

import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import FileUpload from "@/components/FileUpload.vue";
import AuthorSelect from "@/components/selects/AuthorSelect.vue";
import CreateArtistPopUp from "@/components/pop-ups/artist/CreateArtistPopUp.vue";
import CreateGroupPopUp from "@/components/pop-ups/group/CreateGroupPopUp.vue";

export default {
  name: "CreateAlbum",
  components: {
    ButtonSubmit,
    FileUpload,
    AuthorSelect,
    CreateArtistPopUp,
    CreateGroupPopUp,
  },
  data() {
    return {
      album_title: "",
      author: "",
      release_date: "",
      is_group: "",
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
      album_title: { required, maxLength: maxLength(30) },
      author: { required },
      is_group: { required },
    };
  },
  computed: {
    ...mapGetters([
      "isCreateAlbumPopActive",
      "isCreateArtistPopActive",
      "isCreateGroupPopActive",
    ]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateAlbumPopUpActivity"]),
    initialData() {
      this.album_title = "";
      this.author = "";
      this.release_date = "";
      this.is_group = "";
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
    changeAuthor(data) {
      this.author = data.artist_id || data.group_id;
      this.is_group = data.is_group;
    },

    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      const data = {
        album_title: this.album_title,
        release_date: this.release_date,
        details: replaceSpecialSymbol(this.details),
        author_id: this.author,
        is_group: this.is_group,
        cover_on_server: this.cover_on_server,
        cover_url: this.cover_url,
      };
      const formData = new FormData();

      formData.append("cover_file", this.image_file);
      formData.append("album", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "createAlbum",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeCreateAlbumPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    isCreateAlbumPopActive() {
      if (!this.isCreateAlbumPopActive) this.initialData();
    },
  },
};
</script>
