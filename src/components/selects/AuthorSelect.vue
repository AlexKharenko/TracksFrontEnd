<template>
  <div class="input-block">
    <p class="form-field-title">Select author</p>
    <VueMultiselect
      v-model="author"
      :options="selectOptions"
      :multiple="false"
      :close-on-select="true"
      placeholder="Select author"
      label="title"
      track-by="id"
    >
    </VueMultiselect>
    <div class="button-block">
      <ButtonFunction
        btn_text="+ Artist"
        @click="changeCreateArtistPopUpActivity(true)"
      />
      <ButtonFunction
        btn_text="+ Group"
        @click="changeCreateGroupPopUpActivity(true)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";
import ButtonFunction from "@/components/ButtonFunction.vue";

export default {
  name: "AuthorSelect",
  props: ["exist_author"],
  data() {
    return {
      author: null,
    };
  },
  components: { VueMultiselect, ButtonFunction },
  computed: {
    ...mapGetters([
      "getArtists",
      "getGroups",
      "isCreateArtistPopActive",
      "isCreateGroupPopActive",
    ]),
    selectOptions() {
      return [
        ...this.getArtists.map((artist) => {
          artist.title = artist.nick_name;
          artist.id = `a${artist.artist_id}`;
          return artist;
        }),
        ...this.getGroups.map((group) => {
          group.title = group.group_name;
          group.id = `g${group.group_id}`;
          return group;
        }),
      ];
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions([
      "changeCreateArtistPopUpActivity",
      "changeCreateGroupPopUpActivity",
    ]),
    emitPickedArtists() {
      this.$emit("pickedAuthor", this.author);
    },
  },
  watch: {
    author() {
      this.emitPickedArtists();
    },
    exist_author() {
      this.author = this.exist_author;
    },
    async isCreateArtistPopActive() {
      if (!this.isCreateArtistPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchArtists", {});
        this.changeDataUploadStatus(true);
      }
    },
    async isCreateGroupPopActive() {
      if (!this.isCreateGroupPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchGroups", {});
        this.changeDataUploadStatus(true);
      }
    },
  },
  async created() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchArtists", {});
    await this.$store.dispatch("fetchGroups", {});
    this.changeDataUploadStatus(true);
  },
};
</script>

<style></style>
