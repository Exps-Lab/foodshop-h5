<p align="center">
  <img width="120" src="https://github.com/Exps-Lab/foodshop-h5/blob/master/screenshot/logo.png" alt="logo">
</p>

# FoodShop
一个有完整全流程(商品列表，定位，下单，支付，订单，个人中心)业务场景的C端外卖项目!

## 项目介绍
在2024年花时间梳理并开发一个全业务流程包含前后端的项目还有没有意义❓我自己的答案是肯定的。
为啥这么说，好处：

理解完整的C端外卖业务场景
全面技术提升
自己从0到1开发一套系统

对自己有帮助，希望也能帮助到其他人开源小伙伴

致敬：部分业务场景和逻辑参考bailicangdu的 [vue2-elm](https://github.com/bailicangdu/vue2-elm) 项目，向大佬致谢。

## 技术栈
Vue3 + Vue-router +Vite + Pinia + Vant3 + MPA

## 项目运行
```
版本要求：
node (14.20 及以上版本)
```

```
git clone https://github.com/Exps-Lab/foodshop-h5.git

cd foodshop-h5

npm install

npm run dev

访问:
>1. http://localhost:8000（可依照需要自行更改配置）
>2. 选择对应列表页访问即可（方便本地调试）

# 所有资源列表，点击跳转到对应页面 #
home：/src/pages/home/index.html
login：/src/pages/login/index.html
order：/src/pages/order/index.html
ucenter：/src/pages/ucenter/index.html

```
>*  Tips：最好同时启动foodshop-node端server的项目。目前foodshop-h5项目数据都是从接口获取的真实数据！

## 效果演示

## 关联项目列表
| 项目             | 项目描述       | 技术栈                                                            | 项目链接          |
|----------------|----------------|----------------------------------------------------------------|-----------------|
| foodshop-h5    | FoodShop售卖系统——h5用户端 | Vue3 + Vite + Vant + MPA                                       | https://github.com/Exps-Lab/foodshop-h5     |
| foodshop-node  | FoodShop售卖系统——server端 | Node + Mongodb + Mongoose + Express + Redis + RabbitMQ + Nginx | https://github.com/Exps-Lab/foodshop-node   |
| foodshop-admin | FoodShop售卖系统——admin管理后台端| Vue3 + Vite + Arco.design + SPA                                | https://github.com/Exps-Lab/foodshop-admin     |

## 已完成的各个功能按模块拆分：
按业务场景的功能模块拆分多个spa维护（spa && mpa混合结构）
* [x] 售前模块（产生订单前的所有展示售卖页面）
* [x] 订单模块（从确认订单到订单详情页面）
* [x] 个人中心模块（个人中心为入口的所有功能页面）
* [x] 登录模块（login页面）
* [x] 特殊模块（支付，定位等）

## 梳理各个页面的需求文档，方便记录待实现功能和共享理解需求点
#### 售前模块——文档：
>* 首页（站点入口）：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E7%AB%99%E7%82%B9%E9%A6%96%E9%A1%B5(%E5%85%A5%E5%8F%A3))
>* 个人定位聚合页(选择收获地址页)：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E4%B8%AA%E4%BA%BA%E5%AE%9A%E4%BD%8D%E8%81%9A%E5%90%88%E9%A1%B5(%E9%80%89%E6%8B%A9%E6%94%B6%E8%8E%B7%E5%9C%B0%E5%9D%80%E9%A1%B5))
>* 选择城市页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E9%80%89%E6%8B%A9%E5%9F%8E%E5%B8%82%E9%A1%B5)
>* 输入搜索详细定位页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E8%BE%93%E5%85%A5%E6%90%9C%E7%B4%A2%E8%AF%A6%E7%BB%86%E5%AE%9A%E4%BD%8D%E9%A1%B5)
>* 搜索附近商家或商品页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E6%90%9C%E7%B4%A2%E9%99%84%E8%BF%91%E5%95%86%E5%AE%B6%E6%88%96%E5%95%86%E5%93%81%E9%A1%B5)
>* 商品专题列表页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E5%95%86%E5%93%81%E4%B8%93%E9%A2%98%E5%88%97%E8%A1%A8%E9%A1%B5)
>* 商品-商铺搜索结果页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E5%95%86%E5%93%81-%E5%95%86%E9%93%BA%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5)
>* 商品详情页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5)

#### 登录/注册模块——文档：
>* 登录注册页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E7%99%BB%E5%BD%95%E6%B3%A8%E5%86%8C%E9%A1%B5)

#### 订单模块——文档：
>* 确认订单页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E7%A1%AE%E8%AE%A4%E8%AE%A2%E5%8D%95%E9%A1%B5)
>* 订单列表页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8%E9%A1%B5)
>* 订单详情页：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E9%A1%B5)
>* 订单支付：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E7%BD%91%E7%AB%99%E6%94%AF%E4%BB%98%E5%9C%BA%E6%99%AF)

#### 订单评价模块——文档：
>* 评价表单部分：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E8%AF%84%E4%BB%B7%E8%A1%A8%E5%8D%95%E9%A1%B5)
>* 评价在商铺详情里的展示部分：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E8%AF%84%E4%BB%B7%E5%B1%95%E7%A4%BA%E9%A1%B5)

