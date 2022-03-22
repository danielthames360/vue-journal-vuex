<template>
  <span class="login100-form-title p-b-41"> Sign in</span>
  <form
    @submit.prevent="onSubmit"
    class="login100-form validate-form p-b-33 p-t-5"
  >
    <div class="wrap-input100 validate-input" data-validate="Enter username">
      <input
        class="input100"
        v-model="userForm.email"
        type="text"
        placeholder="Email"
        required
      />
      <span class="focus-input100" data-placeholder="&#xe82a;"></span>
    </div>

    <div class="wrap-input100 validate-input" data-validate="Enter password">
      <input
        class="input100"
        v-model="userForm.password"
        type="password"
        placeholder="Password"
        required
      />
      <span class="focus-input100" data-placeholder="&#xe80f;"></span>
    </div>

    <div class="container-login100-form-btn m-t-32">
      <button type="submit" class="login100-form-btn">Next</button>
    </div>

    <div class="container-login100-form-btn m-t-32">
      <router-link :to="{ name: 'register' }">No account?</router-link>
    </div>
  </form>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Swal from "sweetalert2";
import useAuth from "../composables/useAuth";

export default {
  setup() {
    const router = useRouter();

    const { signInUser } = useAuth();

    const userForm = ref({ email: "", password: "" });

    return {
      userForm,
      onSubmit: async () => {
        const { ok, message } = await signInUser(userForm.value);
        if (!ok) Swal.fire("Error!", message, "error");
        else router.push({ name: "no-entry-selected" });
      },
    };
  },
};
</script>
