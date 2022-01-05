<template>
  <teleport to="#pop-up" v-if="isUpdateArtistPopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeUpdateArtistPopUpActivity(false)"
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
              type="text"
              name="nick_name"
              placeholder="Nick name"
              id="nick_name"
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
            <p class="form-field-title">First name</p>
            <input
              v-model.trim="first_name"
              class="form-field"
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
  name: "UpdateArtist",
  components: {
    ButtonSubmit,
    FileUpload,
  },
  props: ["artist_id"],
  data() {
    return {
      nick_name: "",
      first_name: "",
      last_name: "",
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
      nick_name: { required, maxLength: maxLength(100) },
      first_name: { required, maxLength: maxLength(50) },
      last_name: { required, maxLength: maxLength(50) },
    };
  },
  computed: {
    ...mapGetters(["isUpdateArtistPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeUpdateArtistPopUpActivity"]),
    fillData(data) {
      this.nick_name = data.nick_name || "";
      this.first_name = data.first_name || "";
      this.last_name = data.last_name || "";
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
    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      let data = {
        artist_id: this.artist_id,
        nick_name: this.nick_name,
        first_name: this.first_name,
        last_name: this.last_name,
        details: replaceSpecialSymbol(this.details),
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

      formData.append("artist", JSON.stringify(data));

      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        "updateArtist",
        formData
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeUpdateArtistPopUpActivity(false);
      } else {
        this.error = message;
      }
    },
  },
  watch: {
    async isUpdateArtistPopActive() {
      if (!this.isUpdateArtistPopActive) this.error = "";
      if (this.isUpdateArtistPopActive) {
        this.changeDataUploadStatus(false);
        await this.artist_id;
        const artist = await this.$store.dispatch("fetchArtistById", {
          id: this.artist_id,
        });
        this.fillData(artist);
        this.changeDataUploadStatus(true);
      }
    },
  },
};
</script>
