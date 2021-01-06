<template>
  <div>
    <b-container class="container">
      <h4>Community</h4>
      <br />

      <b-row class="text">
        <b-col class="col-sm-9>">
          <b-form-group>
            <b-form-select
              v-model="filters.communityID"
              :options="allCommunitites"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col class="col-sm-3">
          <b-button id="filterBtn" v-b-toggle.collapse-1 variant="secondary">
            <b-icon-filter></b-icon-filter>
            Filter
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <b-collapse id="collapse-1" class="mt-2">
      <b-card>
        <b-row>
          <b-col class="col-sm-6">
            <h5>Filter Communities</h5>
          </b-col>
          <b-col class="col-sm-6">
            <h5>Filter Home Designs</h5>
          </b-col>
        </b-row>
        <b-row>
          <!--First Column-->
          <b-col class="col-sm-3">
            <!--Location-->
            <b-form-group label="Location" v-slot="{ ariaDescribedby }">
              <b-form-input
                v-model="filters.location"
                placeholder="Location"
                :aria-describedby="ariaDescribedby"
              ></b-form-input>
            </b-form-group>

            <!--Home Type Select-->
            <b-form-group label="Home Type" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                id="homeTypeBtns"
                v-model="filters.homeType"
                :options="homeTypes"
                :aria-describedby="ariaDescribedby"
                name="radios-btn-default"
                buttons
                stacked
              ></b-form-radio-group>
            </b-form-group>

            <!-- Quick Move in Home
            <b-form-group>
              <b-form-checkbox
                id="QMIcheckbox"
                v-model="filters.QMIstatus"
                name="QMICheckbox"
                value="yes_QMI"
                unchecked-value="no_QMI"
              >
                Quick Move in Homes
              </b-form-checkbox>
            </b-form-group> -->
          </b-col>

          <!--Second Column-->
          <b-col class="col-sm-3" style="border-right: solid">
            <!--Amenities-->
            <b-form-group label="Amenities" v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="filters.amenities"
                :options="allAmenities"
                :aria-describedby="ariaDescribedby"
                switches
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
          </b-col>

          <!--ThirdColumn-->
          <b-col class="col-sm-3">
            <!--Bedroom-->
            <b-form-group label="Bedrooms" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                id="BedroomBtns"
                class="roomCount"
                v-model="filters.bedrooms"
                :options="count"
                :aria-describedby="ariaDescribedby"
                name="radios-btn-default"
                buttons
              ></b-form-radio-group>
            </b-form-group>

            <!--Bathroom-->
            <b-form-group label="Bathrooms" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                id="BathroomBtns"
                class="roomCount"
                v-model="filters.bathrooms"
                :options="count"
                :aria-describedby="ariaDescribedby"
                name="radios-btn-default"
                buttons
              ></b-form-radio-group>
            </b-form-group>

            <!--Garages-->
            <b-form-group label="Garages" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                id="GarageBtns"
                class="roomCount"
                v-model="filters.garages"
                :options="count"
                :aria-describedby="ariaDescribedby"
                name="radios-btn-default"
                buttons
              ></b-form-radio-group>
            </b-form-group>

            <!--Stories-->
            <b-form-group label="Stories" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                id="StoriesBtns"
                class="roomCount"
                v-model="filters.stories"
                :options="count"
                :aria-describedby="ariaDescribedby"
                name="radios-btn-default"
                buttons
              ></b-form-radio-group>
            </b-form-group>
          </b-col>

          <!--fourth Column-->
          <b-col class="col-sm-3">
            <!--Quick Move in Home-->
            <b-form-group>
              <b-form-checkbox
                id="QMIcheckbox"
                v-model="filters.QMIstatus"
                name="QMICheckbox"
                value="yes_QMI"
                unchecked-value="no_QMI"
              >
                Quick Move in Homes
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="right">
          <b-button size="lg" v-on:click="clear"> Clear </b-button>
        </b-row>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueRouter from "vue-router";

Vue.use(VueRouter);

var router = new VueRouter({
  mode: "history",
  routes: [],
});

