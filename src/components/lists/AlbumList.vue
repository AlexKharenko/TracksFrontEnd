<template>
  <div class="list-block">
    <h4 v-if="getAlbums.length == 0">No albums</h4>
    <div class="list" v-if="getAlbums.length > 0">
      <div
        class="list-element"
        v-for="album in getAlbums"
        :key="album.album_id"
      >
        <router-link :to="`/albums/${album.album_id}`">
          <p class="list-title">{{ album.album_title }}</p>
        </router-link>
        <router-link
          :to="
            album.author.is_group
              ? `/groups/${album.author.group_id}`
              : `/artists/${album.author.artist_id}`
          "
        >
          <p class="list-title">
            {{
              album.author.is_group
                ? album.author.group_name
                : album.author.nick_name
            }}
          </p>
        </router-link>
        <div class="release-year">
          {{ getYear(album.release_date) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getAlbums"]),
  },
  methods: {
    getYear(timestamp) {
      if (timestamp) return new Date(timestamp).getFullYear();
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.list-block {
  margin: 0 70px 20px 70px;
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
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      overflow: hidden;
      grid-gap: 5px;
    }
  }
}
</style>
