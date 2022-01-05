<template>
  <div class="albums-list-constainer">
    <h4>Albums</h4>
    <div class="list-block">
      <h4 v-if="albums.length == 0">No albums</h4>
      <div class="list" v-if="albums.length > 0">
        <div class="list-element" v-for="album in albums" :key="album.album_id">
          <router-link :to="`/albums/${album.album_id}`">
            <p class="list-title">{{ album.album_title }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["albums"],
};
</script>

<style lang="scss" scoped>
.list-block {
  margin: 0 70px;
  .list {
    display: flex;
    align-items: center;
    flex-direction: column;
    grid-gap: 5px;
    .list-element {
      display: flex;
      width: 70%;
      white-space: nowrap;
      align-items: center;
      justify-content: center;
      padding: 5px 10px;
      height: 40px;
      border: 2px solid black;
      border-radius: 25px;
    }
  }
}
</style>
