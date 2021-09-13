import { createStore } from 'vuex';
import { projectFirestore } from '../firebase/config';

let unsub;
export default createStore({
  state: {
    user: '',
    qnt_msgs: 0,
  },
  mutations: {
    updateUserState(state, currentUser) {
      state.user = currentUser;
    },
    update_qnt_msgs(state, qnt) {
      state.qnt_msgs = qnt;
    },
  },
  actions: {
    async updateUserProfile({ commit }, user_uid) {
      projectFirestore
        .collection('Users')
        .where('id', '==', user_uid)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              console.log(change.doc.data());
              commit('updateUserState', change.doc.data());
            }
            if (change.type === 'modified') {
              commit('updateUserState', change.doc.data());
            }
          });
        });
    },
    async update_numbers_msgs({ commit }, user_uid) {
      const tempArr = [];
      unsub = projectFirestore
        .collection('UserMessages')
        .doc('users')
        .collection(user_uid)
        .where('seenBy', '==', false)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              tempArr.push(change.doc.data());
              const count = tempArr.filter((doc) => !doc.seenBy).length;
              commit('update_qnt_msgs', count);
            }
            if (change.type === 'modified') {
              const index = tempArr.findIndex(
                (doc) => doc.id == change.doc.data().id
              );
              if (index != -1) {
                tempArr[index] = change.doc.data();
              }
              const count = tempArr.filter((doc) => !doc.seenBy).length;
              commit('update_qnt_msgs', count);
            }
            if (change.type === 'removed') {
              const index = tempArr.findIndex(
                (doc) => doc.id == change.doc.data().id
              );
              if (index != -1) {
                tempArr.splice(index, 1);
              }
              const count = tempArr.filter((doc) => !doc.seenBy).length;
              commit('update_qnt_msgs', count);
            }
          });
        });
    },
    stop_snaps({ commit }) {
      if (unsub) {
        commit('update_qnt_msgs', 0);
        unsub();
      }
    },
  },
  getters: {
    getUserProfile(state) {
      return state.user;
    },
    get_qnt_msgs(state) {
      return state.qnt_msgs;
    },
  },
});
