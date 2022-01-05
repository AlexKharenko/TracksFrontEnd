<template>
  <div class="tracks-container">
    <div class="cover-image-container">
      <img
        class="cover-image"
        :src="track.cover_url"
        v-if="track.cover_url"
        alt="Track cover image"
      />
    </div>
    <h2>{{ track.title }}</h2>
    <div class="add-text">
      <AuthorListProp
        v-if="track.artists || track.groups"
        :groups="track.groups"
        :artists="track.artists || []"
      />
      <div v-if="track.album" class="album-block">
        <p>Album:</p>
        <div class="list-element">
          <router-link :to="`/albums/${track.album.album_id}`">
            <p class="list-title">{{ track.album.album_title }}</p>
          </router-link>
        </div>
      </div>
      <div class="duration-text">Genre: {{ track.genre_name }}</div>
      <div class="duration-text">
        Duration: {{ formatDuration(track.duration) }}
      </div>
      <p>Year: {{ getYear(track.release_date) }}</p>
    </div>

    <audio v-if="track.track_url" :src="track.track_url" controls />
    <div class="description-block">
      {{ track.lyrics }}
    </div>
  </div>
</template>

<script>
import AuthorListProp from "@/components/lists/AuthorListProp.vue";
import { mapActions } from "vuex";

export default {
  name: "TrackPage",
  components: {
    AuthorListProp,
  },
  data() {
    return {
      track: { album: {}, groups: [], artists: [] },
    };
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    formatDuration(duration) {
      return `${Math.floor(duration / 60)}:${
        duration % 60 < 10 ? "0" + (duration % 60) : duration % 60
      }`;
    },
    getYear(timestamp) {
      if (timestamp) return new Date(timestamp).getFullYear();
      return "";
    },
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "TrackPage") {
      this.changeDataUploadStatus(false);
      const track = await this.$store.dispatch("fetchTrackById", {
        id: to.params.id,
      });
      if (!track) this.$router.push("/404");
      this.track = track;
      this.changeDataUploadStatus(true);
    }
    next();
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    const track = await this.$store.dispatch("fetchTrackById", {
      id: this.$route.params.id,
    });
    if (!track) this.$router.push("/404");
    this.track = track;
    this.changeDataUploadStatus(true);
  },
};
</script>

<style lang="scss" scoped>
.tracks-container {
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
  .duration-text {
    margin: 5px;
  }
  .album-block {
    margin-top: 5px;
    display: flex;
    justify-content: center;
  }
  audio {
    margin: 80px 40px;
  }
  .description-block {
    max-width: 500px;
    max-height: 500px;
    overflow-y: scroll;
  }
}
</style>
