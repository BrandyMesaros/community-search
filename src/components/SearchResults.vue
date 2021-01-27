<template>
  <div id="results">
    <b-container fluid>
      <b-row>
        <b-col v-if="visible == true" class="col-sm-7"> </b-col>

        <b-col v-if="visible == false" class="col-sm-12">
          {{ visible }}

          <b-button v-b-toggle.info>Toggle Sidebar</b-button>
          <b-tabs v-model="tabIndex" content-class="mt-3" justified>
            <!--Community Results-->
            <b-tab title="Community Results">
              <b-row>
                <div class="col-md-7">
                  <h4>Community Results</h4>
                </div>

                <div v-if="communitiesTotalCount > 50" class="col-md-5">
                  <!--Paging-->
                  <b-pagination
                    v-model="communitiesCurrentPage"
                    :total-rows="communitiesTotalCount"
                    :per-page="50"
                    align="right"
                    last-number
                    first-number
                  ></b-pagination>
                </div>
              </b-row>

              <p class="font-weight-light font-italic text-right">
                {{ communitiesTotalCount }} results
              </p>

              <b-list-group v-if="communities != null" id="communityList">
                <b-list-group-item
                  v-for="(com, c) in communities"
                  @click="openInfo(com)"
                  :key="com.CommunityID + 'COM' + c"
                  href="#"
                  class="flex-column align-items-start"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">
                      {{ com.CommunityName }}
                    </h5>

                    {{ com.CommunityStatus }}
                  </div>

                  <div class="meta-data">
                    <b class="text-muted"
                      >{{ com.CommunityCity }}, {{ com.CommunityState }} |
                      {{ com.CommunityBrandName }}
                      <span
                        v-if="
                          com != undefined && com.CommunityType != undefined
                        "
                      >
                        | {{ com.CommunityType }}
                      </span>
                    </b>
                  </div>

                  <div v-html="com.CommunityDescription"></div>
                </b-list-group-item>
              </b-list-group>
            </b-tab>

            <!--Home Design Result List-->
            <b-tab title="Home Design Results">
              <b-row>
                <div class="col-md-7">
                  <h4>Home Design Results</h4>
                </div>

                <div v-if="hdTotalCount > 50" class="col-md-5">
                  <!--Paging-->
                  <b-pagination
                    v-model="hdCurrentPage"
                    :total-rows="hdTotalCount"
                    :per-page="50"
                    align="right"
                    last-number
                    first-number
                  ></b-pagination>
                </div>
              </b-row>

              <p class="font-weight-light font-italic text-right">
                {{ hdTotalCount }} results
              </p>

              <b-list-group v-if="homes != null" id="homesList">
                <div v-for="(com, i) in communities" :key="com.CommunityID + i">
                  <b-list-group-item
                    v-for="(home, h) in com.HomeDesigns"
                    @click="openModal(home)"
                    :key="home.HomeDesignNumber + h"
                    href="#"
                    class="flex-column align-items-start"
                  >
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">
                        {{ home.HomeDesignName }} - {{ com.CommunityName }}
                      </h5>
                    </div>

                    <div class="meta-data">
                      <b class="text-muted">{{ home.HomeDesignType }}</b> |
                      <b class="text-muted">{{ home.Bedrooms }} Bedrooms</b> |
                      <b class="text-muted">{{ home.Bathrooms }} Bathrooms</b> |
                      <b class="text-muted">{{ home.Sqft }} Sqft</b> |
                      <b class="text-muted">{{ home.Price | toCurrency }}</b>
                    </div>

                    <div v-html="home.Description"></div>
                  </b-list-group-item>
                </div>
              </b-list-group>
            </b-tab>

            <!--QMI Result List-->
            <b-tab title="QMI Results">
              <b-row>
                <div class="col-md-7">
                  <h4>QMI Results</h4>
                </div>

                <div v-if="qmiTotalCount > 50" class="col-md-5">
                  <!--Paging-->
                  <b-pagination
                    v-model="qmiCurrentPage"
                    :total-rows="qmiTotalCount"
                    :per-page="50"
                    align="right"
                    last-number
                    first-number
                  ></b-pagination>
                </div>
              </b-row>

              <p class="font-weight-light font-italic text-right">
                {{ qmiTotalCount }} results
              </p>

              <b-list-group v-if="QMIs != null" id="QMIList">
                <div
                  v-for="(home, h) in communities"
                  :key="home.CommunityID + 'QMI' + h"
                >
                  <div
                    v-for="(hd, i) in home.HomeDesigns"
                    :key="hd.HomeDesignNumber + 'QMI' + i"
                  >
                    <b-list-group-item
                      v-for="(QMI, qmi) in hd.QMIs"
                      @click="openModal(home)"
                      :key="QMI.QmiID + qmi"
                      href="#"
                      class="flex-column align-items-start"
                    >
                      <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">
                          {{ hd.HomeDesignName }} - {{ QMI.QmiAddress }} -
                          {{ home.CommunityName }}
                        </h5>
                      </div>

                      <div class="meta-data">
                        <b class="text-muted">{{ hd.HomeDesignType }}</b> |
                        <b class="text-muted">{{ hd.Bedrooms }} Bedrooms</b> |
                        <b class="text-muted">{{ hd.Bathrooms }} Bathrooms</b> |
                        <b class="text-muted">{{ hd.Sqft }} Sqft</b> |
                        <b class="text-muted">{{ hd.Price | toCurrency }}</b>
                      </div>

                      <div v-html="QMI.QmiDescription"></div>
                    </b-list-group-item>
                  </div>
                </div>
              </b-list-group>
            </b-tab>
          </b-tabs>
        </b-col>

        <b-col class="col-sm-5">
          {{ this.infoData }}
          <b-sidebar
            id="info"
            v-model="visible"
            v-if="infoData != null"
            right
            shadow
            class="my-sidebar"
          >
            <div class="px-3 py-2">
              <h4>{{ infoData.CommunityName }}</h4>
              <h5>{{infoData.CommunityPlace}}</h5>
              
              
              
              <div class="accordion" role="tablist">
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-2 variant="info"
                      >Home Designs</b-button
                    >
                  </b-card-header>
                  <b-collapse
                    id="accordion-2"
                    accordion="my-accordion"
                    role="tabpanel"
                  >
                    <b-card-body>
                      <ul>
                        <li
                          v-for="h in infoData.HomeDesigns"
                          :key="h.HomeDesignNumber"
                        >
                          {{ h.HomeDesignName }}
                        </li>
                      </ul>
                    </b-card-body>
                  </b-collapse>
                </b-card>

                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-3 variant="info"
                      >QMI</b-button
                    >
                  </b-card-header>
                  <b-collapse
                    id="accordion-3"
                    accordion="my-accordion"
                    role="tabpanel"
                  >
                    <b-card-body>
                      <b-card-text>{{ text }}</b-card-text>
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
            </div>
          </b-sidebar>
        </b-col>
      </b-row>
    </b-container>
  </div>
  <!-- <p v-if="homes.length == 0">No results found</p>
  </div> -->
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
  name: "SearchResults",
  props: ["filterQuery", "searchQuery"],
  data() {
    return {
      communities: [],
      homes: [],
      QMIs: [],
      eCommunities: [],
      eHomes: [],
      eQMIs: [],
      searchFilter: "",
      modalData: null,
      perPage: 50,
      communitiesCurrentPage: 1,
      hdCurrentPage: 1,
      qmiCurrentPage: 1,
      communitiesTotalCount: 0,
      hdTotalCount: 0,
      qmiTotalCount: 0,
      currentSearch: "",
      currentSearchFields: "",
      currentFilter: "",
      modalShow: false,
      tabIndex: 0,
      baseURL: window.location.origin,
      visible: false,
      infoData: null,
    };
  },
  mounted: function () {
    var path = this.$route.path;

    if (path != "") {
      var search = path.replace("/", "");
      var searchFields = "CommunityID";

      this.currentSearch = search;
      this.currentSearchFields = searchFields;

      this.GetHomes(this.currentSearch, this.currentSearchFields, "", "", 0);
    }
  },
  watch: {
    filterQuery: {
      handler(val) {
        this.communities = [];
        this.homes = [];
        this.QMIs = [];

        //Start creating search/filters
        var search = [];
        var searchFields = [];
        var filter = "";

        //search
        // if (this.filterQuery.communityID != "") {
        //   search.push(this.filterQuery.communityID);
        //   searchFields.push("CommunityID");
        // }

        //Location
        if (this.filterQuery.location != "") {
          search.push(this.filterQuery.location);
          searchFields.push("CommunityPlace");
        }

        if (this.filterQuery.radius != 0) {
          //DO LOCATION STUFF
        }

        //Brand Name
        if (
          this.filterQuery.brand.length != null &&
          this.filterQuery.brand.length > 0
        ) {
          for (var b = 0; b < this.filterQuery.brand.length; b++) {
            search.push(this.filterQuery.brand[b]);
          }
          searchFields.push("CommunityBrandName");
        }

        //Home Type
        if (
          this.filterQuery.homeType.length != null &&
          this.filterQuery.homeType.length > 0
        ) {
          for (var ii = 0; ii < this.filterQuery.homeType.length; ii++) {
            search.push(this.filterQuery.homeType[ii]);
          }
          searchFields.push("HomeDesigns/HomeDesignType");
        }

        //Ammenities
        if (
          this.filterQuery.amenities.length != null &&
          this.filterQuery.amenities.length > 0
        ) {
          for (var i = 0; i < this.filterQuery.amenities.length; i++) {
            search.push(this.filterQuery.amenities[i]);
          }

          searchFields.push("HomeDesigns/Amenities");
        }

        //-------------FILTERING------------------

        //QMI
        if (this.filterQuery.QMIstatus == "yes_QMI") {
          if (filter != "") {
            filter += " and HasQMI eq true";
          } else {
            filter += "HasQMI eq true";
          }
        }

        //Bedrooms
        if (this.filterQuery.bedrooms != "All") {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Bedrooms ge " +
              this.filterQuery.bedrooms +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Bedrooms ge " +
              this.filterQuery.bedrooms +
              ")";
          }
        }

        //Bathrooms
        if (this.filterQuery.bathrooms != "All") {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Bathrooms ge " +
              this.filterQuery.bathrooms +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Bathrooms ge " +
              this.filterQuery.bathrooms +
              ")";
          }
        }

        //Garages
        if (this.filterQuery.garages != "All") {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Garages ge " +
              this.filterQuery.garages +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Garages ge " +
              this.filterQuery.garages +
              ")";
          }
        }

        //Stories
        if (this.filterQuery.stories != "All") {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Stories ge " +
              this.filterQuery.stories +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Stories ge " +
              this.filterQuery.stories +
              ")";
          }
        }

        //Price
        if (
          this.filterQuery.minPrice != "" &&
          this.filterQuery.maxPrice != ""
        ) {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Price ge " +
              this.filterQuery.minPrice +
              " and h/Price le " +
              this.filterQuery.maxPrice +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Price ge " +
              this.filterQuery.minPrice +
              " and h/Price le " +
              this.filterQuery.maxPrice +
              ")";
          }
        }

        if (
          this.filterQuery.minPrice == "" &&
          this.filterQuery.maxPrice != ""
        ) {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Price le " +
              this.filterQuery.maxPrice +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Price le " +
              this.filterQuery.maxPrice +
              ")";
          }
        }

        if (
          this.filterQuery.minPrice != "" &&
          this.filterQuery.maxPrice == ""
        ) {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Price ge " +
              this.filterQuery.minPrice +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Price ge " +
              this.filterQuery.minPrice +
              ")";
          }
        }

        //Sq. Footage
        if (
          this.filterQuery.minSqFootage != "" &&
          this.filterQuery.maxSqFootage != ""
        ) {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Sqft ge " +
              this.filterQuery.minSqFootage +
              " and h/Price le " +
              this.filterQuery.maxSqFootage +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Sqft ge " +
              this.filterQuery.minSqFootage +
              " and h/Price le " +
              this.filterQuery.maxSqFootage +
              ")";
          }
        }

        if (
          this.filterQuery.minSqFootage == "" &&
          this.filterQuery.maxSqFootage != ""
        ) {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Sqft le " +
              this.filterQuery.maxSqFootage +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Sqft le " +
              this.filterQuery.maxSqFootage +
              ")";
          }
        }

        if (
          this.filterQuery.minSqFootage != "" &&
          this.filterQuery.maxSqFootage == ""
        ) {
          if (filter != "") {
            filter +=
              " and HomeDesigns/any (h: h/Sqft ge " +
              this.filterQuery.minSqFootage +
              ")";
          } else {
            filter +=
              "HomeDesigns/any (h: h/Sqft ge " +
              this.filterQuery.minSqFootage +
              ")";
          }
        }

        //Move In Date

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
        this.currentFilter = filter;

        console.log(search);
        // console.log(this.currentSearch);
        // console.log(this.currentSearchFields);
        // console.log(this.currentFilter);

        this.communitiesCurrentPage = 1;
        this.hdCurrentPage = 1;
        this.qmiCurrentPage = 1;
        this.GetHomes(
          this.currentSearch,
          this.currentSearchFields,
          filter,
          "",
          0
        );
      },
      deep: true,
    },
    searchQuery: {
      handler(val) {
        this.communities = [];
        this.homes = [];
        this.QMIs = [];
        this.GetHomes(this.searchQuery, "", "", "", 0);
      },
      deep: true,
    },
    communitiesCurrentPage: {
      handler(val) {
        var skip = 50 * (this.communitiesCurrentPage - 1);
        this.GetHomes(
          this.currentSearch,
          this.currentSearchFields,
          this.currentFilter,
          "",
          skip
        );
      },
    },
    HdCurrentPage: {
      handler(val) {
        var skip = 50 * (this.communitiesCurrentPage - 1);
        this.GetHomes(
          this.currentSearch,
          this.currentSearchFields,
          this.currentFilter,
          "",
          skip
        );
      },
    },
    QmiCurrentPage: {
      handler(val) {
        var skip = 50 * (this.communitiesCurrentPage - 1);
        this.GetHomes(
          this.currentSearch,
          this.currentSearchFields,
          this.currentFilter,
          "",
          skip
        );
      },
    },
  },
  methods: {
    GetHomes(search, searchFields, filters, orderBy, skipNum) {
      var body = {
        search: search,
        searchFields: searchFields,
        searchMode: "any",
        filter: filters,
        orderby: orderBy,
        queryType: "full",
        count: "true",
        top: 500,
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
          this.communitiesTotalCount = response.data["@odata.count"];
          this.homes = [];
          this.QMIs = [];

          // console.log("LOOK" + JSON.stringify(response));

          if (response.data.value != "") {
            var val = response.data.value;
            this.communities = val;

            for (var h = 0; h < this.communities.length; h++) {
              if (this.communities[h].HomeDesigns.length > 0) {
                for (
                  var hd = 0;
                  hd < this.communities[h].HomeDesigns.length;
                  hd++
                ) {
                  this.homes.push(this.communities[h].HomeDesigns[hd]);

                  if (this.communities[h].HomeDesigns[hd].HasQMI == true) {
                    for (
                      var q = 0;
                      q < this.communities[h].HomeDesigns[hd].QMIs.length;
                      q++
                    ) {
                      this.QMIs.push(
                        this.communities[h].HomeDesigns[hd].QMIs[q]
                      );
                    }
                  }
                }
              }
            }

            if (this.homes != undefined) {
              this.hdTotalCount = this.homes.length;
            }
            if (this.QMIs != undefined) {
              this.qmiTotalCount = this.QMIs.length;
            }

            // console.log(this.homes.length);
            // console.log(this.QMIs.length);
            // console.log(this.communities.length);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openModal(data) {
      this.modalData = data;
      this.modalShow = !this.modalShow;
    },
    openInfo(data) {
      this.infoData = data;
      this.visible = !this.visible;

      console.log("HERE" + JSON.stringify(this.infoData));
    },
  },
};
</script>