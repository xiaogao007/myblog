<template>
  <div class="post-detail">
    <el-card>
      <div v-if="post">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <el-tag size="small">{{ post.category }}</el-tag>
          <span class="date">{{ post.date }}</span>
        </div>
        <div class="content" v-html="renderedContent"></div>
      </div>
      <div v-else>
        <p>加载中...</p>
      </div>
    </el-card>

    <el-card class="comment-section">
      <template #header>
        <div class="comment-header">
          <h3>评论 ({{ comments.length }})</h3>
        </div>
      </template>

      <div class="comment-form">
        <el-input
          v-model="newComment.name"
          placeholder="您的昵称"
          class="comment-input"
        />
        <el-input
          v-model="newComment.content"
          type="textarea"
          :rows="3"
          placeholder="写下您的评论..."
          class="comment-input"
        />
        <div class="comment-form-footer">
          <el-button type="primary" @click="submitComment" :loading="submitting">
            发表评论
          </el-button>
        </div>
      </div>

      <div class="comment-list">
        <template v-if="comments.length">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <el-avatar :size="40">{{ comment.name.charAt(0) }}</el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-info">
                <span class="comment-author">{{ comment.name }}</span>
                <span class="comment-date">{{ comment.date }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <el-button link type="primary" @click="replyToComment(comment)">
                  回复
                </el-button>
                <el-button 
                  v-if="comment.likes > 0" 
                  link 
                  type="info"
                >
                  {{ comment.likes }} 赞
                </el-button>
              </div>
              <div v-if="comment.replies && comment.replies.length" class="reply-list">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <div class="comment-info">
                    <span class="comment-author">{{ reply.name }}</span>
                    <span class="comment-date">{{ reply.date }}</span>
                  </div>
                  <p class="comment-text">{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <el-empty v-else description="暂无评论" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePostStore } from '../stores/post'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

const post = ref(null)

onMounted(() => {
  const postId = route.params.id
  console.log('当前路由参数中的 postId:', postId)
  console.log('当前文章列表:', postStore.posts)

  post.value = postStore.posts.find(p => p.id == postId)
  if (post.value) {
    renderedContent.value = md.render(post.value.content)
  } else {
    console.error('文章不存在')
  }
})

const renderedContent = ref('')

const comments = ref([
  {
    id: 1,
    name: '张三',
    content: '这篇文章写得很好，对我帮助很大！',
    date: '2024-03-20 14:30',
    likes: 5,
    replies: [
      {
        id: 11,
        name: '李四',
        content: '同感，特别是组合式API的部分讲解得很清楚',
        date: '2024-03-20 15:00'
      }
    ]
  },
  {
    id: 2,
    name: '王五',
    content: '请问作者能详细解释一下 ref 和 reactive 的区别吗？',
    date: '2024-03-20 16:45',
    likes: 2,
    replies: []
  }
])

const newComment = ref({
  name: '',
  content: ''
})

const submitting = ref(false)

// 添加删除文章功能
const handleDelete = () => {
  ElMessageBox.confirm(
    '确定要删除这篇文章吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    postStore.deletePost(post.value.id)
    ElMessage.success('文章已删除')
    router.push('/')
  }).catch(() => {})
}

const submitComment = async () => {
  if (!newComment.value.name.trim() || !newComment.value.content.trim()) {
    ElMessage.warning('请填写昵称和评论内容')
    return
  }

  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const comment = {
      id: Date.now(),
      name: newComment.value.name,
      content: newComment.value.content,
      date: new Date().toLocaleString(),
      likes: 0,
      replies: []
    }

    comments.value.unshift(comment)
    newComment.value.content = ''
    ElMessage.success('评论发表成功')
  } catch (error) {
    ElMessage.error('评论发表失败，请重试')
  } finally {
    submitting.value = false
  }
}

const replyToComment = (comment) => {
  newComment.value.content = `@${comment.name} `
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #F1F8FF;
  background-image: url('@/assets/bg-pattern.png');
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(79, 195, 247, 0.1);
}

.post-meta {
  margin: 20px 0;
  color: #666;
}

.date {
  margin-left: 10px;
}

.content {
  line-height: 1.8;
  color: #2c3e50;
}

.comment-section {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(79, 195, 247, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-input {
  margin-bottom: 15px;
  border-radius: 20px;
  border: 2px solid #4FC3F7;
}

.comment-form-footer {
  display: flex;
  justify-content: flex-end;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.comment-avatar {
  margin-right: 15px;
}

.comment-content {
  flex: 1;
}

.comment-info {
  margin-bottom: 8px;
}

.comment-author {
  font-weight: bold;
  margin-right: 10px;
}

.comment-date {
  color: #999;
  font-size: 0.9em;
}

.comment-text {
  line-height: 1.6;
  margin: 8px 0;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

.reply-list {
  margin-top: 15px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid #eee;
}

.reply-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.reply-item:last-child {
  border-bottom: none;
}
</style> 