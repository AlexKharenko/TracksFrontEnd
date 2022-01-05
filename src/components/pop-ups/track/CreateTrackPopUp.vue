<template>
  <teleport to="#pop-up" v-if="isCreateTrackPopActive">
    <div class="pop-up track">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeCreateTrackPopUpActivity(false)"
        >
          Close
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="input-block">
            <p class="form-field-title">Track title</p>
            <input
              v-model.trim="title"
              class="form-field"
              :class="v$.title.$error ? 'invalid-input' : ''"
              type="text"
              name="title"
              placeholder="Track title"
              id="title"
            />
            <p
              v-if="v$.title.$dirty && v$.title.required.$invalid"
              class="invalid-message"
            >
              Required field
            </p>
            <p
              v-if="v$.title.$dirty && v$.title.maxLength.$invalid"
              class="invalid-message"
            >
              Max length 50 symbols
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
          <ArtistsSelect @pickedArtists="changeArtists" />
          <GroupsSelect @pickedGroups="changeGroups" />
          <AlbumSelect @pickedAlbum="changeAlbum" />
          <GenreSelect @pickedGenre="changeGenre" />
          <div class="input-block">
            <p class="form-field-title">Lyrics</p>
            <textarea
              v-model.trim="lyrics"
              class="form-field textarea"
              name="lyrics"
              placeholder="Details"
              id="lyrics"
              maxlength="3000"
            />
          </div>
          <FileUpload
            title="Cover"
            types="image/*"
            @fileUpload="onImageUpload"
          />
          <FileUpload
            title="Track"
            types="audio/*"
            @fileUpload="onTrackUpload"
          />
          <ButtonSubmit btn_text="Create" />
        </form>
      </div>
    </div>
    <CreateArtistPopUp v-if="isCreateArtistPopActive" />
    <CreateGroupPopUp v-if="isCreateGroupPopActive" />
    <CreateAlbumPopUp v-if="isCreateAlbumPopActive" />
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
import GroupsSelect from "@/components/selects/GroupsSelect.vue";
import GenreSelect from "@/components/selects/GenreSelect.vue";
import AlbumSelect from "@/components/selects/AlbumSelect.vue";
import CreateArtistPopUp from "@/components/pop-ups/artist/CreateArtistPopUp.vue";
import CreateGroupPopUp from "@/components/pop-ups/group/CreateGroupPopUp.vue";
import CreateAlbumPopUp from "@/components/pop-ups/album/CreateAlbumPopUp.vue";

export default {
  name: "CreateTrack",
  components: {
    ButtonSubmit,
    FileUpload,
    ArtistsSelect,
    GroupsSelect,
    GenreSelect,
    AlbumSelect,
    CreateArtistPopUp,
    CreateGroupPopUp,
    CreateAlbumPopUp,
  },
  data() {
    return {
      title: "",
      artists: "",
      groups: "",
      album_id: "",
      genre_id: "",
      release_date: "",
      lyrics: "",
      image_file: undefined,
      cover_on_server: false,
      cover_url: "",
      track_file: undefined,
      track_on_server: false,
      track_url: "",
      error: "",
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      title: { required, maxLength: maxLength(50) },
      genre_id: { required },
    };
  },
  computed: {
    ...mapGetters([
      "isCreateTrackPopActive",
      "isCreateAlbumPopActive",
      "isCreateArtistPopActive",
      "isCreateGroupPopActive",
    ]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateTrackPopUpActivity"]),
    initialData() {
      this.title = "";
      this.artists = "";
      this.groups = "";
      this.album_id = "";
      this.genre_id = "";
      this.release_date = "";
      this.lyrics = "";
      this.image_file = undefined;
      this.cover_on_server = false;
      this.cover_url = "";
      this.track_file = undefined;
      this.track_on_server = false;
      this.track_url = "";
      this.error = "";
    },
    onImageUpload(data) {
      const { file, url, on_server } = data;
      this.image_file = file;
      this.cover_url = url;
      this.cover_on_server = on_server;
    },
    onTrackUpload(data) {
      const { file, url, on_server } = data;
      this.track_file = file;
      this.track_url = url;
      this.track_on_server = on_server;
    },
    changeArtists(data) {
      this.artists = data;
    },
    changeGroups(data) {
      this.groups = data;
    },
    changeAlbum(data) {
      this.album_id = data?.album_id || undefined;
    },
    changeGenre(data) {
      this.genre_id = data.genre_id;
    },
    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      const data = {
        title: this.title,
        release_date: this.release_date,
        lyrics: replaceSpecialSymbol(this.lyrics),
        album_id: this.album_id || null,
        genre_id: this.genre_id,
        artists: this.artists || [],
        groups: this.groups || [],
        cover_on_server: this.cover_on_server,
        cover_url: this.cover_url,
        track_on_server: this.track_on_server,
        track_url: this.track_url,
      };
      if (!this.track_url && !this.track_file) {
        this.error = "Track should be";
        return;
      }
      const formData = new FormData();

      formData.append("track_file", this.track_file);
      formData.append("cover_file", this.image_file);
      formData.append("track", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "createTrack",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeCreateTrackPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    isCreateTrackPopActive() {
      if (!this.isCreateTrackPopActive) this.initialData();
    },
  },
};
</script>
