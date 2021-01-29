<template>
  <div id="results">
    <b-container fluid id="searchResults">

<b-row>
    <b-col id="listOfResults" class="col-sm-12">
      <b-tabs v-model="tabIndex" content-class="mt-3" justified>
        <!--Community Results-->
        <b-tab title="Community Results" lazy>
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

          <p  id="count" class="font-weight-light font-italic text-right">
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
                    v-if="com != undefined && com.CommunityType != undefined"
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
        <b-tab title="Home Design Results" lazy>
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
        <b-tab title="QMI Results" lazy>
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

      <b-col class="col-sm-6">
       <affix class="sidebar-menu" relative-element-selector="#searchResults" >
      <b-sidebar
        id="sidebar-right"
        role="presentation"
        v-model="visible"
        v-if="infoData != null"
        right
        shadow
      >
        <div class="px-3 py-2">
          <h4>{{ infoData.CommunityName }}</h4>
          <div class="meta-data">
            <b class="text-muted"
              >{{ infoData.CommunityCity }}, {{ infoData.CommunityState }} |
              {{ infoData.CommunityBrandName }}
              <span
                v-if="
                  infoData != undefined && infoData.CommunityType != undefined
                "
              >
                | {{ infoData.CommunityType }}
              </span>
            </b>
          </div>
          <br />

          <p><b>Status: {{ infoData.CommunityStatus }} </b></p>

          <p>
            <b>Description</b> <br/>
             {{infoData.CommunityDescription}}
            </p>

             <p v-if="infoData.HomeDesigns[0] != undefined && infoData.HomeDesigns[0].Amenities != undefined">
            <b>Ammenities</b> <br/>
            <ul>
              <li v-for="(a, index) in infoData.HomeDesigns[0].Amenities" :key="a + index"> {{a}} </li>
              </ul>
            </p>

             <p>
            <b>Sales Office</b> <br/>
            <b-icon icon="house-fill"></b-icon> {{infoData.CommunitySalesOfficeAddress}} <br />
              <b-icon icon="telephone-fill"></b-icon> {{infoData.CommunitySalesOfficePhone}}
            </p>

        </div>
      </b-sidebar>
      </affix>
      </b-col>
            </b-row>


    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueRouter from "vue-router";
import Affix from "vue-affix";

Vue.use(VueRouter);
Vue.use(Affix);

var router = new VueRouter({
  mode: "history",
  routes: [],
});

