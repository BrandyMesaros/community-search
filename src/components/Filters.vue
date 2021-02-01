<template>
  <div>
    <b-card id="filters">
      <b-row>
        <b-col>
          <h5>Filter</h5>
        </b-col>

        <b-icon
          v-if="visible == true"
          v-b-toggle.collapse-filter
          icon="arrow-up-circle"
          font-scale="2"
        ></b-icon>

        <b-icon
          v-if="visible == false"
          v-b-toggle.collapse-filter
          icon="arrow-down-circle"
          font-scale="2"
        ></b-icon>
      </b-row>

      <b-collapse id="collapse-filter" v-model="visible" class="mt-2">
        <b-row>
          <!--FIRST COLUMN-->
          <b-col class="col-sm-4">
            <!--Location-->

            <b-form-group label="Location">
              <b-input-group class="mb-3">
                <b-form-input
                  list="locationList"
                  v-model="filters.location"
                  size="sm"
                ></b-form-input>

                <b-input-group-append>
                  <b-button
                    size="sm"
                    text="Search"
                    v-on:click="GetCoordinates()"
                    @click="$bvToast.show('DidYouMean')"
                    >Search</b-button
                  >
                </b-input-group-append>
              </b-input-group>

              <datalist id="locationList">
                <option v-for="(data, index) in datalist" :key="data + index">
                  {{ data }}
                </option>
              </datalist>

              <b-toast
                id="DidYouMean"
                title="Suggestions:"
                static
                no-auto-hide
                v-model="toast"
              >
                <div v-if="suggested.length > 0">
                  <small
                    v-for="(s, i) in suggested"
                    :key="s + i"
                    class="notALink"
                    @click="
                      $bvToast.hide('DidYouMean');
                      populateLocation(s);
                    "
                    ><i> {{ s }} <br /></i
                  ></small>
                </div>
                <div v-else>
                  <small> <i> No suggestions </i></small>
                </div>
              </b-toast>
            </b-form-group>

            <b-form-group label="Radius (miles)">
              <b-row>
                <b-col md="8">
                  <b-form-input
                    type="range"
                    v-model="filters.radius"
                    placeholder=""
                  ></b-form-input>
                </b-col>

                <b-col v-if="filters.radius == 0" md="4"> NONE </b-col>
                <b-col v-else md="4">
                  <b-form-input v-model="filters.radius" type="number">
                    {{ filters.radius }}
                  </b-form-input>
                </b-col>
              </b-row>
            </b-form-group>

            <!--Price-->
            <b-form-group label="Price Range">
              <b-form-input
                v-model="filters.minPrice"
                placeholder="Min Price"
                v-currency="{
                  currency: 'USD',
                  locale: 'en',
                  precision: 0,
                }"
                size="sm"
              ></b-form-input>
              <b-form-input
                v-model="filters.maxPrice"
                placeholder="Max Price"
                v-currency="{ currency: 'USD', locale: 'en', precision: 0 }"
                size="sm"
              ></b-form-input>
            </b-form-group>

            <!--Home Types-->
            <b-form-group label="Home Type">
              <b-dropdown
                id="homeTypeDropdown"
                text="Please select..."
                ref="dropdown"
                class="dd"
              >
                <b-dropdown-form>
                  <b-form-group v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                      v-model="filters.homeType"
                      :options="homeTypes"
                      :aria-describedby="ariaDescribedby"
                      stacked
                      switches
                    ></b-form-checkbox-group>
                  </b-form-group>
                </b-dropdown-form>
              </b-dropdown>
              <span
                v-for="(ht, index) in filters.homeType"
                :key="ht + index"
                class="badge notALink"
                @click="removeHT(index)"
              >
                {{ ht }}
              </span>
            </b-form-group>
          </b-col>

          <!--Second Column-->
          <b-col class="col-sm-4">
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
                size="sm"
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
                size="sm"
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
                size="sm"
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
                size="sm"
              ></b-form-radio-group>
            </b-form-group>

            <!--Quick Move in Home-->
            <b-form-group>
              <b-form-checkbox
                id="QMIcheckbox"
                v-model="filters.QMIStatus"
                name="QMICheckbox"
                value="yes_QMI"
                unchecked-value="no_QMI"
              >
                Quick Move in Homes
              </b-form-checkbox>
            </b-form-group>
          </b-col>

          <!--Third Column-->
          <b-col class="col-sm-4">
            <!--Sq Footage-->
            <b-form-group label="Sq. Footage">
              <b-form-input
                type="number"
                v-model="filters.minSqFootage"
                placeholder="Min Sqft"
                size="sm"
              ></b-form-input>
              <b-form-input
                type="number"
                v-model="filters.maxSqFootage"
                placeholder="Max Sqft"
                size="sm"
              ></b-form-input>
            </b-form-group>

            <!--Move In Date-->
            <b-form-group label="Move In Date">
              <b-form-input
                id="datePicker"
                v-model="filters.moveInDate"
                type="date"
                size="sm"
              ></b-form-input>
            </b-form-group>

            <!--Brand Select-->
            <b-form-group label="Brand Name">
              <b-dropdown
                id="brandDropdown"
                text="Please select..."
                ref="dropdown"
                class="dd"
              >
                <b-dropdown-form>
                  <b-form-group v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                      v-model="filters.brand"
                      :options="brands"
                      :aria-describedby="ariaDescribedby"
                      stacked
                      switches
                    ></b-form-checkbox-group>
                  </b-form-group>
                </b-dropdown-form>
              </b-dropdown>

              <span
                v-for="(brand, index) in filters.brand"
                :key="brand + index"
                class="badge notALink"
                @click.self="removeBrand(index)"
              >
                {{ brand }}
              </span>
            </b-form-group>

            <!--Amenities-->
            <b-form-group label="Amenities">
              <b-dropdown
                id="ammenityDropdown"
                text="Please select..."
                ref="dropdown"
                class="dd"
              >
                <b-dropdown-form>
                  <b-form-group v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                      v-model="filters.amenities"
                      :options="allAmenities"
                      :aria-describedby="ariaDescribedby"
                      stacked
                      switches
                    ></b-form-checkbox-group>
                  </b-form-group>
                </b-dropdown-form>
              </b-dropdown>

              <span
                v-for="(amm, index) in filters.amenities"
                :key="amm + index"
                class="badge notALink"
                @click.self="removeAmm(index)"
              >
                {{ amm }}
              </span>
            </b-form-group>
          </b-col>
        </b-row>

        <hr />

        <b-alert
          v-model="alertCountDown"
          dismissible
          variant="success"
          @dismissed="alertCountDown = 0"
          @dismiss-count-down="countDownChanged"
        >
          Save Successful!
        </b-alert>
        <b-row>
          <b-col class="col-md-6">
            <b-button id="save" size="lg" v-on:click="SaveFilters">
              Save
            </b-button>

            <b-button id="clear" size="lg" v-on:click="clear"> Clear </b-button>
          </b-col>

          <b-col class="col-md-6 text-right">
            <small v-if="created != ''">Created: {{ created }}</small>
            <br />
            <small v-if="lastUpdated != ''">Updated: {{ lastUpdated }} </small>
          </b-col>
        </b-row>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueRouter from "vue-router";
