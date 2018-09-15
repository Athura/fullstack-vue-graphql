<template>
  <v-container text-xs-center v-if="getPosts">
    <v-flex xs12>
      <v-carousel v-bind="{'cycle': true }" interval="3000">
        <v-carousel-item v-for="post in getPosts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
    <!-- <div v-if="$apollo.loading">Loading...</div>
    <ul v-else v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}}
        {{post.imageUrl}}
        {{post.description}}
      </li>
      <li>{{post.likes}}</li>
    </ul> -->
    <!-- <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: { loading, error, data, networkStatus }}">
        <div v-if="loading">Loading</div>
        <div v-else-if="error">Error! {{error.message}}</div>
        <div v-else-if="!loading">Network Status: {{networkStatus}}</div> 
        <ul v-else v-for="post in data.getPosts" :key="post._id">
          <li>
            {{post.title}}
            {{post.imageUrl}}
            {{post.likes}}
          </li>
        </ul>
      </template>
    </ApolloQuery> -->
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";

export default {
  name: "home",
  // data() {
  //   return {
  //   //   getPostsQuery: gql`
  //   //     query {
  //   //       getPosts {
  //   //         _id
  //   //         title
  //   //         imageUrl
  //   //         description
  //   //         likes
  //   //       }
  //   //     }
  //   //   `
  //   // };
  // }
  apollo: {
    getPosts: {
  query: gql`
    query {
      getPosts {
        _id
        title
        imageUrl
        description
        likes
      }
    }
  `,
      result({ data, loading, networkStatus }) {
        if(!loading) {
          this.posts = data.getPosts;
          console.log('[networkStatus]', networkStatus);
        }
      },
      error(err) {
        console.log('[Error!!!]', err);
        console.dir(err);
      }
    }
  }
};
</script>

<style>
  #carousel__title {
    position: absolute;
    background-color: rgba(0,0,0,0.5);
    color: white;
    border-radius: 5px 5px 0 0;
    padding: 0.5em;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0;
  }
</style>
