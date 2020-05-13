const NAMESPACE = 'LOADING';

const createLoadingPlugin = store => {
  const original = store.dispatch;
  store.handler = {
    onFailure(error, type, params, options) {
      store.commit({
        type: `${NAMESPACE}/HIDE`,
        payload: {
          actionType: type
        }
      })
    },
  }
  store.dispatch = (type, ...params) => {
    const action = original.call(store, type, params);
    action.then((result) => {
      Promise.resolve(result)
    }).catch((error) => {
      Promise.resolve(store.handler.onFailure(error, type, ...params))
    })
    return action
  }

  if (store.state[NAMESPACE]) {
    throw new Error(
      `createLoadingPlugin: ${NAMESPACE} exited in current store`
    )
  }

  store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
      global: false,
      models: {},
      effects: {}
    },
    mutations: {
      SHOW(state, { payload }) {
        const namespace = payload.actionType ? payload.actionType.split('/')[0] : '';
        const actionType = payload.actionType;

        state.global = true
        state.models = {
          ...state.models,
          [namespace]: true,
        }
        state.effects = {
          ...state.effects,
          [actionType]: true
        }
      },
      HIDE(state, { payload }) {
        const namespace = payload.actionType ? payload.actionType.split('/')[0] : '';
        const actionType = payload.actionType;

        const effects = { ...state.effects, [actionType]: false };
        const models = {
          ...state.models,
          [namespace]: Object.keys(effects).some(actionType => {
            const _namespace = actionType.split('/')[0];
            if (_namespace !== namespace) return false;
            return effects[actionType];
          }),
        };
        const global = Object.keys(models).some(namespace => {
          return models[namespace];
        });
        state.effects = effects;
        state.models = models;
        state.global = global;
      }
    }
  })

  store.subscribeAction({
    before: action => {
      store.commit({
        type: `${NAMESPACE}/SHOW`,
        payload: {
          actionType: action.type
        }
      })
    },
    after: action => {
      store.commit({
        type: `${NAMESPACE}/HIDE`,
        payload: {
          actionType: action.type
        }
      })
    }
  })
}
export default createLoadingPlugin