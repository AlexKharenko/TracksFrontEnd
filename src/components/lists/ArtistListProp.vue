<template>
  <div class="artists-list-constainer">
    <div class="list-block">
      <div class="list" v-if="artists.length > 0">
        <router-link
          class="list-element"
          v-for="artist in artists || [{}]"
          :key="artist.artist_id"
          :to="`/artists/${artist.artist_id}`"
        >
          <p class="list-title">
            {{ `${artist.nick_name}` }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["artists"],
};
</script>

<style lang="scss" scoped>
.list-block {
  margin: 0 70px;
  .list {
    max-width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    grid-gap: 5px;
    .list-element {
      white-space: nowrap;
      align-items: center;
      padding: 5px 10px;
    }
  }
}
</style>
