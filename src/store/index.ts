import { createStore } from 'vuex';

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});

declare module 'vuex' {
  type StoreStateType = typeof store.state;
  export function useStore<S = StoreStateType>(): Store<S>;
}

export default store;
