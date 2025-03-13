<template>
  <div 
    class="image-uploader"
    @drop.prevent="handleDrop"
    @dragover.prevent
  >
    <el-upload
      class="upload-area"
      action="#"
      :http-request="handleUpload"
      :show-file-list="false"
      accept="image/*"
      :before-upload="beforeUpload"
    >
      <div class="upload-trigger">
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text">点击或拖拽图片上传</div>
      </div>
    </el-upload>

    <div v-if="previewUrl" class="preview-area">
      <img :src="previewUrl" class="preview-image" />
      <div class="image-info">
        <span>大小: {{ (imageFile?.size / 1024).toFixed(1) }}KB</span>
        <span>尺寸: {{ imageWidth }}x{{ imageHeight }}</span>
      </div>
      <div class="preview-actions">
        <el-button type="primary" size="small" @click="insertImage">
          插入图片
        </el-button>
        <el-button size="small" @click="cancelUpload">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps({
  onInsert: {
    type: Function,
    required: true
  }
})

const previewUrl = ref('')
const imageFile = ref(null)
const imageWidth = ref(0)
const imageHeight = ref(0)

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

// 图片压缩函数
const compressImage = (file, maxWidth = 1200) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        let width = img.width
        let height = img.height
        
        // 如果图片宽度超过最大宽度，等比例缩放
        if (width > maxWidth) {
          height = (maxWidth * height) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        // 转换为 blob
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }))
        }, 'image/jpeg', 0.8) // 使用 JPEG 格式，质量 0.8
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const handleUpload = async (options) => {
  const file = options.file
  const fileSize = file.size / 1024 / 1024 // 转换为 MB
  
  if (fileSize > 1) { // 如果大于 1MB，询问是否压缩
    try {
      await ElMessageBox.confirm(
        '图片较大，是否要压缩后再上传？',
        '提示',
        {
          confirmButtonText: '压缩',
          cancelButtonText: '保持原图',
          type: 'info'
        }
      )
      // 用户选择压缩
      const compressedFile = await compressImage(file)
      imageFile.value = compressedFile
    } catch {
      // 用户选择保持原图
      imageFile.value = file
    }
  } else {
    imageFile.value = file
  }
  
  previewUrl.value = URL.createObjectURL(imageFile.value)
}

// 添加拖放功能
const handleDrop = (e) => {
  e.preventDefault()
  const files = e.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (beforeUpload(file)) {
      handleUpload({ file })
    }
  }
}

const insertImage = () => {
  if (!imageFile.value) return

  // 将图片转换为 Base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result
    props.onInsert(base64)
    cancelUpload()
  }
  reader.readAsDataURL(imageFile.value)
}

const cancelUpload = () => {
  previewUrl.value = ''
  imageFile.value = null
}
</script>

<style scoped>
.image-uploader {
  margin: 10px 0;
}

.upload-area {
  border: 2px dashed #4FC3F7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.upload-area::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(79, 195, 247, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-area:hover::after {
  opacity: 1;
}

[dragging] .upload-area {
  border-color: #0288D1;
  background: rgba(79, 195, 247, 0.05);
}

.upload-trigger {
  padding: 20px;
  text-align: center;
  color: #4FC3F7;
}

.upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

.preview-area {
  margin-top: 10px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.preview-actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.image-info {
  margin: 8px 0;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style> 