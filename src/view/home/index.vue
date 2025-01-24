<template>
  <div class="app-container">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 修改顶部搜索栏 -->
      <header class="top-header">
        <div class="search-bar">
          <span class="material-icons">search</span>
          <input type="text" placeholder="搜索壁纸..." />
        </div>
        <div class="header-right">
          <span class="nav-item">下载记录</span>
          <span class="nav-item help-btn" @click="showHelp">
            下载说明
          </span>
        </div>
      </header>

      <!-- 添加分类选择器 -->
      <div class="category-tabs">
        <div 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-tab', { active: currentCategory === category.id }]"
          @click="changeCategory(category.id)"
        >
          {{ category.name }}
        </div>
      </div>

      <!-- 简化瀑布流布局 -->
      <div class="card-list">
        <div
          class="card-item"
          v-for="card in cards"
          :key="card.id"
          @click="showImg(card)"
        >
          <div 
            class="img-wrap"
            :style="{
              paddingBottom: `${(card.height / card.width) * 100}%`
            }"
          >
            <img
              :data-src="card.imgUrl"
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              :alt="card.title"
              :class="{ 'loaded': card.loaded }"
              @load="onImageLoad(card)"
            />
            <div class="img-placeholder" v-if="!card.loaded">
              <div class="spinner"></div>
            </div>
          </div>
          <div class="card-desc">
            <p class="title">{{ card.title }}</p>
            <div class="card-meta">
              <span class="user">{{ card.user }}</span>
              <span class="likes">{{ card.likes }}+</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载中提示 -->
      <div v-if="isLoading" class="loading-more">
        <div class="spinner"></div>
        <span>正在加载更多...</span>
      </div>
    </div>

    <!-- 添加预览组件 -->
    <vue-easy-lightbox
      :visible="visible"
      :imgs="imgs"
      :index="index"
      @hide="handleHide"
      :moveDisabled="false"
      :enableZoom="true"
    />

    <!-- 修改帮助弹窗样式 -->
    <el-dialog
      v-model="helpVisible"
      title="下载说明"
      width="360px"
      :show-close="true"
      destroy-on-close
      class="help-dialog"
    >
      <div class="help-content">
        <div class="help-item">
          <div class="help-icon">1</div>
          <p>点击图片可以预览大图</p>
        </div>
        <div class="help-item">
          <div class="help-icon">2</div>
          <p>在预览状态下，右键点击图片选择"图片另存为"即可保存图片</p>
        </div>
        <div class="help-item">
          <div class="help-icon">3</div>
          <p>也可以直接在缩略图上右键选择"图片另存为"进行保存</p>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="helpVisible = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import { ElMessage } from 'element-plus';

