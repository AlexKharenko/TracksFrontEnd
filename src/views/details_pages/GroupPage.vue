<template>
  <div class="groups-container">
    <div class="cover-image-container">
      <img
        class="cover-image"
        :src="group.cover_url"
        v-if="group.cover_url"
        alt="Group cover image"
      />
    </div>
    <h2>{{ group.group_name }}</h2>
    <div class="add-text">
      <ArtistListProp v-if="group.artists" :artists="group.artists || []" />
    </div>
    <div class="description-block">
      {{ group.details }}
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
        :tracks="group.tracks || []"
      />
      <AlbumListProp
        class="tab"
        v-if="!active_tracks"
        :albums="group.albums || []"
      />
    </div>
  </div>
</template>

<script>
import ArtistListProp from "@/components/lists/ArtistListProp.vue";
import TrackListProp from "@/components/lists/TrackListProp.vue";
import AlbumListProp from "@/components/lists/AlbumListProp.vue";
import { mapActions } from "vuex";

export default {
  name: "GroupPage",
  components: {
    TrackListProp,
    AlbumListProp,
    ArtistListProp,
  },
  data() {
    return {
      active_tracks: true,
      group: { albums: [], tracks: [], artists: [] },
    };
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "GroupPage") {
      this.changeDataUploadStatus(false);
      const group = await this.$store.dispatch("fetchGroupById", {
        id: to.params.id,
      });
      if (!group) this.$router.push("/404");
      this.group = group;
      this.changeDataUploadStatus(true);
    }
    next();
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    const group = await this.$store.dispatch("fetchGroupById", {
      id: this.$route.params.id,
    });
    if (!group) this.$router.push("/404");
    this.group = group;
    this.changeDataUploadStatus(true);
  },
};
</script>

<style lang="scss" scoped>
.groups-container {
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
