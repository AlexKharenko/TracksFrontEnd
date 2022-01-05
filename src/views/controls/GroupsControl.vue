<template>
  <div class="groups-container">
    <h3>Groups</h3>
    <div class="search-block">
      <input
        type="text"
        v-model="filter_name"
        placeholder="Find group by name"
      />
      <ButtonFunction btn_text="Find" @click="handleFindClick()" />
    </div>
    <div class="control-buttons-block">
      <ButtonFunction
        btn_text="Create group"
        @click="changeCreateGroupPopUpActivity(true)"
      />
    </div>
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
          <div class="buttons-block">
            <div
              class="simple-btn btn-icon"
              @click="handleUpdateClick(group.group_id)"
            >
              <img src="../../assets/icons/update.png" alt="Update group" />
            </div>
            <div
              class="simple-btn btn-icon"
              @click="handleDeleteClick(group.group_id)"
            >
              <img src="../../assets/icons/delete.png" alt="Delete group" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateGroupPopUp />
    <UpdateGroupPopUp :group_id="group_id" />
    <DeletePopUp type="group" :id="group_id" :title="getGroupNameById" />
  </div>
</template>

<script>
import ButtonFunction from "@/components/ButtonFunction.vue";
import CreateGroupPopUp from "@/components/pop-ups/group/CreateGroupPopUp.vue";
import UpdateGroupPopUp from "@/components/pop-ups/group/UpdateGroupPopUp.vue";
import DeletePopUp from "@/components/pop-ups/DeletePopUp.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GroupsControl",
  components: {
    ButtonFunction,
    CreateGroupPopUp,
    UpdateGroupPopUp,
    DeletePopUp,
  },
  data() {
    return {
      group_id: "",
      filter_name: "",
    };
  },
  computed: {
    ...mapGetters([
      "getGroups",
      "isCreateGroupPopActive",
      "isUpdateGroupPopActive",
    ]),
    getGroupNameById() {
      return this.getGroups.filter(
        (group) => group.group_id == this.group_id
      )[0]?.group_name;
    },
  },
  methods: {
    ...mapActions("uploading", ["changeDataUploadStatus"]),
    ...mapActions([
      "changeCreateGroupPopUpActivity",
      "changeUpdateGroupPopUpActivity",
      "changeDeletePopUpActivity",
    ]),
    async handleFindClick() {
      this.changeDataUploadStatus(false);
      await this.$store.dispatch("fetchGroups", {
        data: { name: this.filter_name },
      });
      this.changeDataUploadStatus(true);
    },
    handleDeleteClick(group_id) {
      this.group_id = group_id;
      this.changeDeletePopUpActivity(true);
    },
    handleUpdateClick(group_id) {
      this.group_id = group_id;
      this.changeUpdateGroupPopUpActivity(true);
    },
  },
  watch: {
    async isCreateGroupPopActive() {
      if (!this.isCreateGroupPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchGroups", {});
        this.changeDataUploadStatus(true);
      }
    },
    async isUpdateGroupPopActive() {
      if (!this.isUpdateGroupPopActive) {
        this.changeDataUploadStatus(false);
        await this.$store.dispatch("fetchGroups", {});
        this.changeDataUploadStatus(true);
      }
    },
    $route(to, from) {
      if (from.path == "/control/groups")
        this.$store.dispatch("clearGroupsState");
    },
  },
  async mounted() {
    this.changeDataUploadStatus(false);
    await this.$store.dispatch("fetchGroups", {});
    this.changeDataUploadStatus(true);
  },
};
</script>

<style lang="scss" scoped>
.list-block {
  margin: 20px 70px;
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
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      .authors-block {
        display: flex;
        max-width: 500px;
        overflow: hidden;
      }
      .buttons-block {
        display: flex;
        justify-content: flex-end;
        grid-gap: 5px;
        .simple-btn {
          height: 30px;
          width: 30px;
          overflow: hidden;
          cursor: pointer;
          img {
            height: inherit;
            width: inherit;
            object-fit: fill;
          }
        }
      }
    }
  }
}
</style>
