import { ref } from 'vue'

interface WallpaperCard {
  id: number
  title: string
  user: string
  likes: number
  imgUrl: string
}

export function useWallpapers() {
  const cards = ref<WallpaperCard[]>([])
  const isLoading = ref(false)
  const batchSize = 6

  const titles = [
    '唯美日落海景壁纸', '二次元少女壁纸', '星空银河壁纸',
    '小清新植物壁纸', '城市夜景壁纸', '可爱动物壁纸',
    '超清游戏壁纸', '简约文艺壁纸', '山水自然风光'
  ]

  const users = [
    '壁纸达人', 'Miko设计', 'Chiara', 'T-onemodel',
    'WallpaperPro', '壁纸收藏家', '每日精选'
  ]

  const loadMore = async () => {
    if (isLoading.value) return
    isLoading.value = true
    
    try {
      const newCards = Array.from({ length: batchSize }, (_, i) => ({
        id: Date.now() + i,
        title: titles[Math.floor(Math.random() * titles.length)],
        user: users[Math.floor(Math.random() * users.length)],
        likes: Math.floor(Math.random() * 9999),
        imgUrl: `https://picsum.photos/300/500?random=${Date.now() + i}`
      }))
      
      cards.value.push(...newCards)
    } catch (err) {
      console.error('加载壁纸失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    cards,
    isLoading,
    loadMore
  }
} 