<template>
  <div class="authors-list-constainer">
    <h4>Authors</h4>
    <h4 v-if="[...groups, ...artists].length == 0">No authors</h4>
    <div class="list-block">
      <div class="list" v-if="[...groups, ...artists].length > 0">
        <router-link
          class="list-element"
          v-for="group in groups || [{}]"
          :key="group.group_id"
          :to="`/groups/${group.group_id}`"
        >
          <p class="list-title">
            {{ `${group.group_name}` }}
          </p>
        </router-link>
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
  props: ["artists", "groups"],
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
      grid-gap: 5px;
      white-space: nowrap;
      align-items: center;
      padding: 5px 10px;
      height: 40px;
      border: 2px solid black;
      border-radius: 25px;
      width: 70%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
