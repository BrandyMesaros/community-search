
<template>
  <div id="app" v-cloak>
    <div id="Header">
      <Header @search="quickSearch" />
    </div>

    <div id="filterHomes">
      <div id="filterDiv">
        <Filters @filters="updateFilter" @communityID="updateCommunityID" />
      </div>

        <SearchResults
          :filterQuery="filterQuery"
          :searchQuery="searchQuery"
          @communityInfo="communityData"
        />
        <br /><br />
      
    </div>

  </div>
</template>

<script>
import "@babel/polyfill"
import Vue from "vue";
import VueRouter from "vue-router";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Filters from "@/components/Filters.vue";
import SearchResults from "@/components/SearchResults.vue";
import Header from "@/components/Header.vue";


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);



export default {
  name: "App",
  components: {
    Filters,
    SearchResults,
    Header,
  
  },
  data: function () {
    return {
      filterQuery: null,
      searchQuery: "",
      communityInfo: null,
      communityID: null,
    };
  },
  methods: {
    updateFilter(variable) {
      this.filterQuery = variable;
    },
    quickSearch(variable) {
      this.searchQuery = variable;
    },
    communityData(variable) {
      this.communityInfo = variable;
    },
     updateCommunityID(variable) {
      this.communityID = variable;
    },
  },
};
</script>

  

