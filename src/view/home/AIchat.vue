<template>
  <div class="main-container">
    <div class="header-father">
      <div class="chat-header">
        <img class="chat-logo" src="../../assets/hjlogo.png" />
        <h2>华教AIChat</h2>
      </div>
    </div>
    <div class="chat-container" id="chat-container">
      <div v-for="(message, index) in messages" :key="index"
        :class="message.align === 'left' ? 'message-left' : 'message-right'">
        <div class="name">
         
          <span>{{ message.name }} {{ message.time }} 
          </span>
          <!-- <div v-show="message.align === 'left'" style="height: 20px;cursor: pointer;">
            <el-tooltip v-if="isStart" class="box-item" effect="dark" content="语音播放" placement="top-start">
            <svg @click="startBf(message.text)" t="1719822509394" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4272" width="20" height="20"><path d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667zM456.704 305.92C432.704 289.152 405.333333 303.082667 405.333333 331.797333v360.533334c0 28.586667 27.541333 42.538667 51.370667 25.856l252.352-176.768c21.76-15.253333 21.632-43.541333 0-58.709334l-252.373333-176.768z m-8.597333 366.72V351.466667l229.269333 160.597333-229.269333 160.597333z" fill="#358eff" p-id="4273"></path></svg>
            </el-tooltip>
            <el-tooltip v-else class="box-item" effect="dark" content="AI回答或播放中禁止点击！" placement="top-start">
            <svg t="1719823770095" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6795" width="20" height="20"><path d="M0 0h1024v1024H0z" fill="#FFFFFF" p-id="6796"></path><path d="M512 512m-450.56 0a450.56 450.56 0 1 0 901.12 0 450.56 450.56 0 1 0-901.12 0Z" fill="#D80405" p-id="6797"></path><path d="M245.76 481.28m30.72 0l471.04 0q30.72 0 30.72 30.72l0 0q0 30.72-30.72 30.72l-471.04 0q-30.72 0-30.72-30.72l0 0q0-30.72 30.72-30.72Z" fill="#FFFFFF" p-id="6798"></path></svg>
            </el-tooltip>
          </div> -->

        </div>
        <!-- <div class="chat_message"> -->
          <!-- {{ message.text }} -->
          <!-- <span v-html="marked.parse(message.text)"></span> -->
          <MdPreview class="chat_message" :editorId="markedid" previewTheme="default" :modelValue="message.text" />
        <!-- </div> -->
      </div>
      <div class="chat_genr" v-show="aichat">
        华教AI生成中...
        <div class="loading">
          <svg width="64px" height="48px">
            <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
            <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
          </svg>

        </div>

      </div>
      <div v-show="aichat" class="chat-stop" style="text-align: center;" >
      <el-button @click="stopchat">停止回答</el-button>
    </div>
    </div>

    <div class="chat-footer">
      <el-upload action="#" capture="camera" v-model:file-list="fileList" class="avatar-uploader"
        accept=".jpg,.png" :show-file-list="false" :before-upload="beforeAvatarUpload"
        :http-request="handleAvatarSuccess">
        <!-- <el-button>上传</el-button> -->
        <svg t="1719989031217" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4333" width="40" height="40"><path d="M888 343.9h-34c-4.7 0-8.5-3.8-8.5-8.5v-35.6c0-31.8-25.8-57.6-57.6-57.6H739.7c-0.5-0.1-1.2-0.2-2-0.2H564.9c-15.4 0-27.9-12.5-27.9-27.9V207c0-1.8-0.3-3.7-0.8-5.8 1.5-8.4-1.5-14.8-7.8-29.1-13.3-29.9-42.9-49.2-75.6-49.2H136c-39.9 0-72.3 32.4-72.3 72.3v631c0 39.9 32.4 72.3 72.3 72.3h752c39.9 0 72.3-21.1 72.3-72.3v-410c0.1-54.6-32.3-72.3-72.3-72.3zM277 656V416.2c0-12.6 10.3-22.9 22.9-22.9h519c0.5 0.1 1.2 0.2 2 0.2s1.4-0.1 2-0.2h65.3c12.6 0 22.9 10.3 22.9 22.9v410.1c0 12.6-10.3 22.9-22.9 22.9H293.9c-9.9 0-17.9-8.5-17-18.4 0.2-2.1 0.3-4.2 0.3-6.3V657.9c0-0.7-0.1-1.4-0.2-1.9z m-49.3 29.4V834c0 8.4-6.8 15.2-15.2 15.2h-84.3c-8.3 0-15.1-6.8-15.1-15.1V195.3c0-12.6 10.3-22.9 22.9-22.9h319.9c15.1 0 29.6 12.2 31.5 27.2 0 0.4 0.1 0.8 0.2 1.2 0.2 1.4 0.3 2.8 0.2 4.1-0.1 0.7-0.1 1.4-0.1 2V219c0 39.9 32.4 72.3 72.3 72.3h120.2c0.5 0.1 1.2 0.2 2 0.2h91.1c12.6 0 22.9 10.3 22.9 22.9v18.8c0 5.9-4.8 10.7-10.7 10.7H299.9c-39.9 0-72.3 32.4-72.3 72.3v267.2c0 0.8 0.1 1.5 0.1 2z" fill="#5a6270" p-id="4334"></path><path d="M501.4 623.2c4.8 4.6 11 7.1 17.4 7.1 6.8 0 12.9-2.6 17.4-7.2l34.6-34.6c3-3 8.1-0.9 8.1 3.4V730c0 14.6 11.9 26.4 26.5 25.3 12.8-0.9 22.9-11.6 22.9-24.6V594.5c0-5.1 6.1-7.6 9.7-4l32.6 32.6 0.1 0.1c4.8 4.6 11 7.1 17.4 7.1 6.8 0 12.8-2.5 17.5-7.2 9.6-9.6 9.6-25.2 0-34.9l-83.3-83.1c-21.9-21.9-17.2-20.7-36.3-1.6l-84.8 84.8c-4.7 4.7-7.2 10.9-7.2 17.4 0.1 6.5 2.7 12.7 7.4 17.5z" fill="#5a6270" p-id="4335"></path></svg>
      </el-upload>
      <el-input ref="inputRef" class="textareinput" v-model="sendmsg" placeholder="请输入消息" type="textarea"
        @keyup.enter.native="sendmsgClick"></el-input>
      <div class="sendbar">
        <!-- 波形绘制区域 -->
        <div class="record-bot" v-show="!startRecord">
          <div style="display: inline-block; vertical-align: bottom">
            <div style="height: 50px; width: 100px" ref="recwave"></div>
          </div>
        </div>

        <el-tooltip class="box-item" effect="dark" :content="recordVoice" placement="top-start">
          <div class="record-btn" style="margin-right: 30px;">
          <svg v-if="startRecord" @click="recOpen" t="1719818114035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="5657" width="35" height="35">
            <path
              d="M827.246871 451.075419c-12.94994-0.588401-23.925922 9.432837-24.51637 22.382776-0.093121 2.062985-0.418532 6.353708-1.106194 12.542664-1.170662 10.54824-2.959402 22.35924-5.490038 35.106566-7.226588 36.413328-18.898419 72.794933-35.917024 106.534362-47.672766 94.508467-126.925784 150.334937-248.217245 150.71663-121.290437-0.381693-200.546525-56.208163-248.217245-150.71663-17.018605-33.739429-28.692482-70.120011-35.919071-106.534362-2.529613-12.747325-4.317329-24.558325-5.487991-35.106566-0.687662-6.188956-1.014096-10.479679-1.108241-12.542664-0.588401-12.94994-11.564383-22.971178-24.514323-22.382776-12.951987 0.588401-22.973224 11.564383-22.382776 24.51637 0.5137 11.339256 2.63092 30.394241 7.446599 54.654784 8.000208 40.316218 20.946055 80.665181 40.051181 118.537743 51.840692 102.776781 138.972145 167.127392 265.456884 175.017082l0 85.599563L291.185872 909.400962c-12.96529 0-23.473621 10.510378-23.473621 23.473621 0 12.96529 10.508331 23.473621 23.473621 23.473621l441.857477 0c12.963243 0 23.473621-10.508331 23.473621-23.473621 0-12.963243-10.510378-23.473621-23.473621-23.473621L534.272259 909.400962l0-85.454254c127.791501-7.209192 215.690434-71.734788 267.86063-175.162392 19.104103-37.872562 32.050973-78.221526 40.051181-118.537743 4.815679-24.260543 6.930853-43.315528 7.446599-54.654784C850.217025 462.639802 840.197834 451.66382 827.246871 451.075419z"
              fill="#ffffff" p-id="5658"></path>
            <path
              d="M510.171352 700.19215c106.568131 0 193.353706-86.506213 193.353706-193.220676L703.525058 260.871449c0-106.59269-86.567611-193.220676-193.353706-193.220676-106.570177 0-193.353706 86.508259-193.353706 193.220676l0 246.100024C316.817646 613.567233 403.385257 700.19215 510.171352 700.19215zM363.764887 260.871449c0-80.693834 65.674769-146.273435 146.407488-146.273435 80.8197 0 146.407488 65.570391 146.407488 146.273435l0 246.100024c0 80.69588-65.674769 146.273435-146.407488 146.273435-80.8197 0-146.407488-65.568345-146.407488-146.273435L363.764887 260.871449z"
              fill="#ffffff" p-id="5659"></path>
          </svg>
  
          <svg v-else @click="recStop" t="1719885185577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4254" width="40" height="40"><path d="M512 884.363636c-50.059636 0-98.722909-9.890909-144.64-29.393454A372.922182 372.922182 0 0 1 249.018182 774.981818a372.922182 372.922182 0 0 1-79.965091-118.365091A367.872 367.872 0 0 1 139.636364 512c0-50.059636 9.890909-98.722909 29.393454-144.64a372.945455 372.945455 0 0 1 79.965091-118.365091 372.945455 372.945455 0 0 1 118.365091-79.965091A367.872 367.872 0 0 1 512 139.636364c50.059636 0 98.722909 9.890909 144.64 29.393454a372.945455 372.945455 0 0 1 118.365091 79.965091 372.945455 372.945455 0 0 1 79.965091 118.365091A367.872 367.872 0 0 1 884.363636 512c0 50.059636-9.890909 98.722909-29.393454 144.64A372.898909 372.898909 0 0 1 774.981818 774.981818a372.898909 372.898909 0 0 1-118.365091 79.965091A367.872 367.872 0 0 1 512 884.363636z m0-698.181818c-43.776 0-86.341818 8.634182-126.464 25.693091a326.516364 326.516364 0 0 0-103.633455 70.050909 326.539636 326.539636 0 0 0-70.027636 103.610182A321.629091 321.629091 0 0 0 186.181818 512c0 43.776 8.634182 86.341818 25.693091 126.464a326.516364 326.516364 0 0 0 70.050909 103.633455 326.516364 326.516364 0 0 0 103.610182 70.027636A321.629091 321.629091 0 0 0 512 837.818182c43.776 0 86.341818-8.634182 126.464-25.693091a326.516364 326.516364 0 0 0 103.633455-70.050909 326.516364 326.516364 0 0 0 70.027636-103.610182A321.629091 321.629091 0 0 0 837.818182 512c0-43.776-8.634182-86.341818-25.693091-126.464a326.516364 326.516364 0 0 0-70.050909-103.633455 326.516364 326.516364 0 0 0-103.610182-70.027636A321.652364 321.652364 0 0 0 512 186.181818z m104.378182 458.612364h-210.199273c-15.36 0-27.834182-12.497455-27.834182-27.834182v-210.199273c0-15.36 12.497455-27.834182 27.834182-27.834182h210.199273c15.36 0 27.834182 12.474182 27.834182 27.834182v210.199273c0 15.36-12.474182 27.834182-27.834182 27.834182z m-200.704-37.329455h191.208727v-191.208727h-191.208727v191.208727z" fill="#ffffff" p-id="4255"></path></svg>
        </div>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="发送" placement="top-start">
          <div class="record-btn">
          <svg @click="sendmsgClick" t="1719818052223" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="4574" width="15" height="15">
            <path
              d="M1008.00076 6.285714q18.857143 13.714286 15.428571 36.571429l-146.285714 877.714286q-2.857143 16.571429-18.285714 25.714285-8 4.571429-17.714286 4.571429-6.285714 0-13.714286-2.857143l-258.857142-105.714286-138.285715 168.571429q-10.285714 13.142857-28 13.142857-7.428571 0-12.571428-2.285714-10.857143-4-17.428572-13.428572T365.715046 987.428571v-199.428571l493.714285-605.142857-610.857142 528.571428-225.714286-92.571428q-21.142857-8-22.857143-31.428572-1.142857-22.857143 18.285714-33.714285L969.143617 5.142857q8.571429-5.142857 18.285714-5.142857 11.428571 0 20.571429 6.285714z"
              p-id="4575" fill="#ffffff"></path>
          </svg>
        </div>
          <!-- <el-button class="sendbutton" @click="sendmsgClick">发送</el-button> -->
        </el-tooltip>
      </div>
    </div>
    <!-- <audio controls ref="audio" class="aud" v-show="false">
      <source :src="audioUrl" />
    </audio> -->

  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { formatDate } from '@/utils/formatTime';
