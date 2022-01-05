<template>
  <div class="artists-container">
    <div class="cover-image-container">
      <img
        class="cover-image"
        :src="artist.cover_url"
        v-if="artist.cover_url"
        alt="Artist cover image"
      />
    </div>
    <h2>{{ artist.nick_name }}</h2>
    <div class="add-text">
      <span>{{ artist.first_name }} {{ artist.last_name }}</span>
      <div class="group-title" v-if="artist.group.group_name">
        <p>In group:</p>
        <router-link :to="`/groups/${artist.group.group_id}`">
          <p class="link-title">
            {{ artist.group.group_name }}
          </p>
        </router-link>
      </div>
    </div>
    <div class="description-block">
      {{ artist.details }}
    </div>
    <div class="tabs-block">
      <div class="buttons-block">
        <button
          :class="`tab-button ${active_tracks ? 'active' : ''}`"
          @click="active_tracks = true"
        >
          Tracks
        </button>
        <button
          :class="`tab-button ${!active_tracks ? 'active' : ''}`"
          @click="active_tracks = false"
        >
          Albums
        </button>
      </div>
      <TrackListProp
        class="tab"
        v-if="active_tracks"
        :tracks="artist.tracks || []"
      />
      <AlbumListProp
        class="tab"
        v-if="!active_tracks"
        :albums="artist.albums || []"
      />
    </div>
  </div>
</template>

<script>
import TrackListProp from "@/components/lists/TrackListProp.vue";
import AlbumListProp from "@/components/lists/AlbumListProp.vue";
import { mapActions } from "vuex";

export default {
  name: "ArtistPage",
  components: {
    TrackListProp,
    AlbumListProp,
  },
  data() {
    return {
      active_tracks: true,
      artist: { albums: [], tracks: [], group: {} },
    };
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "ArtistPage") {
      this.changeDataUploadStatus(false);
      const artist = await this.$store.dispatch("fetchArtistById", {
        id: to.params.id,
      });
      if (!artist) this.$router.push("/404");
      this.artist = artist;
      this.changeDataUploadStatus(true);
    }
    next();
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    const artist = await this.$store.dispatch("fetchArtistById", {
      id: this.$route.params.id,
    });
    if (!artist) this.$router.push("/404");
    this.artist = artist;
    this.changeDataUploadStatus(true);
  },
};
</script>

<style lang="scss" scoped>
.artists-container {
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
  .tabs-block {
    width: 100%;
    .buttons-block {
      display: flex;
      justify-content: center;
      .tab-button {
        outline: none;
        border: none;
        background: var(--btn-first-bg);
        color: whitesmoke;
        font-weight: 600;
        font-size: 16px;
        padding: 5px 10px;
        cursor: pointer;
      }
      .tab-button:hover {
        background: var(--btn-first-hover-bg);
      }
      .tab-button.active {
        background: var(--btn-first-hover-bg);
      }
    }
  }
}
</style>
