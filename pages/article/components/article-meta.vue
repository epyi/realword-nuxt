<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date(`MMM DD, YYYY`) }}</span>
    </div>
    <template v-if="fromMine">
      <!-- 修改 文章 -->
      <span>
        <nuxt-link
          class="btn btn-outline-secondary btn-sm"
          :to="{
            name: 'editor',
            query: {
              slug: article.slug
            },
          }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>

        <button
          class="btn btn-outline-danger btn-sm"
          :class="{
            disabled: article.isDeleting
          }"
          @click="deleteArticle"
        >
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        :disabled="article.followDisabled"
        @click="onFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        :disabled="article.favoritedDisabled"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";
import { addFavorite, deleteFavorite, deleteArticle } from "@/api/article";
import { mapState } from 'vuex'
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['user']),
    fromMine() {
      return this.user.username === this.article.author.username;
    },
  },
  methods: {
    async onFollow() {
      const article = this.article;
      article.followDisabled = true;
      if (article.author.following) {
        // 取消点赞
        await deleteFollow(article.author.username);
        article.author.following = false;
      } else {
        // 添加点赞
        await addFollow(article.author.username);
        article.author.following = true;
      }
      article.followDisabled = false;
    },
    async onFavorite() {
      const article = this.article;
      article.favoritedDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoritedDisabled = false;
    },

    async deleteArticle(){
      const { data } = await deleteArticle(this.article.slug)
      this.$router.push({
        name: 'home',
        query: {
          tab: 'your_feed'
        }
      })
    },
  },
};
</script>

<style>
</style>