export default {
  router,
  name: "Filters",
  data() {
    return {
      name: "",
      allData: [],
      allAmenities: [],
      allCommunitites: [{ value: "", text: "All Communities" }],
      communityID: "",
      homeTypes: [
        { text: "All", value: "All" },
        { text: "Townhome", value: "Townhome" },
        { text: "Duplex", value: "Duplex" },
        { text: "Condominium", value: "Condominium" },
        { text: "Single Family", value: "SingleFamily" },
      ],
      homeStatuses: [
        { text: "All", value: "All" },
        { text: "Quick Move In", value: "Quick Move In" },
      ],
      count: [
        { text: "All", value: "All" },
        { text: "1+", value: "1" },
        { text: "2+", value: "2" },
        { text: "3+", value: "3" },
      ],
      filters: {
        location: "",
        homeType: "All",
        QMIstatus: "No_QMI",
        bedrooms: "All",
        bathrooms: "All",
        garages: "All",
        stories: "All",
        amenities: [],
        communityID: "",
      },
      currentSearch: "",
      currentSearchFields: "",
    };
  },
  beforeMount() {
    this.GetHomes("", "", "", "", 0);
  },
  mounted: function () {
    var path = this.$route.path;

    if (path != "") {
      this.communityID = path.replace("/", "");
      this.filters.communityID = this.communityID;
    }
  },
  watch: {
    filters: {
      handler(val) {
        this.$emit("filters", this.filters);
        this.$emit("communityID", this.filters.communityID);
      },
      deep: true,
    },
    "filters.location": function () {
      this.FilterCommunities();
    },
    "filters.homeType": function () {
      this.FilterCommunities();
    },
    "filters.amenities": function () {
      this.FilterCommunities();
    },
  },
  methods: {
    clear: function () {
      this.filters.location = "";
      this.filters.homeType = "All";
      this.filters.QMIstatus = "No_QMI";
      this.filters.bedrooms = "All";
      this.filters.bathrooms = "All";
      this.filters.garages = "All";
      this.filters.stories = "All";
      this.filters.amenities = [];
      this.filters.communityID = "";
    },
    GetHomes(search, searchFields, filters, orderBy, skipNum) {
      var body = {
        search: search,
        searchFields: searchFields,
        searchMode: "any",
        filter: "",
        orderby: orderBy,
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
            var temp = this.allData.concat(val);
            this.allData = temp;

            var newNum = skipNum + 50;

            this.GetHomes(search, searchFields, filters, orderBy, newNum);
          } else {
            this.GetAmmenities();

            this.allCommunitites = [{ value: "", text: "All Communities" }];
            this.GetCommunities();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    GetAmmenities() {
      for (var i = 0; i < this.allData.length; i++) {
        if (this.allData[i].Amenities != undefined) {
          var amm = this.allData[i].Amenities;

          if (amm != null && amm != undefined && amm.length > 0) {
            for (var ii = 0; ii < amm.length; ii++) {
              this.allAmenities.push({
                text: amm[ii].replace(/([A-Z])/g, " $1").trim(),
                value: amm[ii],
              });
            }
          }
        }
      }

      //Deduping and putting spaces in between words
      var uniqueAmm = this.Dedupe(this.allAmenities);

      this.allAmenities = uniqueAmm;
    },
    GetCommunities() {
      for (var i = 0; i < this.allData.length; i++) {
        var comID = this.allData[i].CommunityID;
        var comName = this.allData[i].CommunityName;

        this.allCommunitites.push({ text: comName, value: comID });
      }

      //Deduping
      var uniqueComm = this.Dedupe(this.allCommunitites);
      this.allCommunitites = uniqueComm;
    },
    FilterCommunities() {
      //Start creating search/filters
      var search = [];
      var searchFields = [];

      //search
      if (this.filters.location != "") {
        search.push(this.filters.location);
        searchFields.push("CommunityCity, CommunityState");
      }

      if (this.filters.homeType != "All") {
        search.push(this.filters.homeType);
        searchFields.push("HomeDesignType");
      }

      if (
        this.filters.amenities.length != null &&
        this.filters.amenities.length > 0
      ) {
        for (var i = 0; i < this.filters.amenities.length; i++) {
          search.push(this.filters.amenities[i]);
        }

        searchFields.push("Amenities");
      }

      var searchString = "";
      var searchFilterString = "";

      if (search != null) {
        for (var j = 0; j < search.length; j++) {
          searchString += search[j].toString();

          if (j < search.length - 1) {
            searchString += " AND ";
          }
        }
      }

      if (searchFields != null) {
        for (var jj = 0; jj < searchFields.length; jj++) {
          searchFilterString += searchFields[jj].toString();

          if (jj < searchFields.length - 1) {
            searchFilterString += ", ";
          }
        }
      }

      this.currentSearch = searchString;
      this.currentSearchFields = searchFilterString;

      this.allData = [];
      // this.allCommunitites = [{ value: "", text: "All Communities" }];
      this.GetHomes(this.currentSearch, this.currentSearchFields, "", "", 0);
    },
    Dedupe(arr) {
      var unique = [];
      unique = Array.from(new Set(arr.map((s) => s.text))).map((text) => {
        return {
          text: text,
          value: arr.find((s) => s.text === text).value,
        };
      });

      return unique;
    },
  },
};
</script>