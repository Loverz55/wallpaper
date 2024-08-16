<template>

  <div id="viewer" style="width: 100vw; height: 100vh;"></div>
</template>

<script lang="ts" setup>
//先导入photo-sphere-viewer插件和它的样式
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

import { MarkersPlugin } from 'photo-sphere-viewer/dist/plugins/markers'
import 'photo-sphere-viewer/dist/plugins/markers.css'


import { onMounted } from "vue";
import bgViewer from '@/assets/sphere.jpg'
import point from '@/assets/point.png'
// 定义视图容器


const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';

let viewer: Viewer | null;



onMounted(() => {
  //注意这里应该在onMounted初始化，不然可能找不到html元素
viewer = new Viewer({
  container: "viewer",
  panorama: bgViewer,
  navbar: undefined,
  // caption: 'Parc national du Mercantour <b>&copy; Damien Sorel</b>',
  // defaultPitch: 0.6,
  // defaultZoomLvl: 20,
  fisheye: true,
  plugins: [
    [MarkersPlugin, {
      markers: [
        {
          id: 'circle',
          tooltip: 'A circle of radius 30',
          circle: 30,
          // svgStyle: {
          //   fill: 'rgba(255,255,0,0.3)',
          //   stroke: 'yellow',
          //   strokeWidth: '2px',
          // },
          position: { pitch: 0.11, yaw: -0.35 },
          image:point,
          size: { width: 32, height: 32 },

          // longitude: -1,
          // latitude: 0.2,
          anchor: 'center right',
        }
      ],
    }],
  ],
})
})
</script>

<style scoped lang="scss">
.chat-container {
  width: 100%;
  height: 100vh;

  .chat-title {
    width: 100%;
    text-align: center;
    color: #4d9e60
  }

  .chat-content {
    max-width: 1200px;
    width: 100%;
    height: calc(100vh - 75px);
    border-radius: 10px;
    margin: 0px auto;

    .el-card {
      border: 1px solid #4d9e60;
      height: 100%;

      .chat-message {
        height: calc(100% - 80px);
      }

      .chat-footer {
        height: 80px;
      }
    }
  }
}
</style>
