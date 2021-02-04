<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onUpdate">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="modifyUser.image"
                  :disabled="unModify"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="modifyUser.username"
                  required
                  :disabled="unModify"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="modifyUser.bio"
                  :disabled="unModify"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  v-model="modifyUser.email"
                  required
                  :disabled="unModify"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="modifyUser.password"
                  minlength="8"
                  :disabled="unModify"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" :disabled="unModify">
                Update Settings
              </button>
            </fieldset>
          </form>

          <hr />

          <button class="btn btn-outline-danger" @click="loginOut()" :disabled="unModify">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 仅在客户端加载 js-cookie 包， process.client 由 Nuxt 提供
const Cookie = process.client ? require("js-cookie") : undefined;

import { mapState } from "vuex";
import { updateUserSet } from "@/api/user";
export default {
  middleware: ["authenticated"],
  name: "SettingIndex",
  data() {
    return {
      modifyUser: {}, // 可以编辑操作的 User 信息
      unModify: false, // 不可以编辑的状态
    };
  },
  computed: {
    ...mapState({ userSource: "user" }),
  },
  mounted() {
    // 挂在时，将 state 里的 user 信息传递给 modifyUser
    const { email, username, image, bio } = this.userSource;
    this.modifyUser = { email, username, password: null, image, bio };
  },
  methods: {
    async onUpdate() {
      this.unModify = true
      const { data } = await updateUserSet({user: this.modifyUser});
      console.log(data);

      // TODO: 保存用户的登录状态
      this.$store.commit("setUser", data.user);
      // 为了防止刷新页面数据丢失，需要数据持久化
      Cookie.set("user", data.user);
      this.unModify = false
      // this.$router.push(`/profile/${data.user.username}`);
      this.$router.push({name:'profile',params:{username:data.user.username}});
    },

    loginOut() {
      // TODO: 保存用户的登录状态
      this.$store.commit("setUser", null);
      // 为了防止刷新页面数据丢失，需要数据持久化
      Cookie.set("user", null);
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>