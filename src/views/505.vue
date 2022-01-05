<template>
  <div class="page-505">
    <h1>505</h1>
    <h3>Server Internal Error</h3>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "505",
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
  },
  mounted() {
    this.changeDataUploadStatus(true);
  },
};
</script>

<style>
.page-505 {
  text-align: center;
}
h1 {
  margin-bottom: 30px;
}
</style>
