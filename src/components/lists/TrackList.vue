<template>
  <div class="list-block">
    <h4 v-if="getTracks.length == 0">No tracks</h4>
    <div class="list" v-if="getTracks.length > 0">
      <div
        class="list-element"
        v-for="track in getTracks"
        :key="track.track_id"
      >
        <router-link :to="`/tracks/${track.track_id}`">
          <p class="list-title">{{ track.title }}</p>
        </router-link>
        <div class="authors-block">
          <router-link
            v-for="group in track.groups"
            :key="group.group_id"
            :to="`/groups/${group.group_id}`"
          >
            <p class="list-title">{{ `${group.group_name}` }},</p>
          </router-link>
          <router-link
            v-for="artist in track.artists"
            :key="artist.artist_id"
            :to="`/artists/${artist.artist_id}`"
          >
            <p class="list-title">{{ `${artist.nick_name}` }},</p>
          </router-link>
        </div>
        <div class="duration-text">
          Duration: {{ formatDuration(track.duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getTracks"]),
  },
  methods: {
    formatDuration(duration) {
      return `${Math.floor(duration / 60)}:${
        duration % 60 < 10 ? "0" + (duration % 60) : duration % 60
      }`;
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
      text-align: start;
      .authors-block {
        display: flex;
        grid-gap: 5px;
        max-width: 500px;
        overflow: hidden;
      }
      .duration-text {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
