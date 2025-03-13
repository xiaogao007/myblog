import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostStore = defineStore('post', () => {
  // 文章列表
  const posts = ref([
    {
      id: 1,
      title: 'Vue3 组合式 API 详解',
      category: 'Vue',
      date: '2024-03-20',
      content: '# Vue3 组合式 API 详解\n\n## 介绍\n\n组合式 API 是 Vue3 中新增的特性...',
      summary: 'Vue3 的组合式 API 是一个革命性的特性，本文将详细介绍其使用方法...'
    }
  ])

  // 分类列表
  const categories = ref(['Vue', 'JavaScript', 'CSS', '前端工程化'])

  // 添加文章
  const addPost = (post) => {
    const id = posts.value.length ? Math.max(...posts.value.map(p => p.id)) + 1 : 1
    const date = new Date().toISOString().split('T')[0]
    const summary = post.content
      .replace(/#/g, '')
      .split('\n')
      .find(line => line.trim()) || ''
    
    posts.value.unshift({
      id,
      date,
      summary: summary.slice(0, 100) + '...',
      ...post
    })

    // 保存到 localStorage
    saveToStorage()
  }

  // 更新文章
  const updatePost = (id, updatedPost) => {
    const index = posts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        ...updatedPost,
        summary: updatedPost.content
          .replace(/#/g, '')
          .split('\n')
          .find(line => line.trim())
          ?.slice(0, 100) + '...'
      }
      saveToStorage()
    }
  }

  // 删除文章
  const deletePost = (id) => {
    posts.value = posts.value.filter(p => p.id !== id)
    saveToStorage()
  }

  // 获取单篇文章
  const getPost = (id) => {
    return posts.value.find(p => p.id === Number(id))
  }

  // 添加分类
  const addCategory = (category) => {
    if (!categories.value.includes(category)) {
      categories.value.push(category)
      saveToStorage()
    }
  }

  // 从 localStorage 加载数据
  const loadFromStorage = () => {
    const storedPosts = localStorage.getItem('posts')
    const storedCategories = localStorage.getItem('categories')
    
    if (storedPosts) {
      posts.value = JSON.parse(storedPosts)
    }
    if (storedCategories) {
      categories.value = JSON.parse(storedCategories)
    }
  }

  // 保存数据到 localStorage
  const saveToStorage = () => {
    localStorage.setItem('posts', JSON.stringify(posts.value))
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    posts,
    categories,
    addPost,
    updatePost,
    deletePost,
    getPost,
    addCategory
  }
}, {
  persist: true // 启用 Pinia 持久化
}) 