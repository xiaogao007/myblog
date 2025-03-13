<template>
  <div class="about">
    <el-card>
      <h1>关于我的博客</h1>
      <div class="content">
        <p>这是一个使用 Vue3 + Element Plus 构建的技术博客系统。</p>
        <h2>技术栈</h2>
        <ul>
          <li>Vue 3 组合式 API</li>
          <li>Vue Router 路由管理</li>
          <li>Pinia 状态管理</li>
          <li>Element Plus UI 组件库</li>
          <li>Markdown-it 文章渲染</li>
          <li>Highlight.js 代码高亮</li>
        </ul>
        <h2>功能特点</h2>
        <ul>
          <li>文章列表展示</li>
          <li>文章分类管理</li>
          <li>文章搜索功能</li>
          <li>评论互动系统</li>
          <li>Markdown 支持</li>
          <li>代码高亮显示</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1.5em;
  color: #2c3e50;
}

h2 {
  margin: 1.2em 0 0.8em;
  color: #2c3e50;
}

.content {
  line-height: 1.8;
  color: #2c3e50;
}

ul {
  padding-left: 1.2em;
  margin: 1em 0;
}

li {
  margin: 0.5em 0;
}

p {
  margin: 1em 0;
}
</style> 