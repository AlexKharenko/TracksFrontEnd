<template>
  <div class="file-upload-block">
    <p class="form-input-title">{{ title }}</p>
    <div class="radiobutton-bar">
      <div class="radio-block">
        <input type="radio" id="link" :value="false" v-model="on_server" />
        <label class="radio-lable" :class="on_server ? 'active' : ''" for="link"
          >Link</label
        >
      </div>
      <div class="radio-block">
        <input type="radio" id="server" :value="true" v-model="on_server" />
        <label
          class="radio-lable"
          :class="on_server ? 'active' : ''"
          for="server"
          >On server</label
        >
      </div>
    </div>
    <div class="form-block">
      <div class="file-input-block" v-if="on_server">
        <input
          type="file"
          @change="handleFileUpload($event)"
          class="file-input"
          :accept="types"
        />
      </div>
      <div class="file-input-block url" v-if="!on_server">
        <p class="form-field-title">Link:</p>
        <input
          type="text"
          @input="handleUrlUpload()"
          v-model="url"
          class="url-input"
        />
        <p v-if="v$.url.$dirty && v$.url.url.$invalid" class="invalid-message">
          Should be url
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { url } from "@vuelidate/validators";

export default {
  name: "FileUpload",
  props: ["types", "title"],
  data() {
    return { on_server: false, url: "" };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      url: { url },
    };
  },
  methods: {
    handleFileUpload(e) {
      if (e.target.files[0] == undefined) {
        this.$emit("fileUpload", {
          file: "",
          on_server: false,
        });
        return;
      }
      this.$emit("fileUpload", {
        file: e.target.files[0],
        on_server: this.on_server,
      });
    },
    handleUrlUpload() {
      this.v$.$touch();
      if (this.v$.$error) {
        return;
      }
      this.$emit("fileUpload", {
        url: this.url,
        on_server: this.on_server,
      });
    },
  },
  mounted() {
    this.url = "";
  },
};
</script>

<style lang="scss" scoped>
.file-upload-block {
  text-align: center;
  .form-input-title {
    margin: 10px 0 5px 0;
    font-size: 18px;
  }
  .radiobutton-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 10px;
  }
  .form-block {
    .file-input-block.url {
      display: grid;
      grid-template-columns: 1fr 3fr;
    }
  }
  margin-bottom: 20px;
}
</style>
