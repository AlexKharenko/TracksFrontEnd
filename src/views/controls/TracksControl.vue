<template>
  <div class="tracks-container">
    <h3>Tracks</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find track by name"
      />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="control-buttons-block">
      <ButtonFunction
        btn_text="Create track"
        @click="changeCreateTrackPopUpActivity(true)"
      />
    </div>
    <div class="list-block">
      <h4 v-if="getTracks.length == 0">No tracks</h4>
      <div class="list" v-if="getTracks.length > 0">
        <div
          class="list-element"
          v-for="track in getTracks"
          :key="track.track_id"
        >
          <router-link :to="`/tracks/${track.track_id}`">
            <p class="list-title">{{ track.title }}</p>
          </router-link>
          <div class="authors-block">
            <router-link
              v-for="group in track.groups"
              :key="group.group_id"
              :to="`/groups/${group.group_id}`"
            >
              <p class="list-title">{{ `${group.group_name}` }},</p>
            </router-link>
            <router-link
              v-for="artist in track.artists"
              :key="artist.artist_id"
              :to="`/artists/${artist.artist_id}`"
            >
              <p class="list-title">{{ `${artist.nick_name}` }},</p>
            </router-link>
          </div>
          <div class="buttons-block">
            <div
              class="simple-btn btn-icon"
              @click="handleUpdateClick(track.track_id)"
            >
              <img src="../../assets/icons/update.png" alt="Update track" />
            </div>
            <div
              class="simple-btn btn-icon"
              @click="handleDeleteClick(track.track_id)"
            >
              <img src="../../assets/icons/delete.png" alt="Delete track" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateTrackPopUp />
    <UpdateTrackPopUp :track_id="track_id" />
    <DeletePopUp type="track" :id="track_id" :title="getTrackNameById" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import CreateTrackPopUp from "@/components/pop-ups/track/CreateTrackPopUp.vue";
import UpdateTrackPopUp from "@/components/pop-ups/track/UpdateTrackPopUp.vue";
import DeletePopUp from "@/components/pop-ups/DeletePopUp.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TracksControl",
  components: {
    ButtonFunction,
    CreateTrackPopUp,
    UpdateTrackPopUp,
    DeletePopUp,
  },
  data() {
    return {
      track_id: "",
      filter_name: "",
    };
  },
  computed: {
    ...mapGetters([
      "getTracks",
      "isCreateTrackPopActive",
      "isUpdateTrackPopActive",
    ]),
    getTrackNameById() {
      return this.getTracks.filter(
        (track) => track.track_id == this.track_id
      )[0]?.title;
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions([
      "changeCreateTrackPopUpActivity",
      "changeUpdateTrackPopUpActivity",
      "changeDeletePopUpActivity",
    ]),
    async handleFindClick() {
      this.changeDataUploadStatus(false);
      await this.$store.dispatch("fetchTracks", {
        data: { name: this.filter_name },
      });
      this.changeDataUploadStatus(true);
    },
    handleDeleteClick(track_id) {
      this.track_id = track_id;
      this.changeDeletePopUpActivity(true);
    },
    handleUpdateClick(track_id) {
      this.track_id = track_id;
      this.changeUpdateTrackPopUpActivity(true);
    },
  },
  watch: {
    async isCreateTrackPopActive() {
      if (!this.isCreateTrackPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchTracks", {});
        this.changeDataUploadStatus(true);
      }
    },
    async isUpdateTrackPopActive() {
      if (!this.isUpdateTrackPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchTracks", {});
        this.changeDataUploadStatus(true);
      }
    },
    $route(to, from) {
      if (from.path == "/control") this.$store.dispatch("clearTracksState");
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchTracks", {});
    this.changeDataUploadStatus(true);
  },
};
</script>

<style lang="scss" scoped>
.list-block {
  margin: 20px 70px;
  .list {
    display: flex;
    align-items: center;
    flex-direction: column;
    grid-gap: 5px;
    .list-element {
      grid-gap: 5px;
      white-space: nowrap;
      align-items: center;
      padding: 5px 10px;
      height: 40px;
      border: 2px solid black;
      border-radius: 25px;
      width: 70%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      text-align: start;
      .authors-block {
        display: flex;
        max-width: 500px;
        overflow: hidden;
        grid-gap: 5px;
      }
      .buttons-block {
        display: flex;
        justify-content: flex-end;
        grid-gap: 5px;
        .simple-btn {
          height: 30px;
          width: 30px;
          overflow: hidden;
          cursor: pointer;
          img {
            height: inherit;
            width: inherit;
            object-fit: fill;
          }
        }
      }
    }
  }
}
</style>
