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
    const txKey = 'UIWBZ-OJNWV-KOTPW-UEBS7-4KSVH-B2BNG'
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${txKey}&callback=init`
    script.onload = script.onreadystatechange = () => {
      initMap()
    }
    document.body.appendChild(script)
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
      width: 20, // 样式宽
      height: 30, // 样式高
      anchor: { x: 10, y: 30 } // 描点位置
    }, props.markerSetting)
    new TMap.MultiMarker({
      map,
      styles: {
        marker: new TMap.MarkerStyle(markerSetting)
      },
      geometries: [
        // 点标记数据数组
        {
          position: centerInstance,
          id: 'marker'
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