import VueCurrencyInput from "vue-currency-input";
import MD5 from "md5";

Vue.use(VueRouter);
Vue.use(VueCurrencyInput);
Vue.use(MD5);

var router = new VueRouter({
  mode: "history",
  routes: [],
});

var headers = {
  "api-key": process.env.VUE_APP_APIKEY,
  "Content-Type": "application/json",
};

var tableHeaders = {
  Date: Date.now(),
  "Content-Type": "application/json",
  Accept: "application/json;odata=nometadata",
};

var SAS = process.env.VUE_APP_TABLE_SAS;

export default {
  router,
  name: "Filters",
  data() {
    return {
      name: "",
      alertCountDown: 0,
      allData: [],
      allAmenities: [],
      allCommunitites: [{ value: "", text: "All Communities" }],
      communityID: "",
      communityType: [],
      visible: true,
      toast: false,
      datalist: [],
      homeTypes: [],
      brands: [
        {
          text: "K Hovnanian's Four Seasons",
          value: "K Hovnanian's Four Seasons",
        },
        {
          text: "K. Hovnanian® Homes - Build on Your Lot",
          value: "K. Hovnanian® Homes - Build on Your Lot",
        },
        { text: "K Hovnanian Homes", value: "K Hovnanian Homes" },
      ],
      count: [
        { text: "Any", value: "Any" },
        { text: "1+", value: "1" },
        { text: "2+", value: "2" },
        { text: "3+", value: "3" },
      ],
      filters: {
        location: null,
        locationLong: "",
        locationLat: "",
        locationCity: "",
        locationState: "",
        locationZip: "",
        radius: "0",
        minPrice: "",
        maxPrice: "",
        bedrooms: "Any",
        bathrooms: "Any",
        garages: "Any",
        stories: "Any",
        minSqFootage: "",
        maxSqFootage: "",
        amenities: [],
        QMIStatus: "no_QMI",
        brand: [],
        moveInDate: "",
        homeType: [],
        id: this.$route.query.id,
        email: this.$route.query.email,
        communityID: "",
      },
      partitionKey: "",
      created: "",
      lastUpdated: "",
      suggested: [],
      oldLocation: "",
    };
  },
  beforeMount() {
    this.GetAllFacets();
  },
  mounted: function () {
    var path = this.$route.path;

    if (path != "") {
      this.communityID = path.replace("/", "");
      this.filters.communityID = this.communityID;
    }

    if (this.$route.query.id != undefined) {
      this.GetFilters();
    }
    if (this.$route.query.email != undefined) {
      this.GetFilters();
    }
  },
  watch: {
    filters: {
      async handler(val) {
        if (
          this.filters.location != null &&
          this.filters.location != "" &&
          this.filters.location != this.oldLocation
        ) {
          await this.getLongLat(this.filters.location);
        } else if (this.filters.location == "") {
          this.toast = false;
        }

        this.$emit("filters", this.filters);
        this.$emit("communityID", this.filters.communityID);
      },
      deep: true,
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
    async TableAPI(method, header, body) {
      var val = 0;

      switch (method) {
        case "merge":
          await axios({
            method: "merge",
            url:
              "https://sftpstgmmevl55akvtbc.table.core.windows.net/TEST" +
              header +
              SAS,
            data: body,
            // headers: tableHeaders
          })
            .then((response) => {
              val = response.status;

              return val;
            })
            .catch((error) => {
              console.log(error);
            })
            .catch((error) => {
              console.log(error);
            });

          return val;

        case "getFilters":
          await axios
            .get(
              "https://sftpstgmmevl55akvtbc.table.core.windows.net/TEST()" +
                SAS +
                header,
              body,
              { tableHeaders }
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

        // default:
        // // code block
      }

      return val;
    },
    async GetFilters() {
      var md5 = require("md5");

      var method = "getFilters";
      var ID = this.filters.id;
      var EMAIL = md5(this.filters.email);

      var header =
        "&$filter=(ID eq '" +
        ID +
        "') or  (Email eq '" +
        EMAIL +
        "')&$select=*";
      var body = "";

      var info = await this.TableAPI(method, header, body);

      if (info != null && info.value != null && info.value.length > 0) {
        var saved = info.value[0];

        this.filters.location = saved.Location;
        this.filters.locationLong = saved.LocationLong;
        this.filters.locationLat = saved.LocationLat;
        this.filters.locationCity = saved.LocationCity;
        this.filters.locationState = saved.LocationState;
        this.filters.locationZip = saved.LocationZip;
        this.filters.radius = saved.Radius;
        this.filters.minPrice = saved.MinPrice;
        this.filters.maxPrice = saved.MaxPrice;
        this.filters.QMIStatus = saved.QMI;
        this.filters.bedrooms = saved.Beds;
        this.filters.bathrooms = saved.Baths;
        this.filters.garages = saved.Garages;
        this.filters.stories = saved.Stories;
        this.filters.minSqFootage = saved.MinSqFootage;
        this.filters.maxSqFootage = saved.MaxSqFootage;
        if (saved.Amenities != "") {
          this.filters.amenities = saved.Amenities.split(",");
        }
        if (saved.Brand != "") {
          this.filters.brand = saved.Brand.split(",");
        }
        this.filters.moveInDate = saved.MoveInDate;
        if (saved.HomeType != "") {
          this.filters.homeType = saved.HomeType.split(",");
        }
        this.rowKey = saved.RowKey;
        this.lastUpdated = saved.updatedDateTime;
        this.created = saved.createdDateTime;
      }

      return this.rowKey;
    },
    async GetAllFacets() {
      var body = {
        facets: [
          "HomeDesigns/Amenities, count:50",
          "CommunityType, count:15",
          "HomeDesigns/HomeDesignType, count:15",
          "CommunityPlace, count:200",
        ],
      };

      var info = await this.SearchAPI(body);

      if (info != null || info != undefined) {
        var val = info["@search.facets"];

        //Ammenities
        var amm = val["HomeDesigns/Amenities"];
        for (var a in amm) {
          this.allAmenities.push(amm[a].value);
        }

        //Community Type
        var com = val["CommunityType"];

        for (var c in com) {
          if (com[c].value != "") {
            this.communityType.push(com[c].value);
          }
        }

        //HomeDesign Type
        var hd = val["HomeDesigns/HomeDesignType"];

        for (var h in hd) {
          if (hd[h].value != "") {
            this.homeTypes.push(hd[h].value);
          }
        }

        //DataList
        var places = val["CommunityPlace"];

        for (var n in places) {
          this.datalist.push(places[n].value);
        }
      }
    },
    async SaveFilters() {
      var created;
      var md5 = require("md5");

      if (this.rowKey == undefined || this.rowKey == "") {
        this.rowKey = this.CreateUUID();
        created = Date(Date.now());
      }

      var RK = this.rowKey;

      var method = "merge";
      var header = "(PartitionKey='Search', RowKey='" + RK + "')";
      var body = {
        Location: this.filters.location,
        LocationLong: this.filters.locationLong,
        LocationLat: this.filters.locationLat,
        LocationCity: this.filters.locationCity,
        LocationState: this.filters.locationState,
        LocationZip: this.filters.locationZip,
        Radius: this.filters.radius,
        MinPrice: this.filters.minPrice,
        MaxPrice: this.filters.maxPrice,
        Beds: this.filters.bedrooms,
        Baths: this.filters.bathrooms,
        Garages: this.filters.garages,
        Stories: this.filters.stories,
        MinSqFootage: this.filters.minSqFootage,
        MaxSqFootage: this.filters.maxSqFootage,
        Amenities: this.filters.amenities.join(),
        QMI: this.filters.QMIStatus,
        Brand: this.filters.brand.join(),
        MoveInDate: this.filters.moveInDate,
        HomeType: this.filters.homeType.join(),
        ID: this.filters.id,
        Email: md5(this.filters.email),
        communityID: this.filters.communityID,
        createdDateTime: created,
        updatedDateTime: Date(Date.now()),
        PartitionKey: "Search",
        RowKey: RK,
      };

      var info = await this.TableAPI(method, header, body);
      if (info == 204) {
        this.alertCountDown = 2;
      }
    },
    CreateUUID() {
      var uuidValue = "",
        k,
        randomValue;
      for (k = 0; k < 32; k++) {
        randomValue = (Math.random() * 16) | 0;

        if (k == 8 || k == 12 || k == 16 || k == 20) {
          uuidValue += "-";
        }
        uuidValue += (k == 12
          ? 4
          : k == 16
          ? (randomValue & 3) | 8
          : randomValue
        ).toString(16);
      }

      return uuidValue;
    },
    removeAmm(index) {
      this.filters.amenities.splice(index, 1);
    },
    removeHT(index) {
      this.filters.homeType.splice(index, 1);
    },
    removeBrand(index) {
      this.filters.brand.splice(index, 1);
    },
    populateLocation(value) {
      this.filters.location = value;
    },
    GetCoordinates() {
      this.suggested = [];

      var key = "jHXzLOl_rAm6GnrNK-bnneuN_FO2IYRcTNv8cMEZBtw";
      var url =
        "https://atlas.microsoft.com/search/address/json?subscription-key=" +
        key +
        "&limit=3&api-version=1.0&query=" +
        this.filters.location;

      axios
        .get(url)
        .then((response) => {
          var results = response.data.results;

          for (var i = 0; i < results.length; i++) {
            this.suggested.push(results[i].address.freeformAddress);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getLongLat(newLocation) {
      this.oldLocation = newLocation;

      var key = "jHXzLOl_rAm6GnrNK-bnneuN_FO2IYRcTNv8cMEZBtw";
      var url =
        "https://atlas.microsoft.com/search/address/json?subscription-key=" +
        key +
        "&limit=3&api-version=1.0&query=" +
        newLocation +
        ", USA";

      await axios
        .get(url)
        .then((response) => {
          this.filters.locationLat = "";
          this.filters.locationLong = "";
          this.filters.locationState = "";
          this.filters.locationZip = "";
          this.filters.locationCity = "";

          var results = response.data.results;

          if (results.length > 0) {
            this.filters.locationLat = results[0].position.lat;
            this.filters.locationLong = results[0].position.lon;
            this.filters.locationState = results[0].address.countrySubdivision;

            if (results[0].address.postalCode != null) {
              this.filters.locationZip = results[0].address.postalCode;
            }

            if (results[0].type == "Street") {
              this.filters.locationCity = results[0].address.localName;
            } else {
              if (results[0].address.municipality != null) {
                if (results[0].address.municipality.length > 0) {
                  var split = results[0].address.municipality.split(",");
                  this.filters.locationCity = split[0];
                }
              } else {
                this.filters.locationCity = null;
              }
            }

            if (results[0].entityType == "PostalCodeArea") {
              this.filters.locationCity = null;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    countDownChanged(dismissCountDown) {
      this.alertCountDown = dismissCountDown;
    },
    clear() {
      this.filters.location = "";
      this.filters.locationLong = "";
      this.filters.locationLat = "";
      this.filters.locationCity = "";
      this.filters.locationState = "";
      this.filters.locationZip = "";
      this.filters.radius = "0";
      this.filters.minPrice = "";
      this.filters.maxPrice = "";
      this.filters.QMIstatus = "No_QMI";
      this.filters.bedrooms = "Any";
      this.filters.bathrooms = "Any";
      this.filters.garages = "Any";
      this.filters.stories = "Any";
      this.filters.minSqFootage = "";
      this.filters.maxSqFootage = "";
      this.filters.amenities = [];
      this.filters.brand = [];
      this.filters.moveInDate = "";
      this.filters.homeType = [];

      this.filters.communityID = "";
    },
  },
};
</script>