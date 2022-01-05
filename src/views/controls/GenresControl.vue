<template>
  <div class="genres-container">
    <h3>Genres</h3>
    <div class="control-buttons-block">
      <ButtonFunction
        btn_text="Create genre"
        @click="changeCreateGenrePopUpActivity(true)"
      />
    </div>
    <div class="list-block">
      <h4 v-if="getGenres.length == 0">No genres</h4>
      <div class="list" v-if="getGenres.length > 0">
        <div
          class="list-element"
          v-for="genre in getGenres"
          :key="genre.genre_id"
        >
          <p class="list-title">{{ genre.genre_name }}</p>

          <div class="buttons-block">
            <div
              class="simple-btn btn-icon"
              @click="handleUpdateClick(genre.genre_id)"
            >
              <img src="../../assets/icons/update.png" alt="Update genre" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateGenrePopUp />
    <UpdateGenrePopUp :genre_id="genre_id" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import CreateGenrePopUp from "@/components/pop-ups/genre/CreateGenrePopUp.vue";
import UpdateGenrePopUp from "@/components/pop-ups/genre/UpdateGenrePopUp.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GenresControl",
  components: {
    ButtonFunction,
    CreateGenrePopUp,
    UpdateGenrePopUp,
  },
  data() {
    return {
      genre_id: "",
    };
  },
  computed: {
    ...mapGetters(["getGenres"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions([
      "changeCreateGenrePopUpActivity",
      "changeUpdateGenrePopUpActivity",
    ]),
    handleUpdateClick(genre_id) {
      this.genre_id = genre_id;
      this.changeUpdateGenrePopUpActivity(true);
    },
  },
  watch: {
    $route(to, from) {
      if (from.path == "/control/genres")
        this.$store.dispatch("clearGenresState");
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchGenres");
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
