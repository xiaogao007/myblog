<template>
  <div class="admin">
    <el-card class="admin-card">
      <template #header>
        <div class="admin-header">
          <h2>文章管理</h2>
          <el-button 
            type="primary" 
            @click="$router.push('/edit')"
          >
            写文章
          </el-button>
        </div>
      </template>

      <el-table :data="posts" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="date" label="发布日期" width="120">
          <template #default="{ row }">
            {{ new Date(row.date).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                link
                @click="$router.push(`/edit/${row.id}`)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                link
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePostStore } from '../stores/post'
import { del } from '../utils/request'

const postStore = usePostStore()
const posts = computed(() => postStore.posts)

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await del(`/articles/${id}`)
    ElMessage.success('删除成功')
    // 重新获取文章列表
    await postStore.fetchPosts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('Error deleting post:', error)
    }
  }
}
</script>

<style scoped>
.admin {
  padding: 20px;
}

.admin-card {
  background: rgba(255, 255, 255, 0.95);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h2 {
  margin: 0;
  color: #3A9AD9;
}
</style>