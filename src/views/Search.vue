<template>
  <div class="page-container">
    <h2>Search</h2>
    <div class="search-block">
      <input type="text" v-model="filter_name" placeholder="Find by name" />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="result-container">
      <TrackListProp class="margin-bottom" :tracks="tracks" />
      <AuthorSearchListProp
        class="margin-bottom"
        :artists="artists"
        :groups="groups"
      />
      <AlbumListProp :albums="albums" />
    </div>
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import TrackListProp from "@/components/lists/TrackListProp.vue";
import AuthorSearchListProp from "@/components/lists/AuthorSearchListProp.vue";
import AlbumListProp from "@/components/lists/AlbumListProp.vue";
import { mapActions } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      filter_name: "",
      tracks: [],
      albums: [],
      artists: [],
      groups: [],
    };
  },
  components: {
    ButtonFunction,
    TrackListProp,
    AlbumListProp,
    AuthorSearchListProp,
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    async handleFindClick() {
      await this.Search();
    },
    async Search() {
      this.changeDataUploadStatus(false);
      const results = await this.$store.dispatch("search", {
        data: { name: this.filter_name },
      });
      this.tracks = results.tracks || [];
      this.albums = results.albums || [];
      this.artists = results.artists || [];
      this.groups = results.groups || [];
      this.changeDataUploadStatus(true);
    },
  },
};
</script>

<style>
.margin-bottom {
  margin: 20px 0;
  padding: 10px 0 20px 0;
  border-bottom: 2px solid black;
}
</style>