import axios from 'axios';
import { tr } from 'element-plus/es/locale/index.mjs';
//必须引入的核心
import Recorder from 'recorder-core';
//引入mp3格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
//录制wav格式的用这一句就行
import 'recorder-core/src/engine/wav';

//可选的插件支持项，这个是波形可视化插件
import 'recorder-core/src/extensions/waveview';
// import { marked } from "marked";
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
const markedid = 'preview-only';
const inputRef = ref()
const audio = ref()
const aichat = ref(false)
const recordVoice = ref('语音输入')
const startRecord = ref(true)
const sendmsg = ref<string>('')
const messages = ref([
  { text: "你好！欢迎访问华教AI，有什么问题可以问我哦！", align: "left", name: "HJAI", time: formatDate(new Date(), 'HH:MM') },
  // { text: "你好！", align: "right", name: "丽丝", time: "19:21" },
  // { text: "如何才能帮助您？", align: "left", name: "王阳阳", time: "21:26" },
  // {
  //   text: "我需要帮助进行Vue.js开发我需要帮助进行Vue.js开发我需要帮助进行Vue.js开发我需要帮助进行Vue.js开发",
  //   align: "right",
  //   name: "丽丝",
  //   time: "22:37"
  // }
])
const uploadFile = ref(null)



const radio = ref(null)
const isStart = ref(true)
function startBf(text: any){
  speech(text)
  isStart.value = false
}

