<template>
  <div class="list-block">
    <h4 v-if="getGroups.length == 0">No groups</h4>
    <div class="list" v-if="getGroups.length > 0">
      <div
        class="list-element"
        v-for="group in getGroups"
        :key="group.group_id"
      >
        <router-link :to="`/groups/${group.group_id}`">
          <p class="list-title">{{ group.group_name }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getGroups"]),
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
      display: flex;
      justify-content: center;
      .authors-block {
        display: flex;
        max-width: 500px;
        overflow: hidden;
      }
    }
  }
}
</style>
