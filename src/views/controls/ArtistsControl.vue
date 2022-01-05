<template>
  <div class="artists-container">
    <h3>Artists</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find artist by nick"
      />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="control-buttons-block">
      <ButtonFunction
        btn_text="Create artist"
        @keyup.
        @click="changeCreateArtistPopUpActivity(true)"
      />
    </div>
    <div class="list-block">
      <h4 v-if="getArtists.length == 0">No artists</h4>
      <div class="list" v-if="getArtists.length > 0">
        <div
          class="list-element"
          v-for="artist in getArtists"
          :key="artist.artist_id"
        >
          <router-link :to="`/artists/${artist.artist_id}`">
            <p class="list-title">{{ artist.nick_name }}</p>
          </router-link>
          <div class="buttons-block">
            <div
              class="simple-btn btn-icon"
              @click="handleUpdateClick(artist.artist_id)"
            >
              <img src="../../assets/icons/update.png" alt="Update artist" />
            </div>
            <div
              class="simple-btn btn-icon"
              @click="handleDeleteClick(artist.artist_id)"
            >
              <img src="../../assets/icons/delete.png" alt="Delete artist" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateArtistPopUp />
    <UpdateArtistPopUp :artist_id="artist_id" />
    <DeletePopUp type="artist" :id="artist_id" :title="getArtistNickById" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import CreateArtistPopUp from "@/components/pop-ups/artist/CreateArtistPopUp.vue";
import UpdateArtistPopUp from "@/components/pop-ups/artist/UpdateArtistPopUp.vue";
import DeletePopUp from "@/components/pop-ups/DeletePopUp.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ArtistsControl",
  components: {
    ButtonFunction,
    CreateArtistPopUp,
    UpdateArtistPopUp,
    DeletePopUp,
  },
  data() {
    return {
      artist_id: "",
      filter_name: "",
    };
  },
  computed: {
    ...mapGetters([
      "getArtists",
      "isCreateArtistPopActive",
      "isUpdateArtistPopActive",
    ]),
    getArtistNickById() {
      return this.getArtists.filter(
        (artist) => artist.artist_id == this.artist_id
      )[0]?.nick_name;
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions([
      "changeCreateArtistPopUpActivity",
      "changeUpdateArtistPopUpActivity",
      "changeDeletePopUpActivity",
    ]),
    async handleFindClick() {
      this.changeDataUploadStatus(false);
      await this.$store.dispatch("fetchArtists", {
        data: { name: this.filter_name },
      });
      this.changeDataUploadStatus(true);
    },
    handleDeleteClick(artist_id) {
      this.artist_id = artist_id;
      this.changeDeletePopUpActivity(true);
    },
    handleUpdateClick(artist_id) {
      this.artist_id = artist_id;
      this.changeUpdateArtistPopUpActivity(true);
    },
  },
  watch: {
    async isCreateArtistPopActive() {
      if (!this.isCreateArtistPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchArtists", {});
        this.changeDataUploadStatus(true);
      }
    },
    async isUpdateArtistPopActive() {
      if (!this.isUpdateArtistPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchArtists", {});
        this.changeDataUploadStatus(true);
      }
    },
    $route(to, from) {
      if (from.path == "/control/artists")
        this.$store.dispatch("clearArtistsState", {});
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchArtists", {});
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
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      .authors-block {
        display: flex;
        max-width: 500px;
        overflow: hidden;
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
