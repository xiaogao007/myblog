// 创建一个可以复用的 logo 组件
export const logoSvg = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <!-- 猫耳朵形状的代码图标 -->
  <g fill="none" stroke="#4FC3F7" stroke-width="2">
    <!-- 左耳 -->
    <path d="M8,15 Q12,5 16,15" fill="#B3E5FC"/>
    <!-- 右耳 -->
    <path d="M24,15 Q28,5 32,15" fill="#B3E5FC"/>
    <!-- 脸部轮廓 -->
    <circle cx="20" cy="22" r="12" fill="#fff"/>
    <!-- 代码符号 -->
    <path d="M14,20 L17,23 L14,26" stroke="#4FC3F7" stroke-linecap="round"/>
    <path d="M26,20 L23,23 L26,26" stroke="#4FC3F7" stroke-linecap="round"/>
    <!-- 可爱的表情 -->
    <path d="M20,24 Q20,26 22,26" stroke="#4FC3F7" stroke-linecap="round"/>
    <!-- 腮红 -->
    <circle cx="15" cy="23" r="1.5" fill="#B3E5FC" opacity="0.6"/>
    <circle cx="25" cy="23" r="1.5" fill="#B3E5FC" opacity="0.6"/>
  </g>
</svg>
` 