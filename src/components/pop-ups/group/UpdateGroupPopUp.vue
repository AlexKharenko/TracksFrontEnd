<template>
  <teleport to="#pop-up" v-if="isUpdateGroupPopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeUpdateGroupPopUpActivity(false)"
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
          <ArtistsSelect
            @pickedArtists="changeArtists"
            :exist_artists="old_artists"
          />
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
  name: "UpdateGroup",
  components: {
    ButtonSubmit,
    FileUpload,
    ArtistsSelect,
    CreateArtistPopUp,
  },
  props: ["group_id"],
  data() {
    return {
      group_name: "",
      artists: [],
      old_artists: [],
      details: "",
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
      group_name: { required, maxLength: maxLength(50) },
      artists: { required },
    };
  },
  computed: {
    ...mapGetters(["isUpdateGroupPopActive", "isCreateArtistPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeUpdateGroupPopUpActivity"]),
    fillData(data) {
      this.group_name = data.group_name || "";
      this.artists = [];
      this.old_artists = data.artists || [];
      this.details = replaceSpecialSymbol(data.details) || "";
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
    changeArtists(data) {
      this.artists = data;
    },
    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      let data = {
        group_id: this.group_id,
        group_name: this.group_name,
        artists: this.artists,
        details: this.details,
      };
      const formData = new FormData();
      if (this.update_cover) {
        data = {
          ...data,
          old_cover_url: this.old_cover_url,
          old_cover_on_server: this.old_cover_on_server,
          cover_on_server: this.cover_on_server,
        };
        console.log(data.old_cover_on_server);
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

      formData.append("group", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "updateGroup",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeUpdateGroupPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    async isUpdateGroupPopActive() {
      if (!this.isUpdateGroupPopActive) this.error = "";
      if (this.isUpdateGroupPopActive) {
        this.changeDataUploadStatus(false);
        await this.group_id;
        const group = await this.$store.dispatch("fetchGroupById", {
          id: this.group_id,
        });
        this.fillData(group);
        this.changeDataUploadStatus(true);
      }
    },
  },
};
</script>
