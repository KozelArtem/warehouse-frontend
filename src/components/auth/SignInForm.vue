<template>
  <v-container fluid fill-height full-width>
    <v-layout row wrap>
      <v-flex xs12>
        <v-alert
          v-if="alert !== null"
          v-model="showAlert"
          dismissible
          elevation="2"
          type="error"
          >{{ alert }}</v-alert
        >
        <v-card class="elevation-12">
          <v-toolbar dark color="primary"></v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                v-model="user.username"
                prepend-icon="mdi-account"
                name="username"
                label="Логин"
                :rules="usernameRules"
              />
              <v-text-field
                v-model="user.password"
                prepend-icon="mdi-lock"
                name="password"
                label="Пароль"
                type="password"
                :rules="passwordRules"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              type="submit"
              color="primary"
              :disabled="!valid"
              :loading="loading"
              @click.prevent="onClick"
              >Войти</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api';

const {
  isLoggedIn,
  login,
} = api;

export default {
  data: () => ({
    user: {
      username: null,
      password: null,
    },

    valid: false,
    // TODO use formValidationRules
    usernameRules: [
      value => !!value || 'Логин обязателен',
      value => (value && value.length >= 2) || 'Минимальная длина - 2 символа',
    ],

    passwordRules: [
      value => !!value || 'Пароль обязателен',
      value => (value && value.length >= 6) || 'Пароль слишком короткий',
    ],
    loading: false,

    showAlert: false,
    alert: null,
  }),

  methods: {
    async onClick() {
      this.loading = true;

      const success = await login(this.user);

      this.loading = false;

      if (!success) {
        this.showAlert = true;
        this.alert = 'Проверьте правильность введенных данных';

        return;
      }

      if (isLoggedIn()) {
        this.$router.push('/');
        window.location.reload(true);
      }
    },
  },
};
</script>
