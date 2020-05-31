<template>
  <v-layout row fill-height class="justify-center align-center">
    <v-flex xs12 md6 lg4>
      <v-card class="elevation-12" shaped>
        <v-card-title>
          <span class="mx-auto headline blue--text font-weight-black">
            Авторизация
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5 pb-0">
          <v-form v-model="valid">
            <v-text-field
              v-model="user.username"
              outlined
              dense
              prepend-icon="mdi-account"
              name="username"
              label="Логин"
              :rules="usernameRules"
            />
            <v-text-field
              v-model="user.password"
              outlined
              dense
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
          <div class="px-2 mx-auto" style="width: 100%">
            <v-btn
              @click="login(user)"
              color="green accent-4"
              dark
              block
              :disabled="!valid"
              :loading="isLoading"
            >
              Войти
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
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
    ...mapGetters(AUTH_NAMESPACE, ['isLoggedIn', 'isLoading']),
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
