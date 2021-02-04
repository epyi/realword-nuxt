<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <template v-if="profile.username === currentUser.username">
              <nuxt-link
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{
                  name: 'settings',
                }"
              >
                <i class="ion-gear-a"></i> Edit Profile Settings
              </nuxt-link>
            </template>
            <!-- TODO: 关注其他人，取消关注 -->
            <template v-else>
              <button
                class="btn btn-sm action-btn"
                :class="{
                  'btn-outline-secondary': !profile.following,
                  'btn-secondary': profile.following
                }"
                @click="onfollow()"
                :disabled="followDisabled"
              >
                <i class="ion-plus-round"></i>
                &nbsp; {{ !profile.following ? 'Follow' : 'unFollow'}} {{ profile.username }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                
                <nuxt-link class="nav-link" 
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_articles'
                    }
                  }"
                  :class="{
                    active: tab === 'my_articles'
                  }"
                  exact
                >
                  My Articles
                </nuxt-link>
              </li>
              
              <li class="nav-item">
                <nuxt-link class="nav-link" 
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited_articles'
                    }
                  }"
                  :class="{
                    active: tab === 'favorited_articles'
                  }"
                  exact
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul> 
          </div>

          <template v-if="!loaded">
            <div>Loading articles ...</div>
          </template>
          <template v-else-if="articles && articles.length > 0">
            <div class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
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
                    />
                  </nuxt-link>
                  <span class="date"> {{ article.createdAt | date('MMM DD, YYYY') }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: article.favorited,
                  }"
                  @click="onFavorite(article)"
                  :disabled="article.favoritedDisabled"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug,
                  },
                }"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>

            <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{
                  active: item === page,
                }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    query: {
                      page: item,
                      tab: tab
                    },
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页 -->
          </template>
          <template v-else>
            <div>No articles are here... yet.</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, deleteFavorite, addFavorite } from "@/api/article";
import { mapState } from "vuex";
import { getProfile } from "@/api/profile";
import { addFollow, deleteFollow} from "@/api/user"

export default {
  middleware: ["authenticated"],
  name: "ProfileIndex",
  data() {
    return {
      tab: "my_articles",
      loaded: false, // 正在加载文章
      followDisabled: false, // 不允许在请求过程中点击
    };
  },
  async asyncData({ params, query }) {
    console.log(query)
    const page = Number.parseInt(query.page) || 1;
    const username = params.username;
    const limit = 20;
    const tab = query.tab || "my_articles";

    const setParams = tab === "my_articles"
        ? {
            limit: limit,
            offset: (page - 1) * limit,
            author: username,
          }
        : {
            limit: limit,
            offset: (page - 1) * limit,
            favorited: username,
          };
    const [articlesRes, profileRes] = await Promise.all([
      getArticles(setParams),
      getProfile(username),
    ]);

    const { profile } = profileRes.data;
    const { articles, articlesCount } = articlesRes.data;

    if (articles) {
      articles.forEach((article) => (article.favoritedDisabled = false));
    }

    return {
      articles,
      articlesCount,
      page,
      limit,
      tab,
      profile,
      loaded: true, // 加载完成
    };
  },
  watchQuery: ["page", "tab"],
  computed: {
    ...mapState({ currentUser: "user" }),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
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
    async onfollow(){
      const profile = this.profile;
      this.followDisabled = true;
      if (profile.following) {
        // 取消点赞
        await deleteFollow(profile.username);
        profile.following = false;
      } else {
        // 添加点赞
        await addFollow(profile.username);
        profile.following = true;
      }
      this.followDisabled = false;
    },
  },
};
</script>

<style>
</style>