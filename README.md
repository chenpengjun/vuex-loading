# vuex-loading
参照dva-loading

#如何使用
```
  import Vue from 'vue'
  import Vuex from './vuex'
  import VuexLoading from './vuex-loading'

  Vue.use(Vuex);
  const store = new Vuex.Store({
    modules: {
    },
    plugins:[VuexLoading]
  })
  export default store
```

