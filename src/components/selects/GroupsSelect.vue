<template>
  <div class="input-block">
    <p class="form-field-title">Select groups</p>
    <VueMultiselect
      v-model="groups"
      :options="getGroups"
      :multiple="true"
      :close-on-select="true"
      placeholder="Select groups"
      label="group_name"
      track-by="group_id"
    >
    </VueMultiselect>
    <ButtonFunction
      btn_text="+"
      @click="changeCreateGroupPopUpActivity(true)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";
import ButtonFunction from "@/components/ButtonFunction.vue";

export default {
  name: "GroupsSelect",
  props: ["exist_groups"],
  data() {
    return {
      groups: [],
    };
  },
  components: { VueMultiselect, ButtonFunction },
  computed: {
    ...mapGetters(["getGroups", "isCreateGroupPopActive"]),
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeCreateGroupPopUpActivity"]),
    emitPickedGroups() {
      this.$emit(
        "pickedGroups",
        this.groups?.map((group) => group.group_id) || []
      );
    },
  },
  watch: {
    groups() {
      this.emitPickedGroups();
    },
    exist_groups() {
      this.groups = this.exist_groups;
    },
    async isCreateGroupPopActive() {
      if (!this.isCreateGroupPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchGroups", {});
        this.changeDataUploadStatus(true);
      }
    },
  },
  async created() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchGroups", {});
    this.changeDataUploadStatus(true);
  },
};
</script>

<style></style>
