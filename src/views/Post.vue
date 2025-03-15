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
}

.post-meta {
  margin: 20px 0;
}

.date {
  margin-left: 10px;
  color: #666;
}

.content {
  line-height: 1.8;
}

:deep(.content) {
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
}

:deep(.content h1) {
  font-size: 2em;
  margin: 1.2em 0 0.8em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

:deep(.content h2) {
  font-size: 1.65em;
  margin: 1.2em 0 0.8em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

:deep(.content h3) {
  font-size: 1.35em;
  margin: 1em 0 0.8em;
}

:deep(.content h4) {
  font-size: 1.15em;
  margin: 1em 0 0.8em;
}

:deep(.content p) {
  margin: 1em 0;
  line-height: 1.8;
}

:deep(.content ul),
:deep(.content ol) {
  padding-left: 1.2em;
  margin: 1em 0;
}

:deep(.content li) {
  margin: 0.5em 0;
  line-height: 1.7;
}

:deep(.content li > p) {
  margin: 0.5em 0;
}

:deep(.content blockquote) {
  margin: 1em 0;
  padding: 0.5em 1.2em;
  border-left: 4px solid #42b983;
  background-color: #f8f8f8;
  color: #666;
}

:deep(.content blockquote p) {
  margin: 0.5em 0;
}

:deep(.content pre) {
  margin: 1em 0;
  padding: 1em;
  border-radius: 6px;
  background-color: #f6f8fa;
  overflow: auto;
}

:deep(.content code) {
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  background-color: #f6f8fa;
}

:deep(.content pre code) {
  padding: 0;
  background-color: transparent;
}

:deep(.content table) {
  width: 100%;
  margin: 1em 0;
  border-collapse: collapse;
}

:deep(.content th),
:deep(.content td) {
  padding: 0.6em 1em;
  border: 1px solid #dfe2e5;
}

:deep(.content th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

:deep(.content tr:nth-child(2n)) {
  background-color: #fafafa;
}

:deep(.content hr) {
  height: 1px;
  margin: 2em 0;
  border: none;
  background-color: #eaecef;
}

:deep(.content a) {
  color: #3eaf7c;
  text-decoration: none;
  font-weight: 500;
}

:deep(.content a:hover) {
  text-decoration: underline;
}

:deep(.content img) {
  max-width: 100%;
  margin: 1em 0;
  border-radius: 4px;
}

:deep(.content p code),
:deep(.content li code) {
  color: #476582;
  padding: 0.25rem 0.5rem;
  margin: 0 0.2em;
  font-size: 0.85em;
  border-radius: 3px;
  background-color: rgba(27,31,35,0.05);
}

:deep(.content pre::before) {
  content: attr(data-lang);
  position: absolute;
  top: 0.5em;
  right: 1em;
  color: #999;
  font-size: 0.75em;
  text-transform: uppercase;
}

.comment-section {
  margin-top: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-input {
  margin-bottom: 15px;
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