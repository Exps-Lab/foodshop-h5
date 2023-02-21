<template>
  <div id="mapContainer"></div>
</template>

<script setup>
  import { onMounted, computed } from 'vue'

  const props = defineProps({
    posStr: String,
    mapSetting: {
      type: Object,
      default: () => {}
    },
    markerSetting: {
      type: Object,
      default: () => {}
    }
  })
  const addressPos = computed(() => {
    const { lat, lng } = JSON.parse(window.localStorage.getItem('appPos') || '{}')
    return props.posStr ? props.posStr.split(',') : [lat, lng]
  })

  // 加载腾讯sdk
  const loadScript = () => {
    if (document.querySelector('#testScript') === null) {
      const txKey = 'UIWBZ-OJNWV-KOTPW-UEBS7-4KSVH-B2BNG'
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.setAttribute('id', 'testScript')
      script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${txKey}&callback=init`
      script.onload = script.onreadystatechange = () => {
        initMap()
      }
      document.body.appendChild(script)
    } else {
      initMap()
    }
  }

  const initMap = () => {
    const TMap = window.TMap
    const [lat, lng] = addressPos.value
    const centerInstance = new TMap.LatLng(lat, lng)
    // 初始化地图
    const map = new TMap.Map('mapContainer', {
      zoom: 17, // 设置地图缩放
      center: centerInstance,
      ...props.mapSetting
    })
    // MultiMarker文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker
    const markerSetting = Object.assign({}, {
      width: 30, // 样式宽
      height: 45 // 样式高
    }, props.markerSetting)
    new TMap.MultiMarker({
      map,
      styles: {
        // [note] 更改default配置控制默认的marker展示
        default: new TMap.MarkerStyle(markerSetting)
      },
      geometries: [
        // 点标记数据数组
        {
          position: centerInstance,
          id: 'default'
        }
      ]
    })
  }

  onMounted(() => {
    loadScript()
  })
</script>

<style lang="less" scoped>
  #mapContainer {
    height: 100%;
  }
</style>
