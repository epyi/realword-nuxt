<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                  :disabled="unModify"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  :disabled="unModify"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  required
                  :disabled="unModify"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="targetTag"
                  @keydown.enter.prevent="addTag()"
                  :disabled="unModify"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                  >
                    <i class="ion-close-round" @click="deleteTag(index)" :disabled="unModify"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
                :disabled="unModify"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticle, updateArticle, getArticle } from "@/api/article";
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: ["authenticated"],
  name: "EditorIndex",
  data() {
    return {
      targetTag: null,
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
      slug: null,
      unModify: false,
    };
  },
  async mounted(){
    const { slug } = this.$route.query
    if(slug) {
      this.unModify = true
      const { data } = await getArticle(slug)
      console.log(data)
      const { article } = data
      const { title, description, body, tagList} = article

      this.article = { title, description, body, tagList}
      this.slug = slug
      this.unModify = false
    }
  },
  methods: {
    addTag() {
      const tempTag = this.targetTag;
      this.article.tagList.unshift(tempTag);
      this.targetTag = null;
    },
    deleteTag(index) {
      this.article.tagList.splice(index, 1);
    },
    async onSubmit() {
      let res = null
      this.unModify = true
      if(this.slug){
        res = await updateArticle(this.slug, { article: this.article });
        
      }else{
        res = await addArticle({ article: this.article });
      }
      this.unModify = false
      console.log(res)
      const { article } = res.data
      this.$router.push({ 
        name: "article", 
        params: { slug: article.slug } 
      });
    },
  },
};
</script>

<style>
</style>