const fileList = reactive([])
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('图片格式必须为png,jpg!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Avatar picture size can not exceed 10MB!')
    return false
  }
  return true
}
const handleAvatarSuccess = (response: any) => {
  console.log(response.file);
  uploadFile.value = response.file
}



function sendmsgClick() {
  if (!sendmsg.value) {
    ElMessage.error("请输入消息")
    return
  }
  messages.value.push({ text: sendmsg.value, align: "right", name: "我", time: formatDate(new Date(), 'HH:MM') })
  robotReplay()
}


let controller: AbortController | null = null//在外面定一个控制器,设置为空 


function stopchat() {
  // 在需要的时候中止请求
  controller.abort();
  isStart.value = true
  aichat.value = false
}

async function robotReplay() {
  const requestData = []
  // if(uploadFile.value) {
  //   const obj = {image: uploadFile.value, type: 'image'}
  //   requestData.push(obj)
  // }
  if(sendmsg.value) {
    const obj = {text: sendmsg.value, type: 'text'}
    requestData.push(obj)
  }
  if (controller) {
    controller.abort()
    controller = null
  }
  //没有的话就到这一步
  controller = new AbortController()

  isStart.value = false
  const requestBody = {
    "messages": [
      {
        "role": "user",
        "content": requestData
      }
    ],
    "stream": true,
  }
  console.log(JSON.stringify(requestBody))
  const res = await fetch('http://gs1.chinacqhj.com:21986/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer fastgpt-p8KKIxw7QX8RP3t0dWdej313QoFCu0KXTndk2QCnaDWGyWWMnt0e1z8svnT4Z2WL",
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  }
  );
  console.log(res,'res')
  sendmsg.value = ''
  uploadFile.value = null
  inputRef.value.focus()
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const processedSentences = []; // 用于存储已处理的句子
  while (1) {
    // 获取最后一条消息
    const lastMessage = messages.value[messages.value.length - 1];
    // 读取数据流的第一块数据，done表示数据流是否完成，value表示当前的数
    const { done, value } = await reader.read();
    if (done) {
      responseText.scrollTop = ''
      aichat.value = false
      isStart.value = true
      break;
    }
    
    const text = decoder.decode(value);
    // console.log(text,'123');
    if (text.indexOf('DONE') !== -1) {
      aichat.value = false
      isStart.value = true
      // speech(lastMessage.text)
      break;
    }
    if (text.indexOf(': ping') !== -1) {
      continue
    }
    // 打印第一块的文本内容
    // const responseJson = JSON.parse(text.substr(5));
    // console.log(text,'text');

    // 使用 split 方法分割字符串，支持处理一个或多个 JSON 数据块
    const responses = text.split(/\ndata: /).filter(Boolean);

    responses.forEach(response => {
        try {
            // 去掉前缀 'data: ' 并解析为 JSON 对象
            const trimmedResponse = response.trim().replace(/^data:\s*/, '');
            const responseJson = JSON.parse(trimmedResponse);
            // 在这里处理 responseJson，例如处理 choices 中的数据
            const content = responseJson.choices[0].delta.content;
            if (content.match(/[。？！，：]/)) { // 匹配字符分割
                // console.log(lastMessage.text, 'text');

                const sentences = lastMessage.text.split(/[。？！，：]/); //  匹配字符分割
                sentences.forEach(async sentence => {
                    const trimmedSentence = sentence.trim();
                    if (trimmedSentence !== '' && !processedSentences.includes(trimmedSentence)) {
                        processedSentences.push(trimmedSentence); // 将句子加入已处理列表
                        await speech(trimmedSentence);
                    }
                });
            }
            if (lastMessage && lastMessage.name === "HJAI") {
              lastMessage.text += content;
              var responseText = document.getElementById("chat-container");
              responseText.scrollTop = responseText.scrollHeight;
            } else {
              // 否则创建新的消息记录
              messages.value.push({
                text: content,
                align: "left",  // 假设 AI 回复左对齐
                name: "HJAI",
                time: formatDate(new Date(), 'HH:MM')
              });
              aichat.value = true
            }

            // console.log(responseJson);
        } catch (error) {
            console.error('解析 JSON 出错:', error);
            // 可以添加错误处理逻辑，比如记录日志或者其它处理
        }
    });




    // const responseJson = JSON.parse(text.replace(/data:\s*/g, ''));
    // const content = responseJson.choices[0].delta.content;
    // if(content.indexOf('。') !== -1) {
    //   console.log(lastMessage.text,'text');

    //   const sentences = lastMessage.text.split('。'); // 按句号分割文本
    //   sentences.forEach(async sentence => {
    //     if (sentence.trim() !== '' && !processedSentences.includes(sentence)) {
    //         processedSentences.push(sentence); // 将句子加入已处理列表
    //         await speech(sentence)
    //     }
    //   })
    // }


    // const content = responseJson.choices[0].delta.content;
    // if (content.match(/[。？！，：]/)) { // 匹配句号、问号和感叹号
    //     // console.log(lastMessage.text, 'text');

    //     const sentences = lastMessage.text.split(/[。？！，：]/); // 按句号、问号和感叹号分割文本
    //     sentences.forEach(async sentence => {
    //         const trimmedSentence = sentence.trim();
    //         if (trimmedSentence !== '' && !processedSentences.includes(trimmedSentence)) {
    //             processedSentences.push(trimmedSentence); // 将句子加入已处理列表
    //             await speech(trimmedSentence);
    //         }
    //     });
    // }
    // // console.log(processedSentences,'processedSentences');

    // // 将消息添加到 messages.value 数组中

    // // 如果最后一条消息是同一个用户且时间很短，则更新内容
    // if (lastMessage && lastMessage.name === "HJAI") {
    //   lastMessage.text += content;
    //   var responseText = document.getElementById("chat-container");
    //   responseText.scrollTop = responseText.scrollHeight;
    // } else {
    //   // 否则创建新的消息记录
    //   messages.value.push({
    //     text: content,
    //     align: "left",  // 假设 AI 回复左对齐
    //     name: "HJAI",
    //     time: formatDate(new Date(), 'HH:MM')
    //   });
    //   aichat.value = true
    // }
  }




  // axios({  
  //   method: 'post',  
  //   url: 'http://192.168.0.219:21985/v1/chat/completions', // 替换为你的流式接口URL  
  //   responseType: 'stream',
  //   data: requestBody
  // })
  // .then(response => {
  //   response.data.on("data", (chunk) => {
  //     console.log(chunk, "data");
  //     // 处理每个数据块，例如写入文件或进行其他操作
  //   });

  //   const responseData = res.data; // 获取完整的响应数据
  //   console.log(responseData,'fucker');
  //   console.log(res)
  //   sendmsg.value = ''
  //   inputRef.value.focus()
  // })
  // .catch((err: any) => {
  //   console.error(err); 
  // })
}
const audioUrl = ref(''); // 音频源的URL
let audioElement: HTMLAudioElement | null = null;

