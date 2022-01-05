<template>
  <div class="authors-list-constainer">
    <div class="list-block">
      <div class="list" v-if="[...groups, ...artists].length > 0">
        <router-link
          v-for="group in groups || [{}]"
          :key="group.group_id"
          :to="`/groups/${group.group_id}`"
        >
          <p class="list-title">
            {{ `${group.group_name}` }}
          </p>
        </router-link>
        <router-link
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
.list {
  display: flex;
  justify-content: center;
  grid-gap: 10px;
}
</style>
