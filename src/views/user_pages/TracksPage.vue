<template>
  <div class="page-container">
    <h3>Tracks</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find track by name"
      />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="filtration-block">
      <ButtonFunction
        btn_text="Filter"
        @click="changeFilterTracksPopUpActivity(true)"
      />
      <div class="order-by">
        <p class="form-field-title">Order by:</p>
        <VueMultiselect
          class="multiselect"
          selectLabel=""
          deselectLabel=""
          tagPlaceholder=""
          selectedLabel=""
          v-model="order_by"
          :options="order_by_options"
          :searchable="false"
          :close-on-select="true"
          :allow-empty="false"
          placeholder="Select order"
          label="text"
          track-by="id"
        >
        </VueMultiselect>
      </div>
    </div>

    <TracksList />
    <FilterTracksPopUp
      v-if="isFilterTracksPopActive"
      :exist_genres="exist_genres"
      @passGenres="handlePassGenres"
    />
    <ButtonFunction v-if="!no_more" btn_text="More" @click="moreTracks()" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import TracksList from "@/components/lists/TrackList.vue";
import FilterTracksPopUp from "@/components/pop-ups/track/TrackFilters.vue";
import VueMultiselect from "vue-multiselect";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TracksPage",
  components: {
    ButtonFunction,
    TracksList,
    FilterTracksPopUp,
    VueMultiselect,
  },
  data() {
    return {
      limit: this.$route.query.limit || 10,
      offset: this.$route.query.limit || 0,
      order_by: {
        id: 4,
        up: false,
        column: "release_date",
        text: "Down release date",
      },
      order_by_options: [
        { id: 1, up: true, column: "date_added", text: "Up date added" },
        { id: 2, up: false, column: "date_added", text: "Down date added" },
        { id: 3, up: true, column: "release_date", text: "Up release date" },
        { id: 4, up: false, column: "release_date", text: "Down release date" },
        { id: 5, up: true, column: "abc", text: "abc" },
        { id: 6, up: false, column: "abc", text: "cba" },
      ],
      filter_name: "",
      exist_genres: "",
      genres: "",
      filter_data: {},
      init: true,
      no_more: false,
    };
  },
  computed: {
    ...mapGetters(["getTracks", "isFilterTracksPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeFilterTracksPopUpActivity"]),
    defaultLimitations() {
      this.limit = 10;
      this.offset = 0;
    },
    async moreTracks() {
      this.offset += this.limit;
      this.changeDataUploadStatus(false);
      const { no_more } = await this.$store.dispatch("fetchTracks", {
        data: this.filter_data,
        order_by: this.order_by,
        limitations: { limit: this.limit, offset: this.offset },
        more: true,
      });
      if (no_more) this.no_more = no_more;
      this.changeDataUploadStatus(true);
    },
    handlePassGenres(data) {
      this.exist_genres = data;
      this.genres = data.map((genre) => genre.genre_id);
    },
    async handleFindClick() {
      this.filter_data.name = this.filter_name;
    },
  },
  watch: {
    $route(to, from) {
      if (from.path == "/tracks") this.$store.dispatch("clearTracksState");
    },
    genres() {
      this.filter_data.genre = this.genres;
    },
    filter_name() {
      if (this.filter_name == "") this.filter_data.name = this.filter_name;
    },
    async order_by() {
      this.changeDataUploadStatus(false);
      this.defaultLimitations();
      const { no_more } = await this.$store.dispatch("fetchTracks", {
        data: this.filter_data,
        order_by: this.order_by,
        limitations: { limit: this.limit, offset: this.offset },
        returning: true,
      });
      this.no_more = no_more;
      this.changeDataUploadStatus(true);
    },
    async "filter_data.name"() {
      if (!this.init) {
        this.changeDataUploadStatus(false);
        this.defaultLimitations();
        const { no_more } = await this.$store.dispatch("fetchTracks", {
          data: this.filter_data,
          order_by: this.order_by,
          limitations: { limit: this.limit, offset: this.offset },
          returning: true,
        });
        this.no_more = no_more;
        this.changeDataUploadStatus(true);
      }
    },
    async "filter_data.genre"() {
      this.changeDataUploadStatus(false);
      this.defaultLimitations();
      const { no_more } = await this.$store.dispatch("fetchTracks", {
        data: this.filter_data,
        order_by: this.order_by,
        limitations: { limit: this.limit, offset: this.offset },
        returning: true,
      });
      this.no_more = no_more;
      this.changeDataUploadStatus(true);
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    this.defaultLimitations();
    this.filter_name = this.$route.query.name ? this.$route.query.name : "";
    this.filter_data.name = this.$route.query.name
      ? this.$route.query.name
      : "";
    const { no_more } = await this.$store.dispatch("fetchTracks", {
      data: this.filter_data,
      order_by: this.order_by,
      limitations: { limit: this.limit, offset: this.offset },
      returning: true,
    });
    this.no_more = no_more;
    this.init = false;
    this.changeDataUploadStatus(true);
  },
};
</script>
