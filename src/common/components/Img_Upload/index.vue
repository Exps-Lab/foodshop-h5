<!--
 * @method imgUploadFinish(data)    // 方法：上传成功。Important，在组件之外获取上传成功的图片url
 *   @param                         // 服务端返回的数据以及图片url
 * @description    // 附加说明。
 *   1) 本组件使用七牛云直传。
 *   2) 所有传入参数说明：
 *      · fileList: 数组类型，已经存在的图片列表，默认为 空数组，
            [
              {
                name: '文件名',   （no require）
                url: '文件路径'   （require）
              }
            ]
          oss上传：fileList 也可以用以下方式传递（数组里面直接存放url链接）
          ['http://a.png']
        · disabled: Boolean类型，是否禁用
 *      · acceptType: String, 支持上传的文件类型，MIME_type（非图片类型必填），MIME_type参照：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types

 *  @example // 调用示例
 *
 *    // 引入
    import ImgUpload from '@components/Img_Upload/index.vue'
 *   //  使用
    <ImgUpload
      accept="image/png,image/jpg"
      :disabled="false"
      :fileData="fileData"
      @imgUploadFinish="imgUploadFinish"
    />
-->

<template>
  <section class="upload-wrapper">
    <van-uploader
      ref="uploader"
      v-model="fileList"
      preview-image
      :preview-size="isSingleMode ? '60px': '80px'"
      upload-text="添加图片"
      :after-read="afterReadFile"
      :preview-full-image="!isSingleMode"
      :max-count="maxCount"
      :accept="acceptType"
      :multiple="isMultiple"
      :disabled="disabled"
      :deletable="!isSingleMode"
      :class="isSingleMode && fileList.length && 'hide-upload'"
      @click-preview="handlePreView"
    />
  </section>
</template>

<script setup>
  import axios from 'axios'
  import { uploadToken } from '@api/common/index'
  import { ref, watch, computed } from 'vue'

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false
    },
    // 支持接收的类型
    acceptType: {
      type: String,
      default: 'image/jpeg,image/png,image/jpg'
    },
    // 回显列表
    fileData: {
      type: Array,
      default: () => []
    },
    // 支持的upload的交互
    // single：没有另外的上传入口，在upload上传后原处回显，点击回显图片还是拉起上传，无预览
    // normal: 有已上传展示区域和上传区域，点击图片可预览
    uploaderMode: {
      type: String,
      default: 'normal'
    },
    maxCount: {
      type: Number,
      default: 1
    }
  })

  const domain = 'https://upload-z1.qiniup.com'
  const qiniuAddr = 'static.foodshop.fun'
  const emits = defineEmits(['imgUploadFinish'])
  const uploader = ref()
  const fileList = ref([])

  const isSingleMode = computed(() => props.uploaderMode === 'single')
  const isMultiple = computed(() => props.maxCount > 1 && !isSingleMode.value)
  /**
   * 获取文件流
   * @param fileRes 单个文件时为对象，多选时为数组
   */
  const afterReadFile = (fileRes) => {
    // [note] 单独处理single
    if (isSingleMode.value) {
      if (fileList.value.length > 1) {
        fileList.value.splice(0, 1)
      }
    }
    if (Array.isArray(fileRes)) {
      fileRes.forEach(item => {
        qiniuRequest(item.file)
      })
    } else {
      qiniuRequest(fileRes.file)
    }
  }

  // 点击回显图片拉起文件选择
  const handlePreView = () => {
    if (isSingleMode.value) {
      uploader.value.chooseFile()
    }
  }

  // 七牛上传
  const qiniuRequest = async (file) => {
    const extName = file.name.split('.').at(-1)
    const keyName = randomString(15) + '.' + extName

    // 从后端获取上传凭证token
    const { data: token } = await uploadToken()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('token', token)
    formData.append('key', keyName)

    // 获取到凭证以后再将文件上传到七牛云空间
    const res = await axios.post(domain, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res && res.status === 200) {
      const url = 'http://' + qiniuAddr + '/' + res.data.key
      emits('imgUploadFinish', url)
    } else {
      new Error(res.msg)
    }
  }

  const randomString = (len = 32) => {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  // 监听回显avatar
  watch(
    () => props.fileData,
    (now) => {
      fileList.value = [...fileList.value, ...now]
    },
    {
      immediate: true
    }
  )
  // watchEffect 会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪“所有“能访问到的响应式属性
  // watchEffect(() => {
  //   if (fileList.value.length > 0) return false
  //   fileList.value = [...fileList.value, ...props.fileData]
  // })
</script>

<style lang="less" scoped>
  .van-uploader {
    &:deep(.van-uploader__preview) {
      margin-right: 10px;
      .van-uploader__preview-image {
      border-radius: 0.1rem;
    }
    }
    &:deep(.van-uploader__upload) {
      margin: 0;
      border-radius: 0.1rem;
    }
    &.hide-upload {
      &:deep(.van-uploader__upload) {
        display: none;
      }
    }
  }

</style>
