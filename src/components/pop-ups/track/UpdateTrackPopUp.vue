<template>
  <teleport to="#pop-up" v-if="isUpdateTrackPopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeUpdateTrackPopUpActivity(false)"
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
          <ArtistsSelect
            @pickedArtists="changeArtists"
            :exist_artists="old_artists"
          />
          <GroupsSelect
            @pickedGroups="changeGroups"
            :exist_groups="old_groups"
          />
          <AlbumSelect @pickedAlbum="changeAlbum" :exist_album="old_album" />
          <GenreSelect @pickedGenre="changeGenre" :exist_genre="old_genre" />
          <div class="input-block">
            <p class="form-field-title">Lyrics</p>
            <textarea
              v-model.trim="lyrics"
              class="form-field textarea"
              name="lyrics"
              placeholder="Lyrics"
              id="lyrics"
              maxlength="3000"
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
          <div class="file-input-container">
            <div>
              <input type="checkbox" id="update_track" v-model="update_track" />
              <label for="update_track">Update track?</label>
            </div>
            <FileUpload
              v-if="update_track"
              title="Track"
              types="audio/*"
              @fileUpload="onTrackUpload"
            />
          </div>
          <ButtonSubmit btn_text="Update" />
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
  name: "UpdateTrack",
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
  props: ["track_id"],
  data() {
    return {
      title: "",
      release_date: "",
      lyrics: "",
      genre_id: "",
      album_id: "",
      groups: [],
      artists: [],
      old_genre: "",
      old_artists: [],
      old_groups: [],
      old_album: "",
      image_file: undefined,
      track_file: undefined,
      cover_on_server: false,
      cover_url: "",
      track_on_server: false,
      track_url: "",
      update_cover: false,
      update_track: false,
      old_cover_on_server: "",
      old_cover_url: "",
      old_track_on_server: "",
      old_track_url: "",
      error: "",
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      title: { required, maxLength: maxLength(50) },
    };
  },
  computed: {
    ...mapGetters([
      "isUpdateTrackPopActive",
      "isCreateArtistPopActive",
      "isCreateGroupPopActive",
      "isCreateAlbumPopActive",
    ]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeUpdateTrackPopUpActivity"]),

    fillData(data) {
      this.title = data.title || "";
      this.release_date = this.dateFromTimestamp(data.release_date) || "";
      this.genre_id = "";
      this.album_id = "";
      this.groups = [];
      this.artists = [];
      this.old_genre = { genre_id: data.genre_id, genre_name: data.genre_name };
      this.old_artists = data.artists;
      this.old_groups = data.groups;
      this.old_album = data.album || "";
      this.lyrics = data.lyrics || "";
      this.cover_on_server = false;
      this.cover_url = "";
      this.old_cover_url = data.cover_url;
      this.old_cover_on_server = data.cover_on_server;
      this.image_file = undefined;
      this.update_cover = false;
      this.track_on_server = false;
      this.track_url = "";
      this.old_track_url = data.track_url;
      this.old_track_on_server = data.track_on_server;
      this.track_file = undefined;
      this.update_track = false;
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
      this.album_id = data.album_id;
    },
    changeGenre(data) {
      this.genre_id = data.genre_id;
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
        track_id: this.track_id,
        title: this.title,
        release_date: this.release_date,
        lyrics: replaceSpecialSymbol(this.lyrics),
        artists: this.artists,
        groups: this.groups,
        album_id: this.album_id,
        genre_id: this.genre_id,
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
      if (this.update_track) {
        data = {
          ...data,
          old_track_url: this.old_track_url,
          old_track_on_server: this.old_track_on_server,
          track_on_server: this.track_on_server,
        };
        if (this.track_file != undefined) {
          formData.append("track_file", this.track_file);
        } else if (this.image_file == undefined && !this.track_on_server) {
          data = {
            ...data,
            track_on_server: this.track_on_server,
            track_url: this.track_url,
          };
        } else {
          data.track_on_server = this.old_track_on_server;
        }
      }

      formData.append("track", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "updateTrack",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeUpdateTrackPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    async isUpdateTrackPopActive() {
      if (!this.isUpdateTrackPopActive) this.error = "";
      if (this.isUpdateTrackPopActive) {
        this.changeDataUploadStatus(false);
        await this.track_id;
        const track = await this.$store.dispatch("fetchTrackById", {
          id: this.track_id,
        });
        this.fillData(track);
        this.changeDataUploadStatus(true);
      }
    },
  },
};
</script>
