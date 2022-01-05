<template>
  <teleport to="#pop-up" v-if="isUpdateAlbumPopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeUpdateAlbumPopUpActivity(false)"
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
          <AuthorSelect
            @pickedAuthor="changeAuthor"
            :exist_author="oldAuthorSelect"
          />
          <p
            v-if="v$.author.$dirty && v$.author.required.$invalid"
            class="invalid-message"
          >
            Required field
          </p>
          <p
            v-if="v$.is_group.$dirty && v$.is_group.required.$invalid"
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
          <div class="file-input-container">
            <div>
              <input type="checkbox" id="update_cover" v-model="update_cover" />
              <label for="update_cover">Update cover?</label>
            </div>
            <FileUpload
              v-if="update_cover"
              title="Cover"
              types="image/*"
              @fileUpload="onImageUpload"
            />
          </div>
          <ButtonSubmit btn_text="Update" />
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
  name: "UpdateAlbum",
  components: {
    ButtonSubmit,
    FileUpload,
    AuthorSelect,
    CreateArtistPopUp,
    CreateGroupPopUp,
  },
  props: ["album_id"],
  data() {
    return {
      album_title: "",
      author: "",
      release_date: "",
      is_group: "",
      details: "",
      old_author: {},
      image_file: undefined,
      cover_on_server: false,
      cover_url: "",
      update_cover: false,
      old_cover_on_server: "",
      old_cover_url: "",
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
      "isUpdateAlbumPopActive",
      "isCreateArtistPopActive",
      "isCreateGroupPopActive",
    ]),
    oldAuthorSelect() {
      return {
        ...this.old_author,
        id: this.old_author.is_group
          ? `g${this.old_author.group_id}`
          : `a${this.old_author.group_id}`,
        title: this.old_author.is_group
          ? this.old_author.group_name
          : this.old_author.nick_name,
      };
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeUpdateAlbumPopUpActivity"]),

    fillData(data) {
      this.album_title = data.album_title || "";
      this.release_date = this.dateFromTimestamp(data.release_date) || "";
      this.author = "";
      this.is_group = "";
      this.old_author = data.author || "";
      this.details = data.details || "";
      this.cover_on_server = false;
      this.cover_url = "";
      this.old_cover_url = data.cover_url;
      this.old_cover_on_server = data.cover_on_server;
      this.image_file = undefined;
      this.update_cover = false;
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
    dateFromTimestamp(timestamp) {
      var d = new Date(timestamp);
      return `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? "0" : ""}${
        d.getMonth() + 1
      }-${d.getDate() + 1 < 10 ? "0" : ""}${d.getDate()}`;
    },
    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      let data = {
        album_id: this.album_id,
        album_title: this.album_title,
        release_date: this.release_date,
        details: replaceSpecialSymbol(this.details),
        author_id: this.author,
        is_group: this.is_group,
      };
      const formData = new FormData();
      if (this.update_cover) {
        data = {
          ...data,
          old_cover_url: this.old_cover_url,
          old_cover_on_server: this.old_cover_on_server,
          cover_on_server: this.cover_on_server,
        };
        if (this.image_file != undefined) {
          formData.append("cover_file", this.image_file);
        } else if (this.image_file == undefined && !this.cover_on_server) {
          data = {
            ...data,
            cover_on_server: this.cover_on_server,
            cover_url: this.cover_url,
          };
        } else {
          data.cover_on_server = this.old_cover_on_server;
        }
      }

      formData.append("album", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "updateAlbum",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeUpdateAlbumPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    async isUpdateAlbumPopActive() {
      if (!this.isUpdateAlbumPopActive) this.error = "";
      if (this.isUpdateAlbumPopActive) {
        this.changeDataUploadStatus(false);
        await this.album_id;
        const album = await this.$store.dispatch("fetchAlbumById", {
          id: this.album_id,
        });
        this.fillData(album);
        this.changeDataUploadStatus(true);
      }
    },
  },
};
</script>
