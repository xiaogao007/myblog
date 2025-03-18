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
          <div style="width: 100%; height: 600px;" id="vditor"></div>
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
// 添加 request 相关导入
import { get, post, put } from '../utils/request'

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePostStore } from '../stores/post'
import Vditor from 'vditor'
import ImageUploader from '../components/ImageUploader.vue'
import 'vditor/dist/index.css'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()

const isEdit = computed(() => !!route.params.id)

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

const categories = computed(() => postStore.categories)

const submitting = ref(false)
const showAddCategory = ref(false)
const newCategory = ref('')

const showImageUploader = ref(false)

let vditorInstance

onMounted(() => {
  vditorInstance = new Vditor('vditor', {
    height: 600,
    toolbarConfig: {
      pin: true,
    },
    cache: {
      id: 'vditor',
    },
    preview: {
      markdown: {
        toc: true,
        mark: true,
      },
    },
    input: () => {
      postForm.value.content = vditorInstance.getValue()
    }
  })
})

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
  alert(postForm.value.content)
  if (!postForm.value.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }

  submitting.value = true
  try {
    const requestData = {
      title: postForm.value.title.trim(),
      content: postForm.value.content.trim(),
      category: postForm.value.category,
      date: new Date().toISOString().split('T')[0]
    }

    if (isEdit.value) {
      await put(`/articles/${route.params.id}`, requestData)
    } else {
      await post('/articles', requestData)
    }
    ElMessage.success(isEdit.value ? '文章更新成功' : '文章发布成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '发布失败')
    console.error('Error:', error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const handleImageInsert = (base64Url) => {
  const imageMarkdown = `![image](${base64Url})`
  vditorInstance.insertValue(imageMarkdown)
  showImageUploader.value = false
}
</script>

<style scoped>
/* 调整整体布局 */
.edit-post {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.edit-card {
  background: rgba(255, 255, 255, 0.95);
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.edit-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  height: 100%;
}

.edit-card :deep(.el-form) {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.edit-card :deep(.el-form-item.is-required) {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  overflow: hidden;
}

.editor-container {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
  overflow: hidden;
}

.editor-wrapper,
.preview-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.title-input :deep(.el-input__inner) {
  font-size: 1.5em;
  padding: 12px 20px;
  height: 50px;
}

.category-select {
  width: 240px;
  margin-right: 15px;
}

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
    max-height: 50vh;
  }
}
</style>