interface CardItem {
  id: number;
  title: string;
  user: string;
  likes: number;
  imgUrl: string;
  baseUrl: string;
  loaded: boolean;
  width: number;
  height: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default defineComponent({
  name: 'App',
  components: {
    VueEasyLightbox
  },
  setup() {
    const currentCategory = ref('0');
    const cards = ref<CardItem[]>([]);
    const isLoading = ref(false);
    const batchSize = 6;
    const observer = ref<IntersectionObserver | null>(null);

    // 添加预览相关的状态
    const visible = ref(false);
    const index = ref(0);
    const imgs = ref<string[]>([]);
    const currentCard = ref<CardItem | null>(null);

    // 定义分类列表
    const categories: Category[] = [
      { id: '0', name: '4k专区', count: 3558 },
      { id: '1', name: '美女模特', count: 7401 },
      { id: '2', name: '爱情美图', count: 4620 },
      { id: '3', name: '风景大片', count: 10000 },
      { id: '4', name: '小清新', count: 10000 },
      { id: '5', name: '动漫卡通', count: 10000 },
      { id: '6', name: '明星风尚', count: 10000 },
      { id: '7', name: '萌宠动物', count: 9156 },
      { id: '8', name: '游戏壁纸', count: 10000 },
      { id: '9', name: '汽车天下', count: 10000 },
      { id: '10', name: '炫酷时尚', count: 10000 },
      { id: '11', name: '影视剧照', count: 9264 },
      { id: '12', name: '军事天地', count: 2091 },
      { id: '13', name: '游戏壁纸', count: 4903 },
      { id: '14', name: '文字控', count: 1075 }
    ];

    // 生成随机尺寸（保持合理的宽高比）
    const getRandomSize = () => {
      const width = 300; // 固定宽度
      const minHeight = 200;
      const maxHeight = 600;
      const height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
      return { width, height };
    };

    // 创建观察器
    const createObserver = () => {
      observer.value = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cardEl = entry.target as HTMLElement;
            const img = cardEl.querySelector('img');
            if (img && img.dataset.src) {
              img.src = img.dataset.src;
              observer.value?.unobserve(cardEl);
            }
          }
        });
      }, {
        rootMargin: '200px 0px', // 提前加载
        threshold: 0.1
      });
    };

    // 加载卡片
    const loadCards = async () => {
      if (isLoading.value) return;
      isLoading.value = true;
      
      try {
        const newCards = Array.from({ length: batchSize }, () => {
          const { width, height } = getRandomSize();
          // 基础URL
          const baseUrl = `https://www.yumus.cn/api/?target=img&brand=360&type=${currentCategory.value}`;
          // 为显示添加随机参数
          const timestamp = Date.now();
          const random = Math.random();
          const displayUrl = `${baseUrl}&t=${timestamp}&r=${random}`;
          
          return {
            id: timestamp + random,
            title: randomTitle(),
            user: randomUser(),
            likes: Math.floor(Math.random() * 9999),
            imgUrl: displayUrl,  // 显示用的URL（带随机参数）
            baseUrl: baseUrl,    // 保存基础URL（不带随机参数）
            loaded: false,
            width,
            height
          };
        });

        cards.value.push(...newCards);

        // 在下一个tick中观察新添加的卡片
        setTimeout(() => {
          document.querySelectorAll('.card-item:not([data-observed])').forEach(card => {
            card.setAttribute('data-observed', 'true');
            observer.value?.observe(card);
          });
        }, 0);
      } catch (err) {
        console.error('加载壁纸失败:', err);
      } finally {
        isLoading.value = false;
      }
    };

    // 添加节流函数
    const throttle = (fn: Function, delay: number) => {
      let timer: NodeJS.Timeout | null = null;
      let lastTime = 0;
      
      return (...args: any[]) => {
        const now = Date.now();
        
        if (lastTime && now < lastTime + delay) {
          // 如果距离上次执行不到延迟时间，则设置定时器
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            lastTime = now;
            fn.apply(this, args);
          }, delay);
        } else {
          // 如果距离上次执行超过延迟时间，则直接执行
          lastTime = now;
          fn.apply(this, args);
        }
      };
    };

    // 修改滚动处理函数
    const handleScroll = throttle((e: Event) => {
      const mainContent = e.target as HTMLElement;
      const { scrollTop, clientHeight, scrollHeight } = mainContent;
      
      // 增加触发距离到 200px，并添加正在加载的判断
      if (!isLoading.value && scrollHeight - scrollTop - clientHeight < 200) {
        loadCards();
      }
    }, 500); // 设置 500ms 的节流时间

    onMounted(() => {
      createObserver();
      loadCards();
      const mainContent = document.querySelector('.main-content');
      mainContent?.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      observer.value?.disconnect();
      const mainContent = document.querySelector('.main-content');
      mainContent?.removeEventListener('scroll', handleScroll);
    });

    // 随机数据生成
    const titles = [
      '唯美日落海景壁纸', '二次元少女壁纸', '星空银河壁纸',
      '小清新植物壁纸', '城市夜景壁纸', '可爱动物壁纸',
      '超清游戏壁纸', '简约文艺壁纸', '山水自然风光'
    ];

    const users = [
      '壁纸达人', 'Miko设计', 'Chiara', 'T-onemodel',
      'WallpaperPro', '壁纸收藏家', '每日精选'
    ];

    const randomTitle = () => titles[Math.floor(Math.random() * titles.length)];
    const randomUser = () => users[Math.floor(Math.random() * users.length)];

    // 修改图片加载回调
    const onImageLoad = (card: CardItem) => {
      card.loaded = true;
      const img = document.querySelector(`img[data-src="${card.imgUrl}"]`) as HTMLImageElement;
      if (img) {
        img.src = card.imgUrl;
        img.removeAttribute('data-src');
      }
    };

    // 切换分类
    const changeCategory = (categoryId: string) => {
      currentCategory.value = categoryId;
      cards.value = []; // 清空现有卡片
      loadCards(); // 加载新分类的卡片
    };

    // 显示预览
    const showImg = (card: CardItem) => {
      currentCard.value = card;
      imgs.value = [card.imgUrl];
      visible.value = true;
    };

    // 关闭预览
    const handleHide = () => {
      visible.value = false;
      imgs.value = [];
      currentCard.value = null;
    };

    // 修改下载方法为复制链接
    const downloadImage = async () => {
      if (!currentCard.value) return;
      try {
        await navigator.clipboard.writeText(currentCard.value.imgUrl);
        
        // 修改消息配置
        ElMessage({
          message: '图片链接已复制，请自行下载',
          type: 'success',
          duration: 2000,
          customClass: 'custom-message', // 添加自定义类名
          offset: 60  // 调整消息距离顶部的距离
        });
      } catch (error) {
        ElMessage({
          message: '复制链接失败',
          type: 'error',
          duration: 2000,
          customClass: 'custom-message',
          offset: 60
        });
        console.error('复制失败:', error);
      }
    };

    const helpVisible = ref(false);

    const showHelp = () => {
      helpVisible.value = true;
    };

    return {
      cards,
      isLoading,
      onImageLoad,
      categories,
      currentCategory,
      changeCategory,
      visible,
      imgs,
      index,
      showImg,
      handleHide,
      downloadImage,
      helpVisible,
      showHelp,
    };
  },
});
</script>