const speechQueue = []; // 队列用于存储待播放的任务
let isProcessingQueue = false; // 标记是否正在处理队列
let currentAudioPromise = Promise.resolve(); // 当前音频的 Promise，初始为 resolved 状态

async function speech(text) {
    // 将任务加入队列
    speechQueue.push(text);

    // 如果当前没有在处理队列，则开始处理队列
    if (!isProcessingQueue) {
        isProcessingQueue = true;
        processQueue();
    }
}

async function processQueue() {
    try {
        while (speechQueue.length > 0) {
            const text = speechQueue.shift(); // 取出队列中的第一个任务

            const obj = {
                "character": "Hutao",
                "emotion": "讲解科普女声",
                "text": text,
                "text_language": "zh",
                "stream": false
            };

            const streamUrl = 'http://192.168.0.219:21983/tts';
            const res = await axios.post(streamUrl, obj, { responseType: 'arraybuffer' });
            const blob = new Blob([res.data], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);

            // 等待当前音频播放完成后再播放下一个
            await currentAudioPromise;
            currentAudioPromise = playAudio(url); // 设置新的播放 Promise
        }

    } catch (error) {
        console.error('处理队列时发生错误:', error);
    } finally {
        // 标记处理队列结束
        isProcessingQueue = false;
    }
}

