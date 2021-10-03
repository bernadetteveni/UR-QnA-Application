import { usersCollection } from "@/firebaseConfig"
import {getDocs,query, where} from 'firebase/firestore'
import { getAuth } from "firebase/auth";

export default {
  namespaced: true, // names will not collide with other modules
  state: {
    TEST: 'from VUEX',
    user: { // User Default Values
        firstName: '',
        avatar: '',
    }
  },
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(todo => todo.done)
    // }
  },
  mutations: { // COMMIT NO LOGIC - ONLY CHANGE STATE
    UPDATE_TEXT(state, val) {
      state.TEST = val
    },
    SET_USER_PROFILE(state, val) {
        state.user = val
      },
  },
  actions: { // DISPATCH LOGIC + ASYNC fucntions (firebase)
    updateText ({ commit }) {
        commit('UPDATE_TEXT', "updated 222222")
      },
      async getUserProfile ({ commit }) {
        var email = '1'
        const auth = getAuth();
        const user = auth.currentUser;
        if (user !== null) {
          email = user.auth.currentUser.email;
        }
        console.log("getting a user profile")
        console.log("Email of a person logged in", email)
        const q = query(usersCollection, where("userEmail", "==", email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          commit('SET_USER_PROFILE', doc.data())
        });
      }
  },
}