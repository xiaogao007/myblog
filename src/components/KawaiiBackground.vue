<template>
  <div class="kawaii-background">
    <svg class="kawaii-cloud" viewBox="0 0 100 100" width="80" height="80">
      <path d="M25,60 Q40,45 55,60 T85,60 Q95,60 95,70 T85,80 L25,80 Q15,80 15,70 T25,60" 
            fill="#E3F2FD" />
      <circle cx="35" cy="65" r="2" fill="#90CAF9" class="kawaii-eye" />
      <circle cx="65" cy="65" r="2" fill="#90CAF9" class="kawaii-eye" />
      <path d="M45,72 Q50,75 55,72" stroke="#90CAF9" fill="none" stroke-width="2" 
            class="kawaii-mouth" />
    </svg>

    <svg class="kawaii-star" viewBox="0 0 50 50" width="30" height="30">
      <path d="M25,2 L30,20 L48,20 L33,32 L38,48 L25,38 L12,48 L17,32 L2,20 L20,20 Z" 
            fill="#BBDEFB" />
    </svg>
  </div>
</template>

<style scoped>
.kawaii-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.kawaii-cloud {
  position: absolute;
  animation: floatCloud 20s linear infinite;
}

.kawaii-cloud:nth-child(2) {
  top: 30%;
  left: 70%;
  transform: scale(0.8);
  animation-delay: -5s;
}

.kawaii-star {
  position: absolute;
  animation: twinkle 2s ease-in-out infinite;
}

.kawaii-star:nth-child(2) {
  top: 40%;
  right: 15%;
  animation-delay: -0.5s;
}

.kawaii-eye {
  animation: blink 4s ease-in-out infinite;
}

.kawaii-mouth {
  animation: smile 4s ease-in-out infinite;
}

@keyframes floatCloud {
  from { transform: translateX(-100%); }
  to { transform: translateX(100vw); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes blink {
  0%, 95%, 100% { transform: scaleY(1); }
  97% { transform: scaleY(0); }
}

@keyframes smile {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.1); }
}
</style>