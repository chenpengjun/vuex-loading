# vuex-loading
参照dva-loading

# 如何使用
# store先引入vuex-laoding插件
```
  import Vue from 'vue'
  import Vuex from './vuex'
  import user from './modules/user'
  import VuexLoading from './vuex-loading'

  Vue.use(Vuex);
  const store = new Vuex.Store({
    modules: {
      user
    },
    plugins:[VuexLoading]
  })
  export default store
```
# user组件如何获取action状态
```
  loading.effects['user/getUserInfo'] or this.state.loading.effects['user/getUserInfo']
```


