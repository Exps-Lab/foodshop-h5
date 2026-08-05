# Foodshop H5 项目 Rules

## 技术栈
Vue 3.2+ | Vite 2.9+ | Pinia 2.0+ | Vue Router 4.0+ | Vant 3.6+ | Axios 0.26+ | Less 4.1+ | ESLint

## 目录结构
```
src/
├── api/              # API 接口（按模块：home/order/user/shop/pay 等）
├── common/           # 公共模块
│   ├── components/   # 全局公共组件（高复用、低耦合）
│   ├── hooks/        # 全局组合式函数
│   ├── directives/   # 自定义指令
│   └── styles/       # 全局样式
├── pages/            # 多页面模块（home/order/ucenter/login）
│   └── xxx/
│       ├── router/   # 模块路由
│       ├── store/    # 模块状态
│       ├── views/    # 页面视图
│       │   └── yyy/
│       │       ├── components/  # 页面级组件
│       │       └── hooks/       # 页面级 hooks
│       ├── App.vue
│       └── main.js
├── utils/            # 工具函数（request/User/calcGoodsPrice/getAccuratePos）
└── plugins/          # 插件封装
```

## 核心规范

### 1. 组件规范
**公共组件** (`common/components/`)
- 必须高复用、低耦合，禁止包含业务逻辑
- 通过 props/emits 定义接口，大驼峰命名（如 `Goods_Card`）
- 使用插槽提供扩展点

**页面组件** (`pages/xxx/views/yyy/`)
- 可包含业务逻辑，复杂逻辑抽取到同级 `hooks/`
- 使用 `@components` 别名引用公共组件

### 2. Hooks 规范
- 全局 hooks (`common/hooks/`)：跨模块复用，纯函数
- 页面 hooks (`pages/xxx/views/yyy/hooks/`)：页面业务逻辑
- 使用 `useXxx` 命名，返回响应式数据和方法

### 3. API 规范
- 按业务模块划分，统一使用 `@utils/request`
- 命名：动词 + 名词（如 `getShopDetail`）
- 必须提供 JSDoc 注释，返回 Promise

### 4. 状态管理规范
- 使用 Pinia，Store 命名：`xxxStore`
- 定义清晰的 state/getters/actions
- 异步逻辑在 actions 中处理

### 5. 工具函数规范
- 必须是纯函数，无副作用
- 必须添加 JSDoc 注释
- 业务工具独立成文件（如 `calcGoodsPrice.js`）

### 6. 样式规范
- 使用 Less，全局变量在 `variables.less`
- 组件样式使用 `scoped`
- Vant 样式覆盖在 `vantFunctionComponentsCss/`

### 7. 路由规范
- 模块独立配置，使用懒加载
- 开发 Hash 模式，生产 History 模式

## 解耦与复用原则

**必须遵循：**
1. 单一职责：组件/函数只负责一件事
2. 依赖注入：通过 props/emits 传递数据
3. 逻辑分离：UI 与业务逻辑分离（组件 + hooks）
4. 接口抽象：公共模块通过接口定义契约

**禁止行为：**
- ❌ 公共组件硬编码业务逻辑
- ❌ 组件间直接修改数据（用 emits）
- ❌ utils 引入 Vue API
- ❌ 跨模块引用页面组件/hooks
- ❌ 直接操作 DOM（用 ref）
- ❌ 组件中直接调用 axios（用 @api）

## 代码质量
- 提交前执行 `npm run lint`
- 检查范围：`src/**/*.{js,vue}`
- 必须通过 ESLint 检查

## 开发流程
1. 新增功能：确定模块 → 创建页面/组件 → 编写 API → 测试
2. 新增公共组件：评估复用性 → 设计接口 → 实现 UI
3. Bug 修复：定位问题 → 最小化修改 → 验证影响

## 注意事项
- 新增文件必须符合目录结构
- 公共模块修改需评估影响范围
- 复杂逻辑必须抽取到 hooks
- API 必须统一错误处理
- 工具函数必须添加注释
