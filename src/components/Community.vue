<template>
  <div v-if="modalData != null && ID != ''">
    <b-row class="col-sm-12">
      <h5>About Community {{ modalData.CommunityName }}</h5>
      <br />
    </b-row>

    <b-row>
      <b-col class="col-sm-9">
        <b class="info"> Community Description </b>
        <p>{{ modalData.CommunityDescription }}</p>

        <b class="info"> Sales Office </b>
        <p>
          <b-icon icon="telephone-fill"></b-icon>
          {{ modalData.CommunitySalesOfficePhone }} <br />
          <b-icon icon="geo-alt-fill"></b-icon>
          {{ modalData.CommunitySalesOfficeAddress }}
        </p>
      </b-col>
      <b-col class="col-sm-3">
        <b class="info"> Status </b>
        <p>
          {{ modalData.CommunityStatus }}
        </p>

        <b class="info"> Location </b>
        <p>
          <span v-if="modalData.CommunityAddress != null">
            {{ modalData.CommunityAddress.Street }}
            {{ modalData.CommunityAddress.City }}
            {{ modalData.CommunityAddress.State.toUpperCase() }}
            {{ modalData.CommunityAddress.Zip }}
          </span>
          <span v-else>
            {{ modalData.CommunityCity }},
            {{ modalData.CommunityState.toUpperCase() }}
          </span>
        </p>

        <div v-if="modalData.Amenities.length > 0">
          <b class="info"> Amenities </b>
          <ul>
            <li v-for="amm in modalData.Amenities" :key="amm">
              {{ amm }}
            </li>
          </ul>
        </div>
      </b-col>
    </b-row>
  </div>
  <div v-else>
      </div>
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
        queryType: "full",
        count: "true",
        skip: skipNum,
      };

      var headers = {
        "api-key": "9C1C5C83AD4C99EA824FD8742F051ECF",
        "Content-Type": "application/json",
      };

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