import { createStore } from 'vuex';
import { projectFirestore } from '../firebase/config';

export default createStore({
  state: {
    user: '',
  },
  mutations: {
    updateUserState(state, currentUser) {
      state.user = currentUser;
    },
  },
  actions: {
    async updateUserProfile({ commit }, user_uid) {
      // const docs = await projectFirestore
      //   .collection('Users')
      //   .where('id', '==', user_uid)
      //   .get();

      // const currentUser = docs.docs.map((doc) => doc.data())[0];

      projectFirestore
        .collection('Users')
        .where('id', '==', user_uid)
        .onSnapshot((snapshot) => {
          const currentUser = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              currentUser.push(change.doc.data());
              console.log(currentUser[0]);
              commit('updateUserState', currentUser[0]);
            }
            if (change.type === 'modified') {
              currentUser[0] = change.doc.data();
              commit('updateUserState', currentUser[0]);
            }
          });
        });
    },
  },
  getters: {
    getUserProfile(state) {
      return state.user;
    },
  },
});
