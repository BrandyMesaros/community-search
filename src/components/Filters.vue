<template>
  <div>
    <b-card>
      <b-row>
        <b-col>
          <h5>Filter</h5>
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

          <b-form-group label="Radius">
            <b-row>
              <b-col md="9">
                <b-form-input
                  type="range"
                  v-model="filters.radius"
                  placeholder=""
                ></b-form-input>
              </b-col>

              <b-col md="3">
                {{ filters.radius }}
              </b-col>
            </b-row>
          </b-form-group>

          <!--Price-->
          <b-form-group label="Price Range">
            <b-row>
              <b-col md="5">
                <b-form-input
                  v-model="filters.minPrice"
                  placeholder="Min"
                ></b-form-input>
              </b-col>
              <b-col md="2" class="text-center"> — </b-col>
              <b-col md="5">
                <b-form-input
                  v-model="filters.maxPrice"
                  placeholder="Max"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>

          <!--Sq Footage-->
          <b-form-group label="Sq. Footage">
            <b-row>
              <b-col md="5">
                <b-form-input
                  v-model="filters.minSqFootage"
                  placeholder="Min"
                ></b-form-input>
              </b-col>
              <b-col md="2" class="text-center"> — </b-col>
              <b-col md="5">
                <b-form-input
                  v-model="filters.maxSqFootage"
                  placeholder="Max"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>

        <!--Second Column-->
        <b-col class="col-sm-3">
          <!--Brand Select-->
          <b-form-group label="Brand Name" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              v-model="filters.brand"
              :options="brands"
              :aria-describedby="ariaDescribedby"
              name="brandButtons"
              buttons
              stacked
            ></b-form-checkbox-group>
          </b-form-group>

          <!--Move In Date-->
          <b-form-group label="Move In Date">
            <b-form-input
              id="datePicker"
              v-model="filters.moveInDate"
              type="date"
            ></b-form-input>
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
        <b-col class="col-sm-3">
          <!--Community Type Select-->
          <!-- <b-form-group label="Community Type" v-slot="{ ariaDescribedby }">
            <b-form-radio-group
              id="communityTypeBtns"
              v-model="filters.communityType"
              :options="communityType"
              :aria-describedby="ariaDescribedby"
              name="radios-btn-default"
              buttons
            ></b-form-radio-group>
          </b-form-group> -->

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
            <a
              v-for="(ht, index) in filters.homeType"
              :key="ht + index"
              href="#"
              class="badge"
              @click="removeHT(index)"
            >
              {{ ht }}
            </a>
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

            <a
              v-for="(amm, index) in filters.amenities"
              :key="amm + index"
              href="#"
              class="badge"
              @click.self="removeAmm(index)"
            >
              {{ amm }}
            </a>
          </b-form-group>
        </b-col>

        <!--Fourth Column-->
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
      </b-row>

      <hr />

      <b-row>
        <b-col class="col-md-6">
          <b-button
            id="save"
            size="lg"
            v-on:click="SaveFilters"
          >
            Save
          </b-button>

          <b-button id="clear" size="lg" v-on:click="clear"> Clear </b-button>
        </b-col>

        <b-col class="col-md-6 text-right">
          <small v-if="created != undefined">Created: {{ this.created }}</small>
          <br />
          <small v-if="lastUpdated != undefined"
            >Updated: {{ this.lastUpdated }}
          </small>
        </b-col>
      </b-row>
    </b-card>
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
      allData: [],
      allAmenities: [],
      allCommunitites: [{ value: "", text: "All Communities" }],
      communityID: "",
      communityType: [],
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
        { text: "All", value: "All" },
        { text: "1+", value: "1" },
        { text: "2+", value: "2" },
        { text: "3+", value: "3" },
      ],
      filters: {
        location: "",
        radius: "0",
        minPrice: "",
        maxPrice: "",
        bedrooms: "All",
        bathrooms: "All",
        garages: "All",
        stories: "All",
        minSqFootage: "",
        maxSqFootage: "",
        amenities: [],
        QMIStatus: "No_QMI",
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
    };
  },
  beforeMount() {
    this.GetAmmenities();
    this.GetCommunityType();
    this.GetHomeType();
  },
  mounted: function () {
    var path = this.$route.path;

    if (path != "") {
      this.communityID = path.replace("/", "");
      this.filters.communityID = this.communityID;
    }

    console.log(this.$route.query.email);
    if (this.$route.query.id != undefined) {
      this.GetFilters();
    }
    if (this.$route.query.email != undefined) {
      this.GetFilters();
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
      var val;

      switch (method) {
        case "merge":
          axios({
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

        default:
        // code block
      }

      return val;
    },
    async GetAmmenities() {
      var body = {
        facets: ["HomeDesigns/Amenities"],
      };

      var info = await this.SearchAPI(body);
      if (info != null || info != undefined) {
        var val = info["@search.facets"];
        var amm = val["HomeDesigns/Amenities"];

        for (var a in amm) {
          this.allAmenities.push(amm[a].value);
        }
      }
    },
    async GetCommunityType() {
      var body = {
        facets: ["CommunityType"],
      };

      var info = await this.SearchAPI(body);
      if (info != null || info != undefined) {
        var val = info["@search.facets"];
        var com = val["CommunityType"];

        for (var c in com) {
          if (com[c].value != "") {
            this.communityType.push(com[c].value);
          }
        }
      }
    },
    async GetHomeType() {
      var body = {
        facets: ["HomeDesigns/HomeDesignType"],
      };

      var info = await this.SearchAPI(body);
      if (info != null || info != undefined) {
        var val = info["@search.facets"];
        var hd = val["HomeDesigns/HomeDesignType"];

        for (var h in hd) {
          if (hd[h].value != "") {
            this.homeTypes.push(hd[h].value);
          }
        }
      }
    },
    async GetFilters() {
      var method = "getFilters";
      var ID = this.filters.id;
      var EMAIL = this.filters.email;

      var header =
        "&$filter=(ID eq '" +
        ID +
        "') or  (Email eq '" +
        EMAIL +
        "')&$select=*";
      var body = "";

console.log(header);
      var info = await this.TableAPI(method, header, body);

      console.log(info);

      if (info != undefined && info.value.length > 0) {
        var saved = info.value[0];

        this.filters.location = saved.Location;
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
        this.filters.amenities = saved.Amenities.split(",");
        this.filters.brand = saved.Brand.split(",");
        this.filters.moveInDate = saved.MoveInDate;
        this.filters.homeType = saved.HomeType.split(",");
        this.partitionKey = saved.PartitionKey;
        this.lastUpdated = saved.updatedDateTime;
        this.created = saved.createdDateTime;
      }

      console.log(this.lastUpdated);
      console.log(this.created);

      return this.partitionKey;
    },
    async SaveFilters() {
      var created;

      if (this.partitionKey == undefined || this.partitionKey == "") {
        this.partitionKey = this.CreateUUID();
        created = Date(Date.now());
      }

      var PK = this.partitionKey;

      var method = "merge";
      var header = "(PartitionKey='" + PK + "', RowKey='')";
      var body = {
        Location: this.filters.location,
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
        Email: "Test@test.com2",
        communityID: this.filters.communityID,
        createdDateTime: created,
        updatedDateTime: Date(Date.now()),
        PartitionKey: PK,
        RowKey: "",
      };

      var info = await this.TableAPI(method, header, body);
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
    clear() {
      this.filters.location = "";
      this.filters.radius = "0";
      this.filters.minPrice = "0";
      this.filters.maxPrice = "0";
      this.filters.QMIstatus = "No_QMI";
      this.filters.bedrooms = "All";
      this.filters.bathrooms = "All";
      this.filters.garages = "All";
      this.filters.stories = "All";
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