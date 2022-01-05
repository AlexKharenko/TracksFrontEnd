<template>
  <div class="input-block">
    <p class="form-field-title">Select album</p>
    <VueMultiselect
      v-model="album"
      :options="getAlbums"
      :multiple="false"
      :close-on-select="true"
      placeholder="Select album"
      label="album_title"
      track-by="album_id"
    >
    </VueMultiselect>
    <ButtonFunction
      btn_text="+"
      @click="changeCreateAlbumPopUpActivity(true)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";
import ButtonFunction from "@/components/ButtonFunction.vue";

export default {
  name: "AlbumSelect",
  props: ["exist_album"],
  data() {
    return {
      album: null,
    };
  },
  components: { VueMultiselect, ButtonFunction },
  computed: {
    ...mapGetters(["getAlbums", "isCreateAlbumPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateAlbumPopUpActivity"]),
    emitPickedAlbum() {
      this.$emit("pickedAlbum", this.album);
    },
  },
  watch: {
    album() {
      this.emitPickedAlbum();
    },
    exist_album() {
      this.album = this.exist_album;
    },
    async isCreateAlbumPopActive() {
      if (!this.isCreateAlbumPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchAlbums", {});
        this.changeDataUploadStatus(true);
      }
    },
  },
  async created() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchAlbums", {});
    this.changeDataUploadStatus(true);
  },
};
</script>

<style></style>
