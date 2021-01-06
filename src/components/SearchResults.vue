<template>
  <div>
    <hr />
    <b-row>
      <div class="col-md-7">
        <h4>Home Designs</h4>
      </div>

      <div v-if="totalCount > 50" class="col-md-5">
        <!--Paging-->
        <b-pagination
          v-model="currentPage"
          :total-rows="totalCount"
          :per-page="50"
          align="right"
          last-number
          first-number
        ></b-pagination>
      </div>
    </b-row>

    <p class="font-weight-light font-italic text-right">
      {{ totalCount }} results
    </p>

    <!--Modal-->
    <b-modal
      v-if="modalData"
      v-model="modalShow"
      id="details"
      size="xl"
      :title="modalData.CommunityName + ' ' + modalData.HomeDesignName"
    >
      <b-container>
        <div>
          <b-tabs content-class="mt-3">
            <b-tab class="Overview" title="Overview" active>
              <!--Top Overview-->
              <h5>Overview</h5>
              <b-row class="col-sm-12">
                <div class="info">
                  <!--First Row-->
                  <b-row>
                    <b-col>
                      <b-icon icon="tag-fill" variant="success"></b-icon>
                      {{ modalData.Price | toCurrency }}
                    </b-col>

                    <b-col>
                      <b-icon icon="moon" variant="warning"></b-icon>
                      {{ modalData.Bedrooms }} Bedroom(s)
                    </b-col>

                    <b-col>
                      <b-icon icon="hammer" style="color: #fb9536"></b-icon>
                      {{ modalData.Garages }} Garage(s)
                    </b-col>

                    <b-col v-if="modalData.IsAvailable == true">
                      <b-icon
                        icon="check-circle-fill"
                        variant="success"
                      ></b-icon>
                      Available
                    </b-col>
                    <b-col v-else>
                      <b-icon icon="x-circle-fill" variant="danger"></b-icon>
                      Not Available
                    </b-col>

                    <b-col> </b-col>
                  </b-row>

                  <!--Second Row -->

                  <b-row>
                    <b-col>
                      <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                      {{ modalData.Sqft }} sqft
                    </b-col>

                    <b-col>
                      <b-icon icon="droplet-fill" variant="primary"></b-icon>
                      {{ modalData.Bathrooms }} Bathroom(s)
                    </b-col>

                    <b-col>
                      <b-icon
                        icon="arrow-up-right-square-fill"
                        style="color: #86bcc2"
                      ></b-icon>
                      {{ modalData.Stories }} Floors(s)
                    </b-col>

                    <b-col>
                      <b-icon
                        icon="house-door-fill"
                        style="color: #fb9536"
                      ></b-icon>
                      {{ modalData.HomeDesignType }}
                    </b-col>

                    <b-col> </b-col>
                  </b-row>
                </div>
              </b-row>

              <br />

              <b-row>
                <b-col  v-if="modalData.ImageURL != null" class="col-sm-3">
                  <div>
                    <b-img
                      :src="modalData.ImageURL"
                      fluid
                      alt="Responsive image"
                    ></b-img>
                  </div>
                </b-col>
                <b-col  v-if="modalData.ImageURL != null" class="col-sm-9">
                  <b class="info"> Home Design Description </b>
                  <p>{{ modalData.Description }}</p>

                  <span>
                    <b class="info">Community: </b>
                    <a :href="'http://localhost:8080/' + modalData.CommunityID"
                      >{{ modalData.CommunityName }}
                    </a>
                  </span>
                </b-col>
                <!-- <b-col else class="col-sm-12">
                   <b class="info"> Home Design Description </b>
                  <p>{{ modalData.Description }}</p>

                  <span>
                    <b class="info">Community: </b>
                    <a :href="'http://localhost:8080/' + modalData.CommunityID"
                      >{{ modalData.CommunityName }}
                    </a>
                  </span>
                </b-col> -->
              </b-row>

              <!-- <b-row>
                <b-col class="col-sm-12">
                  <span>
                    <b class="info">Community: </b>
                    {{ modalData.CommunityName }}
                  </span>
                </b-col>
              </b-row> -->
            </b-tab>

            <b-tab v-if="modalData.HasQMI == true" title="QMI">
              <b-list-group v-if="modalData.HasQMI == true" id="qmiList">
                <h5>Quick Move-In Homes</h5>

                <b-list-group-item
                  v-for="qmi in modalData.QMIs"
                  :key="qmi.QmiID"
                >
                  <p>
                    <b-icon icon="geo-alt-fill" variant="success"></b-icon>
                    {{ qmi.QmiAddress }}
                  </p>

                  <b class="info"> Description </b>
                  <p>{{ qmi.QmiDescription }}</p>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
          </b-tabs>
        </div>
      </b-container>
    </b-modal>

    <!--Result List-->
    <b-list-group v-if="homes != null" id="homeList">
      <b-list-group-item
        v-for="home in homes"
        @click="openModal(home)"
        :key="home.HomeDesignNumber + home.CommunityID"
        href="#"
        class="flex-column align-items-start"
      >
        <!-- <b-img src= {{home.imageURL}} fluid alt="Responsive image"></b-img> -->

        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            {{ home.CommunityName }} {{ home.HomeDesignName }}
          </h5>
          <small class="text-muted">{{ home.Price | toCurrency }}</small>
        </div>
        <small class="text-muted">{{ home.HomeDesignType }}</small> |
        <small class="text-muted">{{ home.Bedrooms }} Bedrooms</small> |
        <small class="text-muted">{{ home.Bathrooms }} Bathrooms</small> |
        <small class="text-muted">{{ home.Sqft }} Sqft</small>

        <div v-html="home.Description"></div>
      </b-list-group-item>
    </b-list-group>

    <p v-if="homes.length == 0">No results found</p>
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
  name: "SearchResults",
  props: ["filterQuery", "searchQuery"],
  data() {
    return {
      homes: [],
      allHomes: [],
      searchFilter: "",
      modalData: null,
      perPage: 100,
      currentPage: 1,
      totalCount: 0,
      currentSearch: "",
      currentSearchFields: "",
      currentFilter: "",
      modalShow: false,
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
        this.homes = [];

        //Start creating search/filters
        var search = [];
        var searchFields = [];
        var filter = "";

        //search
        if (this.filterQuery.communityID != "") {
          search.push(this.filterQuery.communityID);
          searchFields.push("CommunityID");
        }

        if (this.filterQuery.location != "") {
          search.push(this.filterQuery.location);
          searchFields.push("CommunityCity, CommunityState");
        }

        if (this.filterQuery.homeType != "All") {
          search.push(this.filterQuery.homeType);
          searchFields.push("HomeDesignType");
        }

        if (
          this.filterQuery.amenities.length != null &&
          this.filterQuery.amenities.length > 0
        ) {
          for (var i = 0; i < this.filterQuery.amenities.length; i++) {
            search.push(this.filterQuery.amenities[i]);
          }

          searchFields.push("Amenities");
        }

        //filter
        if (this.filterQuery.QMIstatus == "yes_QMI") {
          if (filter != "") {
            filter += " and HasQMI eq true";
          } else {
            filter += "HasQMI eq true";
          }
        }

        if (this.filterQuery.bedrooms != "All") {
          if (filter != "") {
            filter += " and Bedrooms ge " + this.filterQuery.bedrooms;
          } else {
            filter += "Bedrooms ge " + this.filterQuery.bedrooms;
          }
        }

        if (this.filterQuery.bathrooms != "All") {
          if (filter != "") {
            filter += " and Bathrooms ge " + this.filterQuery.bathrooms;
          } else {
            filter += "Bathrooms ge " + this.filterQuery.bathrooms;
          }
        }

        if (this.filterQuery.garages != "All") {
          if (filter != "") {
            filter += " and Garages ge " + this.filterQuery.garages;
          } else {
            filter += "Garages ge " + this.filterQuery.garages;
          }
        }

        if (this.filterQuery.stories != "All") {
          if (filter != "") {
            filter += " and Stories ge " + this.filterQuery.stories;
          } else {
            filter += "Stories ge " + this.filterQuery.stories;
          }
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
        this.currentFilter = filter;

        this.currentPage = 1;
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
        this.homes = [];
        this.GetHomes(this.searchQuery, "", "", "", 0);
      },
      deep: true,
    },
    currentPage: {
      handler(val) {
        var skip = 50 * (this.currentPage - 1);
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
          this.totalCount = response.data["@odata.count"];

          if (response.data.value != "") {
            var val = response.data.value;
            this.homes = val;
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
  },
};
</script>