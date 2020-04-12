<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-card-title dark class="primary white--text" primary-title>
            Авторизация
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" @submit="login(user)">
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
              >
                Войти
              </v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  data: () => ({
    user: {
      username: null,
      password: null,
    },

    valid: false,

    usernameRules: [
      value => !!value || 'Логин обязателен',
      value => (value && value.length >= 2) || 'Минимальная длина - 2 символа',
    ],

    passwordRules: [
      value => !!value || 'Пароль обязателен',
      value => (value && value.length >= 6) || 'Пароль слишком короткий',
    ],
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isLoggedIn']),
  },

  watch: {
    isLoggedIn() {
      this.$router.push('/');
    },
  },

  methods: {
    ...mapActions(AUTH_NAMESPACE, ['login']),
  },
};
</script>
