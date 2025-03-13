<template>
  <div class="edit-post">
    <el-card class="edit-card">
      <template #header>
        <div class="header">
          <h2>{{ isEdit ? '编辑文章' : '写文章' }}</h2>
        </div>
      </template>

      <el-form :model="postForm" label-position="top">
        <el-form-item label="文章标题">
          <el-input 
            v-model="postForm.title" 
            placeholder="请输入文章标题"
            class="title-input"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-select 
            v-model="postForm.category" 
            placeholder="选择分类"
            class="category-select"
          >
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
          <el-button 
            link 
            type="primary" 
            @click="showAddCategory = true"
          >
            添加新分类
          </el-button>
        </el-form-item>

        <el-form-item label="文章内容 (Markdown)">
          <div class="editor-container">
            <div class="editor-wrapper">
              <div class="editor-toolbar">
                <el-button-group>
                  <el-tooltip content="标题" placement="top">
                    <el-button @click="insertMarkdown('### ')">H</el-button>
                  </el-tooltip>
                  <el-tooltip content="粗体" placement="top">
                    <el-button @click="insertMarkdown('**粗体**')">B</el-button>
                  </el-tooltip>
                  <el-tooltip content="斜体" placement="top">
                    <el-button @click="insertMarkdown('*斜体*')">I</el-button>
                  </el-tooltip>
                </el-button-group>

                <el-button-group>
                  <el-tooltip content="引用" placement="top">
                    <el-button @click="insertMarkdown('\n> ')">Quote</el-button>
                  </el-tooltip>
                  <el-tooltip content="代码块" placement="top">
                    <el-button @click="insertMarkdown('\n```js\n代码\n```\n')">Code</el-button>
                  </el-tooltip>
                  <el-tooltip content="分割线" placement="top">
                    <el-button @click="insertMarkdown('\n---\n')">HR</el-button>
                  </el-tooltip>
                </el-button-group>

                <el-button-group>
                  <el-tooltip content="无序列表" placement="top">
                    <el-button @click="insertMarkdown('\n- ')">UL</el-button>
                  </el-tooltip>
                  <el-tooltip content="有序列表" placement="top">
                    <el-button @click="insertMarkdown('\n1. ')">OL</el-button>
                  </el-tooltip>
                  <el-tooltip content="任务列表" placement="top">
                    <el-button @click="insertMarkdown('\n- [ ] ')">Task</el-button>
                  </el-tooltip>
                </el-button-group>

                <el-button-group>
                  <el-tooltip content="链接" placement="top">
                    <el-button @click="insertMarkdown('[链接文字](url)')">Link</el-button>
                  </el-tooltip>
                  <el-tooltip content="图片" placement="top">
                    <el-button @click="showImageUploader = true">Image</el-button>
                  </el-tooltip>
                  <el-tooltip content="表格" placement="top">
                    <el-button @click="insertMarkdown('\n| 表头 | 表头 |\n| --- | --- |\n| 内容 | 内容 |')">
                      Table
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
              <el-input
                v-model="postForm.content"
                type="textarea"
                :rows="15"
                placeholder="使用 Markdown 编写文章内容..."
                @input="handleContentChange"
                ref="editorRef"
              />
            </div>
            <div class="preview-wrapper">
              <div class="preview-content markdown-body" v-html="renderedContent"></div>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="submitting"
            >
              发布文章
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      v-model="showAddCategory"
      title="添加新分类"
      width="30%"
    >
      <el-input v-model="newCategory" placeholder="请输入分类名称" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddCategory = false">取消</el-button>
          <el-button type="primary" @click="handleAddCategory">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片上传对话框 -->
    <el-dialog
      v-model="showImageUploader"
      title="上传图片"
      width="50%"
    >
      <ImageUploader :onInsert="handleImageInsert" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePostStore } from '../stores/post'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import ImageUploader from '../components/ImageUploader.vue'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch (__) {}
    }
    return ''
  }
})

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 如果是编辑模式，加载文章数据
const postForm = ref({
  title: '',
  category: '',
  content: ''
})

if (isEdit.value) {
  const post = postStore.getPost(route.params.id)
  if (post) {
    postForm.value = { ...post }
  } else {
    ElMessage.error('文章不存在')
    router.push('/')
  }
}