async function playAudio(url) {
    return new Promise((resolve, reject) => {
        // 创建新的 Audio 元素并加载音频
        const audioElement = new Audio();
        audioElement.src = url;

        // 监听音频加载完成事件
        audioElement.onloadedmetadata = () => {
            audioElement.play(); // 加载完成后立即播放音频
        };

        // 处理加载错误
        audioElement.onerror = (err) => {
            console.error('音频加载错误:', err);
            reject(err); // 拒绝 Promise，表示出现错误
        };

        // 监听音频播放结束事件
        audioElement.onended = () => {
            console.log('音频播放完毕');
            resolve(); // 解析 Promise，表示播放完成
        };
    });
}




// async function speech(text: any) {
//   // 创建一个新的 AudioContext 对象

//   // 流式传输音频的URL，注意替换成你实际的服务器端URL
//   const streamUrl = `http://192.168.0.219:21983/tts`;
//   const obj = {
//         "character": "Hutao",
//         "emotion": "default",
//         "text": text,
//         "text_language": "多语种混合",
// 				"stream": false
//     }
//   await axios.post(streamUrl,obj, { responseType: 'arraybuffer' }).then(res => {
//           // 将响应的arraybuffer转换为Blob对象
//           const blob = new Blob([res.data], { type: 'audio/wav' });
//           console.log(blob,'blob');
//           // 将Blob对象转换为URL对象
//           const url = URL.createObjectURL(blob);
//           audioUrl.value = url; // 更新音频源的URL
//           console.log(audioUrl.value,'audioUrl.value');
//           // 创建新的audio元素并播放
//           audioElement = new Audio();
//           audioElement.src = url;
//           // 监听音频加载完成事件
//           audioElement.onloadedmetadata = () => {
//             audioElement.play(); // 加载完成后播放音频
//           };
//            // 监听音频播放结束事件
//            audioElement.onended = () => {
//                 console.log('音频播放完毕');
                
