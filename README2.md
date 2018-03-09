# user

想要了解整个开发模式，移步[http://yunlaiwu.github.io/blog/2016/12/01/react+redux+immutablejs](http://yunlaiwu.github.io/blog/2016/12/01/react+redux+immutablejs)。

# 功能

作家端，版权小站

# 目录结构

- public
	- dist
	- src
- views

# 技术栈及依赖模块

### 主要技术栈

React + Redux + Immutable.js + webpack

### 依赖模块

- 工具
  - compression node的express框架的压缩模块
  - lodash 一个现代的JavaScript实用程序库，提供模块化，性能和附加功能
  - superagent 小型渐进的客户端HTTP请求库
  - jQuery
  - Bootstrap
  - history 使用JavaScript管理会话历史记录
  - moment 在javascript中解析，验证，操作和显示日期
  - qrious 用于使用画布生成QR代码的纯JavaScript库
  - underscore Underscore是一个JavaScript库，它提供了一大堆有用的函数式编程助手，而无需扩展任何内置对象
  - swipe-js-iso Swipe（滑动js模块的同构版本）
  - slick-carousel 又是一个轮播图...

- React
  - react-bootstrap UI框架
  - react-date-range 时间及时间范围控件
  - react-slick 轮播图组件
  - react-dragula 拖拽控件
  - react-image-crop 图片裁剪控件
  - react-kendo 又是一个UI库，叫Kendo UI 有jQuery版本和Angular版本
  - react-router-bootstrap 集成react-router 和 react-bootstrap（为什么要集成？感觉多余了...）
  - react-helmet React头盔？保护起到一个保护html头标签的作用
  - react-router  路由，页面跳转
  - react-router-scroll 控制路由页面的滚动行为

- Redux
  - redux-thunk 异步action
  - react-router-redux 解决时间旅行时redux页面跳转和react-router不一致的问题
  - redux-devtools Redux的实时编辑时间旅行环境
  - redux-devtools-dock-monitor 可移动大小的redux-devtools底座
  - redux-devtools-log-monitor 具有树视图的Redux DevTools的默认监视器，不明白啥意思

- Immutable.js
  - react-immutable-proptypes 和Immutable.js一起使用的props校验器
  - redux-immutable 用于创建与Immutable.js状态一起使用的Redux combineReducers的等效功能

> 奇怪的是，我在package.json里没有找到immutable.js的依赖，然而我在node_modules里面找到了...看来是当初直接`npm install`了

### 感觉重复或多余的模块

- lodash 和 underscore
- Bootstrap 和 react-bootstrap，和 react-kendo
- jQuery 和 React，jQuery 和 superagent
- swipe-js-iso 、 slick-carousel 、 和 react-slick 三个轮播图控件...

# 目录结构

### 大概的目录结构

只说app文件夹内部的

- commonComponents
公共组件目录

- components
业务展示组件目录

- containers
容器组件目录，按功能模块划分，比如关注的人是一个功能模块，它里面包含了两个tab（我关注的人和关注我的人，它的目录结构如下）
  - ![](http://upload-images.jianshu.io/upload_images/1828354-a952d90684877cdb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 详细的目录结构

> 不管外层的`node`项目

- `/public` 主要的代码存放目录
  - `/dist` 生产环境webpack打包出来的文件输出目录
  - `/src` 源码
    - `/app`
      - `/actions` 放redux 的 actions
        - `/HTTP.js` 网络请求的actions，思路是用`redux-thunk`实现异步dispatch action，不使用3个不同的action，而是使用状态码，0表示请求，字符串表示请求成功，-1表示失败
        - `/IPInfo.js` 就两个action，存储和更新
        - `/IPList.js` 一个action，重置(reset)IPList
        - `/Popups.js` 一些弹框action
      - `/components` 展示组件目录
      - `/containers` 容器组件目录，这里面容器组件连接展示组件的时候使用了ES7的decorator（装饰器）语法，比如`@connect`，后面再加一个purerender...需要花点时间学习下新语法
      - `/decorators` 这里只放了一个`purerender.js`看了下代码大概的意思是封装了一些函数结合`immutable.js`统一优化`shouldComponentUpdate`这个优化点
      - `/reducers` 放redux 的 reducers，这里用到了`../actions/HTTP.js`的`proccessNotify`方法来判断请求开始、成功、失败
      - `/utils` 放一些工具js和图片
        - `/auth.js` 检查校验用户
        - `/clone.js` 暴露出来一个好像是deep copy的函数
        - `/copyrightMap.js` 版权类型map，提供两个方法，一个以key获取value，另一个将 copyrightMap 的 key 和 value 翻转
        - `/fileExtension.js` 获取文件资源
        - `/funcs.js` 提供两个方法，1.从location获得当前路径，2.根据name获得cookie
        - `/validaation.js` 一个校验方法，具体校验的东西叫 strategy 策略？剧本？
      - `/app.js` 入口js，在这里初始化redux和一些react基本的东西
      - `/routes.js` 在这里配置路由
- `/server.js` node 服务器脚本，express框架，使用了pmx监控、morgan输出日志、以及其他一些一眼就能看出是啥的中间件...

- `/view`
  - `/index.ejs` 作家端主页
  - `/brower.ejs` 提示浏览本版本过低的页面
  - `/edm.ejs` 邮件？下载？
  - `/immutable.ejs` immutable测试页
  - ... 感觉除了`index.ejs`其他的没啥用

# 附录1：React 公共组件开发规范

### 属性定义

![](http://upload-images.jianshu.io/upload_images/1828354-a0118b1e13188ad8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

须有属性定义及完整注释，特殊情况须注明

React自身提供了`static propTypes（ES6）`语法供开发者声明属性的类型

- 优点：
是开发时点击组件进入即可明确的看到可传入的属性和属性默认值，相当于自带文档

- 缺点：
麻烦

### 低耦合

公共组件的目标是成为一个通用的组件库，所以要和业务解耦

- 业务、需求需要的特殊样式不是公共组件

- 纯展示组件，不依赖于store

### 测试用例

测试用例就是一个所有组件的Demo，用于直观的展示组件的样式和用途

条件充分时利用Mocha进行单元测试

### 文档

开发周期放缓时，补写文档，详细描述组件的用途、可传入属性，如有条件，可增加自定义修改组件方法

### 关于setState

虽然我们使用redux，不推荐使用state
但是如果要抽象出一个公共的组件库，某些场景比如tab切换，radioGroup，不依赖redux的UI状态变化是必须要使用到state的，而使用state时setState有一些需要注意的问题，如下：

由于setState方法修改后的state在render之后才生效，
传统式setState方法会导致一个问题，后续操作无法依赖前置setState之后的数据，
而函数式setState方法可以完美解决，所以推荐只使用函数式setState

> 参考文章：[组件的 state 和 setState](http://huziketang.com/books/react/lesson10)
[setState：这个API设计到底怎么样](https://zhuanlan.zhihu.com/p/25954470)

# 附录2：关于webpack的问题

- 没有sourcemap机制，报错都包在打包出来的bundle.js里...非常不利于调试
![](http://upload-images.jianshu.io/upload_images/1828354-7677bfe8bd6d7c2f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 附录3：几个疑问

### webpack、React版本更新问题

webpack、React及各依赖，是否可以更新？
