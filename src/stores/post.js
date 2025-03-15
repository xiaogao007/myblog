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
    },
    {
      id: 2,
      title: 'Nginx转发解决前后端分离项目跨域请求',
      summary: '使用nginx反向代理解决跨域问题，适用于前端Vue和后端Spring Boot项目。',
      category: '技术',
      date: '2023-10-15',
      content: `
        前端使用vue，后端使用spring boot，前端学习到了发送请求，就测试了一下发送天天基金的接口（接口地址为: http://fundgz.1234567.com.cn/js/001186.js?rt=1463558676006），发现报了个跨域请求的错。

        使用nginx反向代理解决跨域，通过nginx来进行转发，nginx的作用相当于是个传话筒，用来做分发转发的作用。

        1. nginx官网：nginx
        下载地址：nginx: download
        nginx常用命令：
        开启：start nginx
        关闭：nginx.exe -s quit
        重启：nginx.exe -s reload  （修改配置文件后需要重启才生效）

        2. 配置文件：
        2.1 配置监听端口
        我这里监听的是9000

        2.2 配置转发地址：
        这个proxy_pass一定要加，默认没有，不加的话访问不了
        我的自己的配置如下：可参考
        server {
            listen       9000;
            server_name  localhost;
            location / {
                root   html;
                index  index.html index.htm;
            }
            location /potato-cli-market/ {
                proxy_pass   http://localhost:8080/potato-cli-market/;
            }
            location /potato-web-market/ {
                proxy_pass   http://localhost:8081/potato-web-market/;
            }
            location /fund/ {
                proxy_pass    http://fundgz.1234567.com.cn/;
            }
        }
        监听的地址为localhost和端口为9000;
        请求地址如下：
        localhost:9000/potato-cli-market/mallTypeManage会直接转发到localhost:8080/potato-cli-market/mallTypeManage
        同样如果请求
        localhost:9000/potato-web-market/hello会直接转发到localhost:8081/potato-web-market/hello上
        同样如果请求的接口
        localhost:9000/fund/js/001186.js?rt=1463558676006会直接转发到 http://fundgz.1234567.com.cn/js/001186.js?rt=1463558676006

        3. 测试
        我本地vue启动访问是：
        启动nginx后，我访问http://localhost:9000/potato-cli-market/mallTypeManage
        就可以访问了：localhost:8080/potato-cli-market/mallTypeManage
      `
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