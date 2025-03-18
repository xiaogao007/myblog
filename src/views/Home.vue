<template>
  <div class="home">
    <el-row class="search-row" :gutter="20">
      <el-col :span="24">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文章..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-skeleton :loading="loading" :rows="3" animated v-if="loading">
          <!-- 骨架屏保持不变 -->
        </el-skeleton>

        <div v-else-if="filteredPosts.length > 0">
          <div v-for="post in filteredPosts" :key="post.id" class="post-item">
            <el-card class="kawaii-card">
              <template #header>
                <div class="card-header-content">
                  <h2 class="post-title-wrapper">
                    <router-link :to="'/post/' + post.id" class="post-title">
                      {{ post.title }}
                    </router-link>
                  </h2>
                </div>
              </template>
              <p class="post-meta">
                <el-tag size="small" class="kawaii-tag">{{ post.category }}</el-tag>
                <span class="date">{{ new Date(post.date).toLocaleDateString() }}</span>
              </p>
              <p class="post-summary">{{ post.summary }}</p>
            </el-card>
          </div>
        </div>
        <el-empty v-else description="找不到相关内容呢 (´;ω;｀)" />
      </el-col>
      
      <el-col :span="6">
        <div class="category-nav">
          <h3 class="category-title">分类导航</h3>
          <el-menu class="category-menu" :default-active="activeCategory" @select="handleCategorySelect">
            <el-menu-item v-for="category in categories" :key="category" :index="category">
              {{ category }}
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { usePostStore } from '../stores/post'
import { get } from '../utils/request'

const searchQuery = ref('')
const postStore = usePostStore()
const loading = ref(false)
const activeCategory = ref('')

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

const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await get('/articles')
    postStore.setPosts(response.map(post => ({
      ...post,
      summary: post.content.substring(0, 150) + '...'
    })))
  } catch (error) {
    ElMessage.error('获取文章列表失败')
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})

const posts = computed(() => postStore.posts)
const categories = computed(() => postStore.categories)

const filteredPosts = computed(() => {
  let filtered = posts.value
  if (activeCategory.value) {
    filtered = filtered.filter(post => post.category === activeCategory.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    )
  }
  return filtered
})

const handleCategorySelect = (category) => {
  activeCategory.value = activeCategory.value === category ? '' : category
}
</script>

<style scoped>
.home {
  padding: 20px;
  background: #F1F8FF;
  background-image: url('@/assets/bg-pattern.png');
}

.search-row {
  margin-bottom: 20px;
}

.search-input {
  border-radius: 20px;
  border: none;
  box-shadow: 0 2px 12px rgba(79, 195, 247, 0.1);
  transition: box-shadow 0.3s;
}

.search-input:focus {
  box-shadow: 0 4px 16px rgba(79, 195, 247, 0.2);
}

.kawaii-card {
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(79, 195, 247, 0.1);
  transition: transform 0.3s;
}

.kawaii-card:hover {
  transform: translateY(-5px);
}

.card-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-title-wrapper {
  margin: 0;
}

.post-title {
  font-size: 1.5em;
  color: #4FC3F7;
  font-family: 'Comic Sans MS', cursive;
  text-decoration: none;
}

.post-title:hover {
  text-decoration: underline;
}

.post-meta {
  margin: 10px 0;
  color: #666;
}

.kawaii-tag {
  background: linear-gradient(45deg, #4FC3F7, #81D4FA);
  color: white;
}

.date {
  margin-left: 10px;
}

.post-summary {
  color: #333;
  line-height: 1.6;
}

.category-nav {
  padding: 20px;
  background: #F1F8FF;
  background-image: url('@/assets/bg-pattern.png');
}

.category-title {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #4FC3F7;
  font-family: 'Comic Sans MS', cursive;
}

.category-menu {
  background: #F1F8FF;
  border: none;
}
</style>