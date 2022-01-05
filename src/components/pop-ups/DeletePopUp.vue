<template>
  <teleport to="#pop-up" v-if="isDeletePopActive">
    <div class="pop-up">
      <div class="pop-up-content-container">
        <h3>Do you realy want to delete {{ type }} {{ title }}?</h3>
        <p class="message" v-if="message">{{ message }}</p>
        <div class="buttons-block">
          <ButtonFunction btn_text="Delete" @click="handleDelete" />
          <ButtonFunction
            class="color"
            btn_text="Cancel"
            @click="changeDeletePopUpActivity(false)"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonFunction from "../ButtonFunction.vue";
export default {
  name: "DeletePopUp",
  components: {
    ButtonFunction,
  },
  props: ["id", "type", "title"],
  data() {
    return {
      message: "",
    };
  },
  computed: {
    ...mapGetters(["isDeletePopActive"]),
    functionName() {
      return `delete${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`;
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions(["changeDeletePopUpActivity"]),
    async handleDelete() {
      const data = {};
      data[`${this.type}_id`] = this.id;
      console.log(data, this.functionName);
      this.changeDataUploadStatus(false);
      const { success, message } = await this.$store.dispatch(
        this.functionName,
        data
      );
      this.changeDataUploadStatus(true);
      if (success) {
        this.changeDeletePopUpActivity(false);
      } else {
        this.message = message;
      }
    },
  },
};
</script>

<style scoped>
.buttons-block {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.color {
  background: darkgrey;
}
.color:hover {
  background: rgb(136, 136, 136);
}
</style>