//           isStart.value = true
//                 // 这里可以进行播放完毕后的处理，例如停止播放或者进行下一步操作
//               };
//   })

// }


// 录音功能
let rec: any;
let recBlob: any;
let wave: any;
const recwave = ref(null);
// 打开录音
function recOpen() {
  //创建录音对象
  rec = Recorder({
    type: 'wav', //录音格式，可以换成wav等其他格式
    sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
    bitRate: 16, //录音的比特率，越大音质越好
    onProcess: (
      buffers: any,
      powerLevel: any,
      bufferDuration: any,
      bufferSampleRate: any,
      newBufferIdx: any,
      asyncEnd: any,
    ) => {
      //录音实时回调，大约1秒调用12次本回调
      //可实时绘制波形，实时上传（发送）数据
      if (wave) {
        wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
      }
    },
  });
  if (!rec) {
    // alert('当前浏览器不支持录音功能！');
    ElMessage.error('当前浏览器不支持录音功能！')
    return;
  }
  //打开录音，获得权限
  rec.open(
    () => {
      // console.log('录音已打开');
      ElMessage.success('已开始录音')
      startRecord.value = false
      recStart()
      recordVoice.value = '结束录音'
      const divElement = recwave.value; // 获取 DOM 元素
      if (divElement) {
        // 等待下一个渲染帧以确保元素已经被渲染
        requestAnimationFrame(() => {
          const height = divElement.clientHeight;
          const width = divElement.clientWidth;
          if (recwave.value) {
            wave = Recorder.WaveView({ elem: recwave.value });
          }
        });
      }
    },
    (msg: any, isUserNotAllow: any) => {
      //用户拒绝了录音权限，或者浏览器不支持录音
      console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg);
      ElMessage.error((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)

    },
  );
}
// 开始录音
function recStart() {
  if (!rec) {
    console.error('未打开录音');
    return;
  }
  rec.start();
  console.log('已开始录音');
}
// 结束录音
function recStop() {
  startRecord.value = true
  recordVoice.value = '语音输入'
  if (!rec) {
    console.error('未打开录音');
    return;
  }
  rec.stop(
    (blob: any, duration: any) => {
      //blob就是我们要的录音文件对象，可以上传，或者本地播放
      recBlob = blob;
      //简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
      const localUrl = (window.URL || window.webkitURL).createObjectURL(blob);
      console.log('录音成功', blob, localUrl, '时长:' + duration + 'ms');
      upload(blob); //把blob文件上传到服务器
      rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
      wave = null
    },
    (err: any) => {
      console.error('结束录音出错：' + err);
      rec.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    },
  );
}
// 上传录音
function upload(blob: any) {
  //使用FormData用multipart/form-data表单上传文件
  //或者将blob文件用FileReader转成base64纯文本编码，使用普通application/x-www-form-urlencoded表单上传
  // const form = new FormData();
  // form.append('file', blob, 'recorder.mp3'); // 和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.mp3
  // // form.append('key', 'value'); // 其他参数
  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', 'https://192.168.0.219:21981/v1/audio/transcriptions');
  // xhr.onreadystatechange = () => {
  //   if (xhr.readyState == 4) {
  //     if (xhr.status == 200) {
  //       console.log('上传成功');
  //     } else {
  //       console.error('上传失败' + xhr.status);
  //     }
  //   }
  // };
  // xhr.send(form);
  // 也可以写自己的上传函数
  // uploadService(blob, 'zengjiaqi_test.wav');
  const obj = {
    file: blob
  }
  axios.post('https://192.168.0.219:21981/v1/audio/transcriptions',
		obj,
		{
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}
	).then(async (res: any) => {
    console.log(res,'res');
    if(res.data.code === 200){
      sendmsg.value = res.data.data
      sendmsgClick()
    }
  })

}
// 本地播放录音
function recPlay() {
  //本地播放录音试听，可以直接用URL把blob转换成本地播放地址，用audio进行播放
  const localUrl = URL.createObjectURL(recBlob);
  const audio = document.createElement('audio');
  audio.controls = true;
  document.body.appendChild(audio);
  audio.src = localUrl;
  audio.play(); //这样就能播放了
  //注意不用了时需要revokeObjectURL，否则霸占内存
  setTimeout(function () {
    URL.revokeObjectURL(audio.src);
  }, 5000);
}

