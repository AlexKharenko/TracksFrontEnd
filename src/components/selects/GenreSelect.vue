<template>
  <div class="input-block">
    <p class="form-field-title">Select genre</p>
    <VueMultiselect
      v-model="genre"
      :options="getGenres"
      :multiple="mulitple || false"
      :close-on-select="true"
      placeholder="Select genre"
      label="genre_name"
      track-by="genre_id"
    >
    </VueMultiselect>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";

export default {
  name: "GenreSelect",
  props: ["exist_genre", "mulitple"],
  data() {
    return {
      genre: null,
    };
  },
  components: { VueMultiselect },
  computed: {
    ...mapGetters(["getGenres", "isCreateGenrePopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateGenrePopUpActivity"]),
    emitPickedGenre() {
      this.$emit("pickedGenre", this.genre);
    },
  },
  watch: {
    genre() {
      this.emitPickedGenre();
    },
    exist_genre() {
      this.genre = this.exist_genre;
    },
  },
  async created() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchGenres", {});
    this.genre = this.exist_genre || "";
    this.changeDataUploadStatus(true);
  },
};
</script>

<style></style>
