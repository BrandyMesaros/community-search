<template>
  <div>HELLO</div>
</template>

<script>
import axios from "axios";

export default {
  name: "Community",
  props: ["communityID"],
  data() {
    return {
      modalData: null,
      ID: null,
    };
  },
  created: function () {
    this.ID = this.communityID;
    if (this.ID != null) {
      this.GetCommunityInfo(this.ID);
    }
  },
  watch: {
    communityID: {
      handler(val) {
        this.ID = this.communityID;
        this.GetCommunityInfo(this.ID);
      },
      deep: true,
    },
  },
  methods: {
    GetCommunityInfo(ID, skipNum) {
      var body = {
        search: ID,
        searchFields: "CommunityID,",
        searchMode: "any",
        filter: "",
        orderby: "",
        queryType: "simple",
        count: "true",
        skip: skipNum,
      };

      var headers = {
        "api-key": "9C1C5C83AD4C99EA824FD8742F051ECF",
        "Content-Type": "application/json",
      };
      var searchURL = process.env.VUE_APP_FULL_SEARCHURL;

      axios
        .post(
          "https://ingen-internal-demo.search.windows.net/indexes/khov-feed-data/docs/search?api-version=2020-06-30&search=*",
          body,
          { headers }
        )
        .then((response) => {
          if (response.data.value != "") {
            var val = response.data.value;
            this.modalData = val[0];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>