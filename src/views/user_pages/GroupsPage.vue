<template>
  <div class="page-container">
    <h3>Groups</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find group by name"
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
    <GroupsList />
    <ButtonFunction v-if="!no_more" btn_text="More" @click="moreGroups()" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import GroupsList from "@/components/lists/GroupList.vue";
import VueMultiselect from "vue-multiselect";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GroupsPage",
  components: {
    ButtonFunction,
    GroupsList,
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
    ...mapGetters(["getGroups"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    defaultLimitations() {
      this.limit = 10;
      this.offset = 0;
    },
    async moreGroups() {
      this.offset += this.limit;
      this.changeDataUploadStatus(false);
      const { no_more } = await this.$store.dispatch("fetchGroups", {
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
      if (from.path == "/groups") this.$store.dispatch("clearGroupsState");
    },
    filter_name() {
      if (this.filter_name == "") this.filter_data.name = this.filter_name;
    },
    async order_by() {
      this.changeDataUploadStatus(false);
      this.defaultLimitations();
      const { no_more } = await this.$store.dispatch("fetchGroups", {
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
        const { no_more } = await this.$store.dispatch("fetchGroups", {
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
    const { no_more } = await this.$store.dispatch("fetchGroups", {
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

<style></style>