onMounted(() => {
  // recOpen()

//   const arr = `data: {"model": "glm4", "id": "chatcmpl-c5f12e70-f8bc-462c-8d38-0a6390d32f59", "object": "chat.completion.chunk", "choices": [{"delta": {"role": "assistant", "content": "？", "function_call": null}, "finish_reason": "length", "index": 0}]}
// data: {"model": "glm4", "id": "chatcmpl-c5f12e70-f8bc-462c-8d38-0a6390d32f59", "object": "chat.completion.chunk", "choices": [{"delta": {"role": "assistant", "content": "？", "function_call": null}, "finish_reason": "length", "index": 0}]}
// data: {"model": "glm4", "id": "chatcmpl-c5f12e70-f8bc-462c-8d38-0a6390d32f59", "object": "chat.completion.chunk", "choices": [{"delta": {"role": "assistant", "content": "？", "function_call": null}, "finish_reason": "length", "index": 0}]}
// `;

// // 使用 split 方法分割字符串，支持处理一个或多个 JSON 数据块
// const responses = arr.split(/\ndata: /).filter(Boolean);

// responses.forEach(response => {
//     try {
//         // 去掉前缀 'data: ' 并解析为 JSON 对象
//         const trimmedResponse = response.trim().replace(/^data:\s*/, '');
//         const responseJson = JSON.parse(trimmedResponse);
//         // 在这里处理 responseJson，例如处理 choices 中的数据
//         console.log(responseJson);
//     } catch (error) {
//         console.error('解析 JSON 出错:', error);
//         // 可以添加错误处理逻辑，比如记录日志或者其它处理
//     }
// });


})