<style>
/* 添加全局样式，确保消息显示在最上层 */
.custom-message {
  z-index: 2000 !important; /* vue-easy-lightbox 的 z-index 是 1000 */
}
</style>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  flex-shrink: 0;
  width: 220px;
  padding: 20px 16px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.nav-menu ul {
  list-style: none;
  width: 100%;
  margin-bottom: 20px;
}

.nav-menu li {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin: 4px 0;
  transition: all 0.3s;
}

.nav-menu li:hover {
  background-color: #e9ecef;
}

.category-menu {
  margin-top: 20px;
}

.category-menu h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-left: 6px;
}

.category-menu ul {
  list-style: none;
}

.category-menu li {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.category-menu li:hover {
  background-color: #e9ecef;
  color: #2c3e50;
}

.main-content {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
}

.top-header {
  position: sticky;
  top: 0;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
  border-radius: 20px;
  padding: 6px 12px;
  width: 320px;
}

.search-bar input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #2c3e50;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.help-btn .icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transition: transform 0.3s ease;
}

.help-btn:hover .icon {
  transform: scale(1.1);
}

.card-list {
  padding: 16px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  column-count: 5;
  column-gap: 16px;
}

.card-item {
  break-inside: avoid;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.card-item:hover {
  transform: translateY(-2px);
}

.img-wrap {
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
}

.img-wrap img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-wrap img.loaded {
  opacity: 1;
}

.img-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-top-color: #2c3e50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.card-desc {
  padding: 12px;
}

.card-desc .title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #666;
  font-size: 14px;
}

.loading-more .spinner {
  margin-right: 8px;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .card-list {
    column-count: 4;
  }
}

@media screen and (max-width: 1100px) {
  .card-list {
    column-count: 3;
  }
}

@media screen and (max-width: 768px) {
  .card-list {
    column-count: 2;
    column-gap: 8px;
    padding: 8px;
  }
}

@media screen and (max-width: 480px) {
  .card-list {
    column-count: 1;
  }
}

.material-icons {
  margin-right: 8px;
  font-size: 20px;
  color: #666;
}

.category-tabs {
  display: flex;
  overflow-x: auto;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 56px;
  z-index: 10;
}

.category-tab {
  padding: 6px 16px;
  margin-right: 12px;
  border-radius: 16px;
  background: #f5f5f5;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
}

.category-tab:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.category-tab.active {
  background: #2c3e50;
  color: #fff;
}

/* 优化滚动条 */
.category-tabs::-webkit-scrollbar {
  height: 4px;
}

.category-tabs::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.category-tabs::-webkit-scrollbar-track {
  background: transparent;
}

/* 添加预览相关样式 */
.custom-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  margin: 0 4px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.custom-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.custom-btn .icon {
  width: 24px;
  height: 24px;
  fill: white;
}

/* 添加下载提示样式 */
.download-tip {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f0f9ff;
  border-bottom: 1px solid #e0f2fe;
  color: #0369a1;
  font-size: 14px;
}

.download-tip .icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  fill: currentColor;
}

/* 帮助弹窗样式 */
:deep(.help-dialog) {
  border-radius: 12px;
}

:deep(.help-dialog .el-dialog__header) {
  margin: 0;
  padding: 20px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.help-dialog .el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

:deep(.help-dialog .el-dialog__body) {
  padding: 24px;
}

:deep(.help-dialog .el-dialog__footer) {
  padding: 12px 20px 20px;
  border-top: 1px solid #f0f0f0;
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.help-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.help-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f7ff;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}

.help-item p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #4a5568;
}
</style>