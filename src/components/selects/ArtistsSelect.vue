<template>
  <div class="input-block">
    <p class="form-field-title">Select artists</p>
    <VueMultiselect
      v-model="artists"
      :options="getArtists"
      :multiple="true"
      :close-on-select="true"
      placeholder="Select artists"
      label="nick_name"
      track-by="artist_id"
    >
    </VueMultiselect>
    <ButtonFunction
      btn_text="+"
      @click="changeCreateArtistPopUpActivity(true)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";
import ButtonFunction from "@/components/ButtonFunction.vue";

export default {
  name: "ArtistsSelect",
  props: ["exist_artists"],
  data() {
    return {
      artists: [],
    };
  },
  components: { VueMultiselect, ButtonFunction },
  computed: {
    ...mapGetters(["getArtists", "isCreateArtistPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateArtistPopUpActivity"]),
    emitPickedArtists() {
      this.$emit(
        "pickedArtists",
        this.artists?.map((artist) => artist.artist_id) || []
      );
    },
  },
  watch: {
    artists() {
      this.emitPickedArtists();
    },
    exist_artists() {
      this.artists = this.exist_artists;
    },
    async isCreateArtistPopActive() {
      if (!this.isCreateArtistPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchArtists", {});
        this.changeDataUploadStatus(true);
      }
    },
  },
  async created() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchArtists", {});
    this.changeDataUploadStatus(true);
  },
};
</script>

<style></style>
