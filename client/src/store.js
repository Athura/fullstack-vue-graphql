import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import {
  defaultClient as apolloClient
} from "./main";
import {
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
  },
  actions: {
    getCurrentUser: ({
      commit
    }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({
          data
        }) => {
          commit("setLoading", false);
          // Add user data to state
          commit("setUser", data.getCurrentUser);
          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getPosts: ({
      commit
    }) => {
      commit("setLoading", true);
      // Use apollo client to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({
          data
        }) => {
          // Get data from actions to state via mutations
          // commit allows us to pass data from action to mutation function
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.log(err);
        });
    },
    addPost: ({
      commit
    }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, {
            data: {
              addPost
            }
          }) => {
            // First read the query you want to update
            const data = cache.readQueryFromStore({
              query: GET_POSTS
            });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          }
        })
        .then(({
          data
        }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.log(err);
        })
    },
    signinUser: ({
      commit
    }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({
          data
        }) => {
          commit('setLoading', false);
          console.log(data.signinUser);
          localStorage.setItem("token", data.signinUser.token);
          // To make sure created method is run in main.js (we run getCurrentUser ), reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({
      commit
    }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      // clear token to prevent errors (if malformed)
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({
          data
        }) => {
          commit('setLoading', false);
          localStorage.setItem("token", data.signupUser.token);
          // To make sure created method is run in main.js (we run getCurrentUser ), reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({
      commit
    }) => {
      // clear the user in state
      commit("clearUser");
      // remove token in local storage
      localStorage.setItem("token", "");
      // end session
      await apolloClient.resetStore();
      // redirect home - kick useres out of private pages (i.e. profile)
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});