var headers = {
  "api-key": process.env.VUE_APP_APIKEY,
  "Content-Type": "application/json",
};

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
      tabIndex: 0,
      baseURL: window.location.origin,
      visible: false,
      infoData: null,
      suggestions: [],
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
      // async handler(val) {
      //   this.communities = [];
      //   this.homes = [];
      //   this.QMIs = [];

      //   //Start creating search/filters
      //   var search = [];
      //   var searchFields = [];
      //   var filter = "";

      //   //search
      //   // if (this.filterQuery.communityID != "") {
      //   //   search.push(this.filterQuery.communityID);
      //   //   searchFields.push("CommunityID");
      //   // }

      //   //Location
      //   if (this.filterQuery.location != "") {
      //     search.push(this.filterQuery.location);
      //     searchFields.push("CommunityPlace");
      //   }

      //   if (this.filterQuery.radius != 0) {
      //     var long = this.filterQuery.locationLong;
      //     var lat = this.filterQuery.locationLat;
      //     var miles = await this.ConvertToMeters(this.filterQuery.radius);

      //     if (filter != "") {
      //       filter += " and geo.distance(CommunitySalesOfficeLocation, geography'POINT(" + long + " " + lat + ")') le " + miles;
      //     } else {
      //       filter += "geo.distance(CommunitySalesOfficeLocation, geography'POINT(" + long + " " + lat + ")') le " + miles;
      //     }
      //   }

      //   //Brand Name
      //   if (
      //     this.filterQuery.brand.length != null &&
      //     this.filterQuery.brand.length > 0
      //   ) {
      //     for (var b = 0; b < this.filterQuery.brand.length; b++) {
      //       search.push(this.filterQuery.brand[b]);
      //     }
      //     searchFields.push("CommunityBrandName");
      //   }

      //   //Home Type
      //   if (
      //     this.filterQuery.homeType.length != null &&
      //     this.filterQuery.homeType.length > 0
      //   ) {
      //     for (var ii = 0; ii < this.filterQuery.homeType.length; ii++) {
      //       search.push(this.filterQuery.homeType[ii]);
      //     }
      //     searchFields.push("HomeDesigns/HomeDesignType");
      //   }

      //   //Ammenities
      //   if (
      //     this.filterQuery.amenities.length != null &&
      //     this.filterQuery.amenities.length > 0
      //   ) {
      //     for (var i = 0; i < this.filterQuery.amenities.length; i++) {
      //       search.push(this.filterQuery.amenities[i]);
      //     }

      //     searchFields.push("HomeDesigns/Amenities");
      //   }

      //   //-------------FILTERING------------------

      //   //QMI
      //   if (this.filterQuery.QMIstatus == "yes_QMI") {
      //     if (filter != "") {
      //       filter += " and HasQMI eq true";
      //     } else {
      //       filter += "HasQMI eq true";
      //     }
      //   }

      //   //Bedrooms
      //   if (this.filterQuery.bedrooms != "All") {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Bedrooms ge " +
      //         this.filterQuery.bedrooms +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Bedrooms ge " +
      //         this.filterQuery.bedrooms +
      //         ")";
      //     }
      //   }

      //   //Bathrooms
      //   if (this.filterQuery.bathrooms != "All") {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Bathrooms ge " +
      //         this.filterQuery.bathrooms +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Bathrooms ge " +
      //         this.filterQuery.bathrooms +
      //         ")";
      //     }
      //   }

      //   //Garages
      //   if (this.filterQuery.garages != "All") {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Garages ge " +
      //         this.filterQuery.garages +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Garages ge " +
      //         this.filterQuery.garages +
      //         ")";
      //     }
      //   }

      //   //Stories
      //   if (this.filterQuery.stories != "All") {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Stories ge " +
      //         this.filterQuery.stories +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Stories ge " +
      //         this.filterQuery.stories +
      //         ")";
      //     }
      //   }

      //   //Price
      //   if (
      //     this.filterQuery.minPrice != "" &&
      //     this.filterQuery.maxPrice != ""
      //   ) {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Price ge " +
      //         this.filterQuery.minPrice +
      //         " and h/Price le " +
      //         this.filterQuery.maxPrice +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Price ge " +
      //         this.filterQuery.minPrice +
      //         " and h/Price le " +
      //         this.filterQuery.maxPrice +
      //         ")";
      //     }
      //   }

      //   if (
      //     this.filterQuery.minPrice == "" &&
      //     this.filterQuery.maxPrice != ""
      //   ) {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Price le " +
      //         this.filterQuery.maxPrice +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Price le " +
      //         this.filterQuery.maxPrice +
      //         ")";
      //     }
      //   }

      //   if (
      //     this.filterQuery.minPrice != "" &&
      //     this.filterQuery.maxPrice == ""
      //   ) {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Price ge " +
      //         this.filterQuery.minPrice +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Price ge " +
      //         this.filterQuery.minPrice +
      //         ")";
      //     }
      //   }

      //   //Sq. Footage
      //   if (
      //     this.filterQuery.minSqFootage != "" &&
      //     this.filterQuery.maxSqFootage != ""
      //   ) {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Sqft ge " +
      //         this.filterQuery.minSqFootage +
      //         " and h/Price le " +
      //         this.filterQuery.maxSqFootage +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Sqft ge " +
      //         this.filterQuery.minSqFootage +
      //         " and h/Price le " +
      //         this.filterQuery.maxSqFootage +
      //         ")";
      //     }
      //   }

      //   if (
      //     this.filterQuery.minSqFootage == "" &&
      //     this.filterQuery.maxSqFootage != ""
      //   ) {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Sqft le " +
      //         this.filterQuery.maxSqFootage +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Sqft le " +
      //         this.filterQuery.maxSqFootage +
      //         ")";
      //     }
      //   }

      //   if (
      //     this.filterQuery.minSqFootage != "" &&
      //     this.filterQuery.maxSqFootage == ""
      //   ) {
      //     if (filter != "") {
      //       filter +=
      //         " and HomeDesigns/any (h: h/Sqft ge " +
      //         this.filterQuery.minSqFootage +
      //         ")";
      //     } else {
      //       filter +=
      //         "HomeDesigns/any (h: h/Sqft ge " +
      //         this.filterQuery.minSqFootage +
      //         ")";
      //     }
      //   }

      //   //Move In Date

      //   var searchString = "";
      //   var searchFilterString = "";

      //   if (search != null) {
      //     for (var j = 0; j < search.length; j++) {
      //       searchString += search[j].toString();

      //       if (j < search.length - 1) {
      //         searchString += " AND ";
      //       }
      //     }
      //   }

      //   if (searchFields != null) {
      //     for (var jj = 0; jj < searchFields.length; jj++) {
      //       searchFilterString += searchFields[jj].toString();

      //       if (jj < searchFields.length - 1) {
      //         searchFilterString += ", ";
      //       }
      //     }
      //   }

      //   this.currentSearch = searchString;
      //   this.currentSearchFields = searchFilterString;
      //   this.currentFilter = filter;

      //   // console.log(search);
      //   console.log("search: " + this.currentSearch);
      //   console.log("fields: " +this.currentSearchFields);
      //   console.log("filter: " +this.currentFilter);

      //   this.communitiesCurrentPage = 1;
      //   this.hdCurrentPage = 1;
      //   this.qmiCurrentPage = 1;
      //   this.GetHomes(
      //     this.currentSearch,
      //     this.currentSearchFields,
      //     filter,
      //     "",
      //     0
      //   );
      // },
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
    visible: {
      handler(val) {
        var element = document.getElementById("listOfResults");

        if (this.visible == true) {
          element.classList.remove("col-sm-12");
          element.classList.add("col-sm-6");
        } else {
          element.classList.remove("col-sm-6");
          element.classList.add("col-sm-12");
        }
      },
    },
  },
  methods: {
    async SearchAPI(body) {
      var val;

      await axios
        .post(
          "https://ingen-internal-demo.search.windows.net/indexes/khov-feed-data/docs/search?api-version=2020-06-30&search=*",
          body,
          { headers }
        )
        .then((response) => {
          if (response.data.value != "") {
            val = response.data;
            return val;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      return val;
    },
    async GetHomes(search, searchFields, filters, orderBy, skipNum) {
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

      var response = await this.SearchAPI(body);

      if(response != undefined){

          this.communitiesTotalCount = response["@odata.count"];
          this.homes = [];
          this.QMIs = [];

          // console.log("LOOK" + JSON.stringify(response));

          if (response.value != "") {
            var val = response.value;
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
      }
    },
    async ConvertToMeters(miles){
      var mi = 1609;
      var meters = miles * mi;

      return meters;
    },
    openInfo(data) {
      this.infoData = data;
      this.visible = !this.visible;
    },
  },
};
</script>