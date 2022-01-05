<template>
  <div class="albums-container">
    <h3>Albums</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find album by name"
      />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="control-buttons-block">
      <ButtonFunction
        btn_text="Create album"
        @click="changeCreateAlbumPopUpActivity(true)"
      />
    </div>
    <div class="list-block">
      <h4 v-if="getAlbums.length == 0">No albums</h4>
      <div class="list" v-if="getAlbums.length > 0">
        <div
          class="list-element"
          v-for="album in getAlbums"
          :key="album.album_id"
        >
          <router-link :to="`/albums/${album.album_id}`">
            <p class="list-title">{{ album.album_title }}</p>
          </router-link>
          <router-link
            :to="
              album.author.is_group
                ? `/groups/${album.author.group_id}`
                : `/artists/${album.author.artist_id}`
            "
          >
            <p class="list-title">
              {{
                album.author.is_group
                  ? album.author.group_name
                  : album.author.nick_name
              }}
            </p>
          </router-link>
          <div class="buttons-block">
            <div
              class="simple-btn btn-icon"
              @click="handleUpdateClick(album.album_id)"
            >
              <img src="../../assets/icons/update.png" alt="Update album" />
            </div>
            <div
              class="simple-btn btn-icon"
              @click="handleDeleteClick(album.album_id)"
            >
              <img src="../../assets/icons/delete.png" alt="Delete album" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateAlbumPopUp />
    <UpdateAlbumPopUp :album_id="album_id" />
    <DeletePopUp type="album" :id="album_id" :title="getAlbumNameById" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import CreateAlbumPopUp from "@/components/pop-ups/album/CreateAlbumPopUp.vue";
import UpdateAlbumPopUp from "@/components/pop-ups/album/UpdateAlbumPopUp.vue";
import DeletePopUp from "@/components/pop-ups/DeletePopUp.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AlbumsControl",
  components: {
    ButtonFunction,
    CreateAlbumPopUp,
    UpdateAlbumPopUp,
    DeletePopUp,
  },
  data() {
    return {
      album_id: "",
      filter_name: "",
    };
  },
  computed: {
    ...mapGetters([
      "getAlbums",
      "isCreateAlbumPopActive",
      "isUpdateAlbumPopActive",
    ]),
    getAlbumNameById() {
      return this.getAlbums.filter(
        (album) => album.album_id == this.album_id
      )[0]?.title;
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions([
      "changeCreateAlbumPopUpActivity",
      "changeUpdateAlbumPopUpActivity",
      "changeDeletePopUpActivity",
    ]),
    async handleFindClick() {
      this.changeDataUploadStatus(false);
      await this.$store.dispatch("fetchAlbums", {
        data: { name: this.filter_name },
      });
      this.changeDataUploadStatus(true);
    },
    handleDeleteClick(album_id) {
      this.album_id = album_id;
      this.changeDeletePopUpActivity(true);
    },
    handleUpdateClick(album_id) {
      this.album_id = album_id;
      this.changeUpdateAlbumPopUpActivity(true);
    },
  },
  watch: {
    async isCreateAlbumPopActive() {
      if (!this.isCreateAlbumPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchAlbums", {});
        this.changeDataUploadStatus(true);
      }
    },
    async isUpdateAlbumPopActive() {
      if (!this.isUpdateAlbumPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchAlbums", {});
        this.changeDataUploadStatus(true);
      }
    },
    $route(to, from) {
      if (from.path == "/control/albums")
        this.$store.dispatch("clearAlbumsState");
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchAlbums", {});
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
      overflow: hidden;
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
