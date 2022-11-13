<template>
  <div id="mapContainer"></div>
  <section class="info-box">
    <p class="title font-bold-weight">{{shop_name}}</p>
    <p class="address">{{shop_address}}</p>
  </section>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { shop_pos, shop_name, shop_address } = route.query

  // 加载腾讯sdk
  const loadScript = () => {
    const txKey = 'UIWBZ-OJNWV-KOTPW-UEBS7-4KSVH-B2BNG'
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${txKey}&callback=init`
    script.onload = script.onreadystatechange = () => {
      initMap()
    };
    document.body.appendChild(script);
  }
  const initMap = () => {
    const [ lat, lng ] = shop_pos.split(',') || []
    const centerInstance = new TMap.LatLng(lat, lng);
    // 初始化地图
    const map = new TMap.Map('mapContainer', {
      zoom: 17, // 设置地图缩放
      center: centerInstance,
    });
    // MultiMarker文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker
    const marker = new TMap.MultiMarker({
      map: map,
      styles: {
        marker: new TMap.MarkerStyle({
          width: 20, // 样式宽
          height: 30, // 样式高
          anchor: { x: 10, y: 30 }, // 描点位置
        }),
      },
      geometries: [
        // 点标记数据数组
        {
          position: centerInstance,
          id: 'marker',
        },
      ],
    });
  }
  onMounted(() => {
    loadScript()
  })
</script>
 
<style lang="less" scoped>
  #mapContainer {
    height: 100vh;
  }
  .info-box {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1001;
    width: 100%;
    background-color: @fill-1;
    border-radius: 10px 10px 0 0;
    padding: 20px 20px 50px;
    box-sizing: border-box;
    .title {
      font-size: 16px;
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .address {
      font-size: 13px;
      color: @text-3;
      line-height: 1.2;
    }
  }
</style>
