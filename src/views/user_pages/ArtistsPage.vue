<template>
  <div class="page-container">
    <h3>Artists</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find artist by name"
      />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="filtration-block">
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
    <ArtistsList />
    <ButtonFunction v-if="!no_more" btn_text="More" @click="moreArtists()" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import ArtistsList from "@/components/lists/ArtistList.vue";
import VueMultiselect from "vue-multiselect";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ArtistsPage",
  components: {
    ButtonFunction,
    ArtistsList,
    VueMultiselect,
  },
  data() {
    return {
      limit: 10,
      offset: 0,
      order_by: { id: 1, up: true, column: "abc", text: "abc" },
      order_by_options: [
        { id: 1, up: true, column: "abc", text: "abc" },
        { id: 2, up: false, column: "abc", text: "cba" },
      ],
      filter_name: "",
      filter_data: {},
      init: true,
      no_more: false,
    };
  },
  computed: {
    ...mapGetters(["getArtists"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    defaultLimitations() {
      this.limit = 10;
      this.offset = 0;
    },
    async moreArtists() {
      this.offset += this.limit;
      this.changeDataUploadStatus(false);
      const { no_more } = await this.$store.dispatch("fetchArtists", {
        data: this.filter_data,
        order_by: this.order_by,
        limitations: { limit: this.limit, offset: this.offset },
        more: true,
      });
      if (no_more) this.no_more = no_more;
      this.changeDataUploadStatus(true);
    },
    async handleFindClick() {
      this.filter_data.name = this.filter_name;
    },
  },
  watch: {
    $route(to, from) {
      if (from.path == "/artists") this.$store.dispatch("clearArtistsState");
    },
    filter_name() {
      if (this.filter_name == "") this.filter_data.name = this.filter_name;
    },
    async order_by() {
      this.changeDataUploadStatus(false);
      this.defaultLimitations();
      const { no_more } = await this.$store.dispatch("fetchArtists", {
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
        const { no_more } = await this.$store.dispatch("fetchArtists", {
          data: this.filter_data,
          order_by: this.order_by,
          limitations: { limit: this.limit, offset: this.offset },
          returning: true,
        });
        this.no_more = no_more;
        this.changeDataUploadStatus(true);
      }
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    this.defaultLimitations();
    this.filter_name = this.$route.query.name ? this.$route.query.name : "";
    this.filter_data.name = this.$route.query.name
      ? this.$route.query.name
      : "";
    const { no_more } = await this.$store.dispatch("fetchArtists", {
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
