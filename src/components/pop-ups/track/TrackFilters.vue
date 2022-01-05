<template>
  <teleport to="#pop-up" v-if="isFilterTracksPopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <button
          class="btn close-pop-btn btn-margin"
          @click="changeFilterTracksPopUpActivity(false)"
        >
          Close<!-- <img src="../assets/icons/close.png" /> -->
        </button>
        <form @submit.prevent="handleSubmit">
          <div class="filter-block">
            <h4>Filters</h4>
            <div class="options-block">
              <GenreSelect
                @pickedGenre="changeGenre"
                :exist_genre="exist_genres"
                :mulitple="true"
              />
            </div>
          </div>
          <ButtonSubmit :btn_text="'Filter'" />
        </form>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import GenreSelect from "@/components/selects/GenreSelect.vue";
export default {
  name: "FilterTracksPopUp",
  components: {
    ButtonSubmit,
    GenreSelect,
  },
  props: ["exist_genres"],
  emits: ["passGenres"],
  data() {
    return {
      genres: "",
    };
  },
  computed: {
    ...mapGetters(["isFilterTracksPopActive"]),
  },
  methods: {
    ...mapActions(["changeFilterTracksPopUpActivity"]),
    changeGenre(data) {
      this.genres = data;
    },
    handleSubmit() {
      this.changeFilterTracksPopUpActivity(false);
      this.$emit("passGenres", this.genres);
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-block {
  h4 {
    margin-bottom: 5px;
  }
  .options-block {
    margin-bottom: 20px;
  }
}
</style>
