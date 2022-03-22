<template>
  <h1 v-if="authStatus === 'Authenticatin'">{{ authStatus }}</h1>
  <router-view v-else></router-view>
</template>

<script>
import useAuth from "./modules/auth/composables/useAuth";
export default {
  setup() {
    const { authStatus, checkAuthStatus } = useAuth();

    return { authStatus, checkAuthStatus };
  },
};
</script>
