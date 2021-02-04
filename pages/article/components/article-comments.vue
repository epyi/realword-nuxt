<template>
  <div>
    <form class="card comment-form" @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="addCommentBody"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" 
        v-for="(comment, commentIndex) in comments"
        :key="commentIndex"
    >
      <div class="card-block">
        <p class="card-text">
          {{comment.body}}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author"
            :to="{
                name: 'profile',
                params: {
                    username: comment.author.username
                }
            }" 
        >
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author"
            :to="{
                name: 'profile',
                params: {
                    username: comment.author.username
                }
            }"  
        >
            {{comment.author.username}}
        </nuxt-link>
        <span class="date-posted">{{comment.createdAt | date(`MMM DD, YYYY`)}}</span>
        <span class="mod-options" v-if="comment.deleteAllow">
          <i class="ion-trash-a" @click="onDeleteComment(comment, commentIndex)"></i>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from "@/api/article";
import { mapState } from 'vuex'
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      comments: [], // 评论列表
      addCommentBody: '', // 新增评论内容
    };
  },
  async mounted() {
    const { data } = await getComments(this.article.slug);
    const { comments } = data
    comments.forEach(element => {
      if (element.author.username === this.user.username) {
        element.deleteAllow = true
      } else {
        element.deleteAllow = false
      }
    });
    this.comments = comments;
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onSubmit () {
      console.log(this.addCommentBody)
      const { data } = await addComment(
        this.article.slug, 
        {comment: { body: this.addCommentBody}}
      )
      this.comments.unshift(data.comment)
    },
    async onDeleteComment (comment, commentIndex) {
      const { data } = await deleteComment(
        this.article.slug,
        comment.id
      ) 
      console.log(data)
      this.comments.splice(commentIndex, 1)
    }
  }
};
</script>

<style>
</style>