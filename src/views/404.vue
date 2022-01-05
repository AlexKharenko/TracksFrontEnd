<template>
  <div class="page-404">
    <h1>404</h1>
    <h3>Not Found</h3>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "404",
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
  },
  created() {
    this.changeDataUploadStatus(true);
  },
};
</script>

<style>
.page-404 {
  text-align: center;
}
h1 {
  margin-bottom: 30px;
}
</style>