#### 个人中心模块——文档：
>* 我的（个人中心）：
[Click It!](https://github.com/Exps-Lab/foodshop-h5/wiki/%E6%88%91%E7%9A%84%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83%EF%BC%89)

#### 特殊业务场景模块点——文档:
>支付货币系统模块:
>* 利用虚拟货币贯穿整体的购买流程
>* 具体方案wiki：[货币系统文档](https://github.com/Exps-Lab/foodshop-h5/wiki/%E7%BD%91%E7%AB%99%E8%B4%A7%E5%B8%81%E7%B3%BB%E7%BB%9F---%E9%A4%90%E5%B8%81)

> 地图定位模块：
>* 精准定位：https://lbs.qq.com/webApi/component/componentGuide/componentGeolocation (mac chrome不可用，用ip定位做降级处理)
>* IP模糊定位：https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp

## 项目结构简介
```
.
├──.husky                                                git拦截脚本
│   └── pre-commit                                       提交前拦截
├── build                                                build脚本
│   └── new_tag.sh                                       线上部署tag脚本
├── package.json                                         依赖文件
├── public                                               公共文件夹
│   ├── favicon.ico
│   └── index.html                                       index模板
├── src
│   ├── api                                              异步请求部分
│   │   ├── collect                                      收藏
│   │   ├── comment                                      评论
│   │   ├── common                                       公共
│   │   ├── home                                         首页
│   │   ├── login                                        登录
│   │   ├── order                                        订单
│   │   ├── pay                                          支付
│   │   ├── pos                                          定位
│   │   ├── shop                                         店铺
│   │   └── user                                         用户相关
│   │       ├── account.js                               账户
│   │       ├── address.js                               地址
│   │       ├── commentCenter.js                         用户中心
│   │       └── index.js                                 用户入口
│   ├── assets                                           静态资源
│   │   └── logo.png                                     logo
│   ├── common                                           公共文件夹
│   │   ├── components                                   公共组件
│   │   │   ├── Address_Mes_Block                        地址信息展示
│   │   │   ├── Chose_Pay_Channel                        选择支付方式
│   │   │   ├── Com_List                                 列表
│   │   │   ├── Com_List_Pagination                      分页列表
│   │   │   ├── Comment_Card                             评论卡片
│   │   │   ├── Goods_Card                               商品卡片
│   │   │   ├── Goods_Card_Order                         订单卡片
│   │   │   ├── Img_Preview                              图片预览
│   │   │   ├── Img_Upload                               图片上传
│   │   │   ├── Loading                                  Loading
│   │   │   ├── Pay_Order_Modal                          支付方式弹窗
│   │   │   ├── Show_Pos_In_Map                          详细地址地图展示
│   │   │   ├── Slide_Popup                              滑动弹窗
│   │   │   └── Tab_Bar                                  bar组件
│   │   ├── directives                                   全局自定义指令
│   │   │   ├── index.js
│   │   │   └── v-loading                                全局loading指令
│   │   ├── hooks                                        自定义钩子函数
│   │   │   └── userInfo.js                              控制用户相关
│   │   ├── styles                                       全局样式
│   │   │   ├── btn_style.less                           按钮相关
│   │   │   ├── common-style.less                        公共样式
│   │   │   ├── reset.less                               reset默认样式重置
│   │   │   └── variables.less                           全局样式变量
│   │   └── vantFunctionComponentsCss                    vant部分组件样式引入
│   ├── pages                                            页面
│   │   ├── 404.vue                                      404
│   │   ├── home                                         home业务模块
│   │   │   ├── App.vue
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   ├── router
│   │   │   ├── store
│   │   │   └── views
│   │   ├── login                                        login业务模块
│   │   │   ├── App.vue
│   │   │   ├── index.html
│   │   │   └── main.js
│   │   ├── order                                        订单业务模块
│   │   │   ├── App.vue
│   │   │   ├── hooks
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   ├── router
│   │   │   └── views
│   │   └── ucenter                                      用户中心业务模块
│   │       ├── App.vue
│   │       ├── hooks
│   │       ├── index.html
│   │       ├── main.js
│   │       ├── router
│   │       └── views
│   ├── plugins                                          全局插件
│   │   ├── Toast                                        Toast插件
│   │   │   ├── index.js
│   │   │   └── toast.vue
│   │   └── static
│   │       ├── success_icon.png
│   │       └── warning_icon.png
│   └── utils                                            全局工具方法
│       ├── User.js                                      用户相关
│       ├── calcGoodsPrice.js                            商品价格计算
│       ├── getAccuratePos.js                            用户定位相关
│       ├── index.js
│       ├── request.js                                   ajax请求封装
│       └── sessionStorage_keys.js                       session相关Key维护
├── vite.config.js                                       vite配置
├── README.md
└── viteConf                                             拆分vite各个项，方便维护
├── bundle.js                                            vite打包配置
├── cssConf.js                                           vite Css相关配置
├── index.js

56 directories, 57 files
```

## License
[GPL](https://github.com/Exps-Lab/foodshop-h5/blob/master/LICENSE)
