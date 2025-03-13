<template>
  <div class="home">
    <el-row class="search-row" :gutter="20">
      <el-col :span="18" :offset="0">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文章..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
      </el-col>
      <el-col :span="6">
        <el-button 
          type="primary" 
          class="new-post-btn"
          @click="$router.push('/edit')"
        >
          写文章
        </el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <div v-if="filteredPosts.length > 0">
          <div v-for="post in filteredPosts" :key="post.id" class="post-item">
            <el-card class="kawaii-card">
              <h2>
                <router-link :to="'/post/' + post.id" class="post-title">
                  {{ post.title }}
                </router-link>
              </h2>
              <p class="post-meta">
                <el-tag size="small" class="kawaii-tag">{{ post.category }}</el-tag>
                <span class="date">{{ post.date }}</span>
              </p>
              <p class="post-summary">{{ post.summary }}</p>
            </el-card>
          </div>
        </div>
        <el-empty v-else description="找不到相关内容呢 (´;ω;｀)" />
      </el-col>
      
      <el-col :span="6">
        <el-card class="category-card kawaii-card">
          <template #header>
            <div class="card-header">
              <span>分类标签 (●'◡'●)</span>
            </div>
          </template>
          <div class="categories">
            <el-tag
              v-for="category in categories"
              :key="category"
              class="category-tag kawaii-tag"
            >
              {{ category }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { usePostStore } from '../stores/post'

const searchQuery = ref('')
const postStore = usePostStore()

// 使用 store 中的数据
const posts = computed(() => postStore.posts)
const categories = computed(() => postStore.categories)

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.summary.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query)
  )
})

const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const handleSearch = debounce(() => {
  console.log('Searching for:', searchQuery.value)
}, 300)
</script>

<style scoped>
.home {
  animation: fadeIn 0.5s ease-out;
  overflow-x: hidden;
  box-sizing: border-box;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.kawaii-input :deep(.el-input__inner) {
  border-radius: 20px;
  border: 2px solid #4FC3F7;
  transition: all 0.3s ease;
}

.kawaii-input :deep(.el-input__inner:focus) {
  border-color: #0288D1;
  box-shadow: 0 0 10px rgba(79, 195, 247, 0.2);
}

.kawaii-card {
  border-radius: 15px;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.15);
}

.kawaii-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(79, 195, 247, 0.2);
}

.post-title {
  color: #4FC3F7;
  text-decoration: none;
  font-size: 1.4em;
  font-weight: bold;
  transition: color 0.3s ease;
}

.post-title:hover {
  color: #0288D1;
}

.kawaii-tag {
  background: #F1F8FF;
  border-color: #4FC3F7;
  color: #4FC3F7;
  border-radius: 12px;
  padding: 0 12px;
  transition: all 0.3s ease;
}

.kawaii-tag:hover {
  background: #4FC3F7;
  color: white;
}

.post-meta {
  margin: 12px 0;
  color: #4FC3F7;
}

.date {
  margin-left: 10px;
  color: #81D4FA;
}

.post-summary {
  color: #666;
  line-height: 1.8;
}

.category-card {
  background: rgba(255, 255, 255, 0.9);
}

.card-header {
  color: #4FC3F7;
  font-size: 1.2em;
  font-weight: bold;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-row {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #4FC3F7;
}

.search-input :deep(.el-input__inner) {
  font-size: 14px;
  height: 40px;
}

.new-post-btn {
  width: 100%;
  background-color: #4FC3F7;
  border-color: #4FC3F7;
}

.new-post-btn:hover {
  background-color: #0288D1;
  border-color: #0288D1;
}

img, video {
  max-width: 100%;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</style> 