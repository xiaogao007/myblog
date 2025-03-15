<template>
  <el-container class="app-container">
    <el-header class="kawaii-header">
      <nav>
        <el-menu mode="horizontal" router class="kawaii-menu">
          <div class="logo">
            <KawaiiLogo />
            <span class="logo-text">Gao's Blog</span>
          </div>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
      </nav>
    </el-header>
    
    <el-main class="kawaii-main">
      <router-view></router-view>
    </el-main>
    
    <el-footer class="kawaii-footer">
      <p>© 2024 技术宅 | 用技术改变世界 ٩(◕‿◕｡)۶</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import KawaiiLogo from './components/KawaiiLogo.vue'
</script>

<style scoped>
/* 重置全局样式 */
:root {
  height: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止全局滚动条 */
}

/* 设置基础布局 */
.app-container {
  min-height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
  background: #F1F8FF;
  background-image: url('@/assets/bg-pattern.png');
  overflow: hidden; /* 防止容器滚动条 */
}

.kawaii-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px rgba(79, 195, 247, 0.1);
  border-bottom: 2px solid #4FC3F7;
  padding: 0;
}

.kawaii-main {
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
  height:100%; /* 减去头部和底部的高度 */
  box-sizing: border-box; /* 确保填充和边框不会影响总高度 */
}

.kawaii-footer {
  position: sticky;
  bottom: 0;
  text-align: center;
  color: #4FC3F7;
  padding: 20px 0;
  font-family: 'Comic Sans MS', cursive;
  background: rgba(255, 255, 255, 0.95);
  border-top: 2px solid #4FC3F7;
}

/* 其他样式保持不变 */
.kawaii-menu {
  border: none !important;
  background: transparent;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 1.5em;
  color: #4FC3F7;
  font-family: 'Comic Sans MS', cursive;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  background: linear-gradient(45deg, #4FC3F7, #81D4FA);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
}

:deep(.el-menu-item) {
  font-size: 1.1em;
  color: #4FC3F7 !important;
}

:deep(.el-menu-item.is-active) {
  color: #0288D1 !important;
  border-bottom: 2px solid #0288D1 !important;
}
</style> 