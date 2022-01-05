<template>
  <div class="admin-users">
    <table>
      <thead>
        <tr>
          <th>User Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Login</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody v-if="users.length == 0">
        <tr>
          <td colspan="7">No users</td>
        </tr>
      </tbody>
      <tbody v-if="users.length > 0">
        <tr v-for="user in users" :key="user.user_id">
          <td>{{ user.user_id }}</td>
          <td>{{ user.first_name || "" }}</td>
          <td>{{ user.last_name || "" }}</td>
          <td>{{ user.login || "" }}</td>
          <td>{{ user.email || "" }}</td>
          <td>{{ user.role }}</td>
          <td v-if="getUserId != user.user_id">
            <ButtonFunction
              btn_text="ChangeRole"
              @click="handleClick(user.user_id, user.role_id)"
            />
          </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
    <ChangeRolePopUp :roles="getRoles" :user_id="user_id" :role_id="role_id" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ButtonFunction from "@/components/ButtonFunction.vue";
import ChangeRolePopUp from "./pop-ups/ChangeRolePopUp.vue";

export default {
  name: "UsersTable",
  data() {
    return {
      user_id: "",
      role_id: "",
    };
  },
  props: ["users"],
  components: { ChangeRolePopUp, ButtonFunction },
  methods: {
    ...mapActions(["changeRolePopUpActivity"]),
    handleClick(user_id, role_id) {
      this.user_id = user_id;
      this.role_id = role_id;
      this.changeRolePopUpActivity(true);
    },
  },
  computed: {
    ...mapGetters("user", ["getRoles", "getUserId"]),
  },
};
</script>

<style lang="scss" scoped>
.admin-users {
  padding: 10px 0;
  overflow-x: scroll;
  table {
    border-spacing: 1;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    width: 90%;
    margin: 0 auto;
    position: relative;
    thead,
    tbody {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
      tr {
        font-family: OpenSans-Regular;
        font-size: 15px;
        color: #808080;
        line-height: 1.2;
        font-weight: unset;
        height: 40px;
      }
      tr:nth-child(even) {
        background-color: #f5f5f5;
      }
    }
    thead {
      tr {
        color: white;
        height: 60px;
        background: #36304a;
      }
    }
    td {
      display: table-cell;
      vertical-align: inherit;
      padding: 0 5px;
    }
    td:last-child {
      padding: 0;
    }
  }
}
</style>
