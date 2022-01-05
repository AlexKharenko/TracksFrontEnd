<template>
  <div class="albums-container">
    <div class="cover-image-container">
      <img
        class="cover-image"
        :src="album.cover_url"
        v-if="album.cover_url"
        alt="Album cover image"
      />
    </div>
    <h3>{{ album.album_title }} {{ getYear(album.release_date) }}</h3>
    <div class="add-text">
      <router-link
        :to="
          album?.author?.is_group
            ? `/groups/${album.author.group_id}`
            : `/artists/${album.author.artist_id}`
        "
      >
        <p class="list-title">
          {{
            album?.author?.is_group
              ? album.author.group_name
              : album.author.nick_name
          }}
        </p>
      </router-link>
    </div>
    <div class="description-block">
      {{ album.details }}
    </div>
    <TrackListProp class="tracks-block" :tracks="album.tracks" />
  </div>
</template>

<script>
// import ButtonFunction from "@/components/ButtonFunction.vue";
import TrackListProp from "@/components/lists/TrackListProp.vue";
import { mapActions } from "vuex";

export default {
  name: "AlbumsPage",
  components: {
    TrackListProp,
    // ButtonFunction,
  },
  data() {
    return {
      album: { author: {}, tracks: [] },
    };
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    getYear(timestamp) {
      if (timestamp) return new Date(timestamp).getFullYear();
      return "";
    },
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "AlbumPage") {
      this.changeDataUploadStatus(false);
      const album = await this.$store.dispatch("fetchAlbumById", {
        id: to.params.id,
      });
      if (!album) this.$router.push("/404");
      this.album = album;
      this.changeDataUploadStatus(true);
    }
    next();
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    const album = await this.$store.dispatch("fetchAlbumById", {
      id: this.$route.params.id,
    });
    if (!album) this.$router.push("/404");
    this.album = album;
    this.changeDataUploadStatus(true);
  },
};
</script>

<style lang="scss" scoped>
.albums-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .cover-image-container {
    height: 400px;
    width: 400px;
    overflow: hidden;
    margin-bottom: 20px;
    img {
      height: inherit;
      width: inherit;
      object-fit: cover;
    }
  }
  .add-text {
    margin-top: 5px;
    grid-gap: 5px;
    .group-title {
      display: flex;
    }
  }
  .description-block {
    margin: 40px 0;
    max-width: 1000px;
    max-height: 500px;
    overflow-y: scroll;
  }
  .tracks-block {
    width: 100%;
  }
}
</style>