// 使用 store 中的分类数据
const categories = computed(() => postStore.categories)

const submitting = ref(false)
const showAddCategory = ref(false)
const newCategory = ref('')

const renderedContent = ref('')

const editorRef = ref(null)
const showImageUploader = ref(false)

const handleContentChange = () => {
  renderedContent.value = md.render(postForm.value.content)
}

const handleAddCategory = () => {
  if (!newCategory.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  postStore.addCategory(newCategory.value.trim())
  postForm.value.category = newCategory.value.trim()
  showAddCategory.value = false
  newCategory.value = ''
}

const handleSubmit = async () => {
  if (!postForm.value.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  if (!postForm.value.category) {
    ElMessage.warning('请选择文章分类')
    return
  }
  if (!postForm.value.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      postStore.updatePost(Number(route.params.id), postForm.value)
    } else {
      postStore.addPost(postForm.value)
    }
    ElMessage.success(isEdit.value ? '文章更新成功' : '文章发布成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '发布失败')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

// 插入 Markdown 语法
const insertMarkdown = (text) => {
  const textarea = editorRef.value.$el.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = postForm.value.content
  
  postForm.value.content = content.substring(0, start) + text + content.substring(end)
  
  // 更新预览
  handleContentChange()
  
  // 设置光标位置
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + text.length, start + text.length)
  })
}

// 处理图片插入
const handleImageInsert = (base64Url) => {
  const imageMarkdown = `![image](${base64Url})`
  insertMarkdown(imageMarkdown)
  showImageUploader.value = false
}
</script>

<style scoped>
/* 调整整体布局 */
.edit-post {
  max-width: 1600px; /* 增加最大宽度 */
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 140px); /* 减去头部和底部的高度，以及padding */
  display: flex;
  flex-direction: column;
}

.edit-card {
  background: rgba(255, 255, 255, 0.95);
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让表单填满剩余空间 */
.edit-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 30px; /* 增加内边距 */
}

.edit-card :deep(.el-form) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让编辑器区域自动填充剩余空间 */
.edit-card :deep(.el-form-item.is-required) {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.editor-container {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0; /* 防止溢出 */
}

.editor-wrapper,
.preview-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 防止溢出 */
}

/* 调整编辑器工具栏 */
.editor-toolbar {
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  background: #f5f7fa;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.editor-toolbar .el-button {
  padding: 8px 16px;
  font-weight: bold;
}

.editor-toolbar .el-button-group {
  margin-right: 12px;
}

/* 调整输入区域 */
.editor-wrapper :deep(.el-textarea) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-wrapper :deep(.el-textarea__inner) {
  flex: 1;
  font-family: 'Fira Code', monospace;
  font-size: 15px;
  line-height: 1.6;
  padding: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  resize: none; /* 禁用手动调整大小 */
}

/* 调整预览区域 */
.preview-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px 30px;
  overflow-y: auto;
  background: #fff;
}

.preview-content {
  flex: 1;
}

/* 调整标题输入框 */
.title-input :deep(.el-input__inner) {
  font-size: 1.5em;
  padding: 12px 20px;
  height: 50px;
}

/* 调整分类选择器 */
.category-select {
  width: 240px;
  margin-right: 15px;
}

/* 调整底部按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 0 0;
  border-top: 1px solid #eee;
  margin-top: 20px;
}

.form-actions .el-button {
  padding: 12px 24px;
  font-size: 1.1em;
}

/* Markdown 预览样式优化 */
.markdown-body {
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
  padding-bottom: 20px;
}

.markdown-body h1,
.markdown-body h2 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
}

.markdown-body pre {
  background-color: #f6f8fa;
  padding: 20px;
  border-radius: 6px;
  overflow: auto;
  margin: 1em 0;
}

.markdown-body code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  background-color: rgba(27,31,35,0.05);
}

:deep(.markdown-body img) {
  max-width: 100%;
  margin: 1em 0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .edit-post {
    padding: 10px;
  }
  
  .editor-container {
    flex-direction: column;
  }
  
  .editor-wrapper,
  .preview-wrapper {
    width: 100%;
  }
}
</style> 