</script>

<style scoped lang="scss">
.main-container {
  width: 100%;
  height: 100vh;
  background-color: #f6f6f6;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  .header-father {
    padding-left: 10px;
    box-sizing: border-box;
  }

  .chat-container {
    margin: 0px 10px;
  }

  .chat-footer {
    padding: 0px 10px;
    box-sizing: border-box;
  }
}

.header-father {
  width: 100%;
  background-color: white;
  margin-bottom: 20px;
}

.chat-header {
  height: 80px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  /* font-size: 25px; */
  align-items: center;
  letter-spacing: 3px;

  img {
    height: 40px;
    margin-right: 10px;
  }

  /* text-align: center; */
}

.chat-container {
  max-width: 1000px;
  width: 100%;
  height: calc(100% - 220px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  /* border: 1px solid #e4e7ed; */
  border-radius: 3px;
  padding: 16px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-bottom: 20px;
  overflow: auto;

  .name {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 12px;
    color: #909399;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
  }
}

.chat_message {
  // padding: 6px 12px;
  background: #f8f8f9;
  border-radius: 4px;
  margin-bottom: 15px;
  word-wrap: break-word;
  font-weight: 400;
  font-size: 14px;
  color: #303133;
}

.message-left {
  max-width: 418px;
  align-self: flex-start;

  .chat_message {
    background-color: #f8f8f9;
  }

  .name {
    align-self: flex-start;
  }
}

.message-right {
  max-width: 418px;
  align-self: flex-end;
  display: flex;
  flex-direction: column;

  .chat_message {
    background-color: #ebf3ff;
  }

  .name {
    align-self: flex-end;
  }
}

.chat-footer {
  width: 100%;
  height: 60px;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 10px;
  .textareinput {
    width: 70%;
    border: none;
    outline: none;
    :deep(.el-textarea__inner){
      height: 30px;
      border: none;
      outline: none;
      box-shadow: none;
      background: none !important;
    }
  }
}


.sendbutton {
  border: none;
  outline: none;
  background-color: #6c5ce7;
  padding: 10px 20px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  border-radius: 5px;
  transition: all ease 0.1s;
  box-shadow: 0px 5px 0px 0px #a29bfe;
  height: 40px;
  width: 100px;
}

.sendbutton:active {
  transform: translateY(5px);
  box-shadow: 0px 0px 0px 0px #a29bfe;
}

.loading svg polyline {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loading svg polyline#back {
  fill: none;
  stroke: #ff4d5033;
}

.loading svg polyline#front {
  fill: none;
  stroke: #ff4d4f;
  stroke-dasharray: 48, 144;
  stroke-dashoffset: 192;
  animation: dash_682 1.4s linear infinite;
}

@keyframes dash_682 {
  72.5% {
    opacity: 0;
  }

  to {
    stroke-dashoffset: 0;
  }
}

.chat_genr {
  display: flex;
  align-items: center;
  margin-left: 30px;
  color: gainsboro;
}

.sendbar {
  display: flex;
  align-items: center;
  position: relative;
  .record-bot{
    position: absolute;
    bottom: 40px;
    right: 30px;
  }
  svg {
    cursor: pointer;
    margin: 0px 10px;
  }
}
:deep(.md-editor-preview-wrapper){
  padding: 0px 10px
}
:deep(.md-editor-preview){
  font-size: 13px;
}
.record-btn{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1a2029;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}
</style>