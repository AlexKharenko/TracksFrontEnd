<template>
  <div class="login-signup-container">
    <h1>Sign up</h1>
    <form @submit.prevent="handleSubmit">
      <div class="input-block">
        <p class="form-field-title">Name</p>
        <input
          v-model.trim="first_name"
          class="form-field"
          :class="v$.first_name.$error ? 'invalid-input' : ''"
          type="text"
          name="first_name"
          placeholder="Name"
        />
        <p
          v-if="v$.first_name.$dirty && v$.first_name.required.$invalid"
          class="invalid-message"
        >
          Required field
        </p>
      </div>
      <div class="input-block">
        <p class="form-field-title">Surname</p>
        <input
          v-model.trim="last_name"
          class="form-field"
          :class="v$.last_name.$error ? 'invalid-input' : ''"
          type="text"
          name="last_name"
          placeholder="Surname"
        />
        <p
          v-if="v$.last_name.$dirty && v$.last_name.required.$invalid"
          class="invalid-message"
        >
          Required field
        </p>
      </div>
      <div class="input-block">
        <p class="form-field-title">Login</p>
        <input
          @input="login_exist = false"
          v-model.trim="login"
          class="form-field"
          :class="v$.login.$error ? 'invalid-input' : ''"
          type="text"
          name="login"
          placeholder="Login"
        />
        <p v-if="login_exist" class="invalid-message">Login is already taken</p>
        <p
          v-if="v$.login.$dirty && v$.login.required.$invalid"
          class="invalid-message"
        >
          Required field
        </p>
        <p
          v-if="v$.login.$dirty && v$.login.minLength.$invalid"
          class="invalid-message"
        >
          Should be at least 3 long
        </p>
        <p
          v-if="v$.login.$dirty && v$.login.maxLength.$invalid"
          class="invalid-message"
        >
          Should be shorter than 40 long
        </p>
      </div>
      <div class="input-block">
        <p class="form-field-title">Email</p>
        <input
          @input="email_exist = false"
          v-model.trim="email"
          class="form-field"
          :class="v$.email.$error ? 'invalid-input' : ''"
          type="text"
          name="email"
          placeholder="Email"
          id="email"
        />
        <p v-if="email_exist" class="invalid-message">Email already exist</p>
        <p
          v-if="v$.email.$dirty && v$.email.required.$invalid"
          class="invalid-message"
        >
          Required field
        </p>
        <p
          v-if="v$.email.$dirty && v$.email.email.$invalid"
          class="invalid-message"
        >
          Shold be email: example "a@a.co"
        </p>
      </div>
      <div class="input-block">
        <p class="form-field-title">Password</p>
        <input
          v-model.trim="password"
          :type="show_password ? 'text' : 'password'"
          class="form-field"
          :class="v$.password.$error ? 'invalid-input' : ''"
          name="password"
          placeholder="Password"
          id="password"
        />
        <p
          v-if="v$.password.$dirty && v$.password.required.$invalid"
          class="invalid-message"
        >
          Required field
        </p>
        <p
          v-if="
            v$.password.$dirty &&
            (v$.password.maxLength.$invalid || v$.password.minLength.$invalid)
          "
          class="invalid-message"
        >
          Password should be between 6 and 18 long
        </p>
      </div>
      <div class="input-block">
        <p class="form-field-title">Password confirmation</p>
        <input
          v-model.trim="password_confirm"
          :type="show_password ? 'text' : 'password'"
          class="form-field"
          :class="v$.password_confirm.$error ? 'invalid-input' : ''"
          name="password_confirm"
          placeholder="Password confirmation"
          id="password_confirm"
        />
        <p
          v-if="
            v$.password_confirm.$dirty && v$.password_confirm.required.$invalid
          "
          class="invalid-message"
        >
          Required field
        </p>
        <p
          v-if="
            v$.password_confirm.$dirty && v$.password_confirm.sameAs.$invalid
          "
          class="invalid-message"
        >
          Should match the password
        </p>
      </div>
      <div class="show-password-block">
        <input type="checkbox" id="show_password" v-model="show_password" />
        <label for="show_password">Show Password</label>
      </div>
      <ButtonSubmit :btn_text="'Sign up'" />
    </form>
    <p>
      If you are already registered, please
      <router-link to="/login">Log in</router-link>
    </p>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
} from "@vuelidate/validators";
import { mapActions, mapGetters } from "vuex";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
export default {
  name: "LogIn",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      login: "",
      password: "",
      password_confirm: "",
      email_exist: false,
      login_exist: false,
      show_password: false,
    };
  },
  components: {
    ButtonSubmit,
  },
  computed: {
    ...mapGetters("log_in", ["isLoggedIn"]),
  },
  validations() {
    return {
      first_name: { required },
      last_name: { required },
      login: { required, minLength: minLength(3), maxLength: maxLength(40) },
      email: { required, email },
      password: { required, minLength: minLength(6), maxLength: maxLength(18) },
      password_confirm: { required, sameAs: sameAs(this.password) },
    };
  },
  methods: {
    ...mapActions("log_in", ["SignUp"]),
    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$error) {
        return 0;
      }
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        login: this.login,
        password: this.password,
      };
      const { email_exist, login_exist } = await this.SignUp(data);
      this.login_exist = login_exist || false;
      this.email_exist = email_exist || false;
    },
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.$router.push("/");
      }
    },
  },
};
</script>
