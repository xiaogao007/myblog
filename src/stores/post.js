import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const categories = ref([])

  // Add setPosts function
  const setPosts = (newPosts) => {
    posts.value = newPosts.map(post => ({
      ...post,
      summary: post.content?.substring(0, 150) + '...' || ''
    }))
    
    // Update categories from the new posts
    const uniqueCategories = [...new Set(newPosts.map(post => post.category))]
    categories.value = uniqueCategories
  }

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
    setPosts,  // Export the new function
    addPost,
    updatePost,
    deletePost,
    getPost,
    addCategory
  }
}, {
  persist: true
})