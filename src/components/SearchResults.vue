<template>
  <div id="results">
    <b-container fluid id="searchResults">

<b-row>
    <b-col id="listOfResults" class="col-sm-12">
      <b-tabs v-model="tabIndex" content-class="mt-3" justified>
        <!--Community Results-->
        <b-tab title="Community" lazy>
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
              @click="openInfo(com, null, null)"
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
        <b-tab title="Home Design" lazy>
          <b-row>
            <div class="col-sm-7">
              <h4>Home Design Results</h4>
            </div>

            <div v-if="hdTotalCount > 50" class="col-lg-5">
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
              @click="openInfo(com, home, null)"
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
        <b-tab title="QMI" lazy>
          <b-row>
            <div class="col-sm-7">
              <h4>QMI Results</h4>
            </div>

            <div v-if="qmiTotalCount > 50" class="col-lg-5">
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
                   @click="openInfo(home, hd, QMI)"
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

      <!----------------------------SIDEBAR----------------------------->
      <b-col class="col-sm-6">
       <affix class="sidebar-menu" relative-element-selector="#searchResults">
      <b-sidebar
        id="sidebar-right"
        v-model="visible"
        v-if="infoData != null"
        :title="infoData.CommunityName"
        right
        shadow
        no-slide
      >
      <div class="px-3 py-2">
        <b-col id="sideBarTabs">
          <b-tabs 
        pills card
       active-nav-item-class="font-weight-bold text-uppercase tabClass"
       v-model="sidebarTabIndex"
      >
       
             <b-tab title="Home Design" v-if="homeData != null && qmiData == null">
               <div class="Home Designs">
              <h4> {{homeData.HomeDesignName}} </h4>
              <!--price-->
              <b-row>
                                  <b-col>
                  <b-icon icon="tag-fill" variant="success"></b-icon>
                  Starting at {{ homeData.Price | toCurrency }}
                </b-col>
              </b-row>
              <br>

              <!--First Row-->
              <b-row>
                 <b-col>
                  <b-icon
                    icon="house-door-fill"
                    style="color: #fb9536"
                  ></b-icon>
                  {{ homeData.HomeDesignType }}
                </b-col>

                <b-col>
                  <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                  {{ homeData.Sqft }} sqft
                </b-col>

            
             
              </b-row>

              <!--Second Row -->
              <b-row>
                            
                <b-col>
                  <b-icon icon="moon" style="color: #599097"></b-icon>
                  {{ homeData.Bedrooms }} Bedroom(s)
                </b-col>

                           <b-col>
                  <b-icon icon="droplet-fill" variant="primary"></b-icon>
                  {{ homeData.Bathrooms }} Bathroom(s)
                </b-col>

                
               
            

              </b-row>
              
              <!--Third row-->
                <b-row>
                    
                <b-col>
                  <b-icon icon="hammer" style="color: #545b62"></b-icon>
                  {{ homeData.Garages }} Garage(s)
                </b-col>

                <b-col>
                  <b-icon
                    icon="arrow-up-right-square-fill"
                    style="color: #86bcc2"
                  ></b-icon>
                  {{ homeData.Stories }} Floors(s)
                </b-col>
                
                
                             
                </b-row>

                <br/>

                <!--Promotion Row -->
                 <b-row>

                <b-col v-if="homeData.HasPromotions == true">
                  <div v-for="(p, index) in homeData.Promotions" :key="p + index">
                     <b-icon
                    icon="star-fill"
                    variant="warning"
                  ></b-icon><b> Promotion: {{p.PromoHeadline}}</b> <br/> 
                  {{p.PromoDescription}} <br/>
                  <a :href="p.PromoUrl" target="_blank">Website URL</a> <b-icon class="notALink" icon="clipboard" @click="copy(p.PromoUrl)"></b-icon>
                </div>
                </b-col>   
                <br/>
                  </b-row>
                
                <p><b> Description </b> <br />
                 <span v-html="homeData.Description"></span> </p>

                 <div v-if="homeData.WebsiteURL != undefined && homeData.WebsiteURL.length > 0">
                 <b>Links</b>

                 <div v-for="(l, index) in homeData.WebsiteURL" :key="l + index"> 
                   <a  :href="l.TheURL" target="_blank">{{l.Type}}</a> <b-icon class="notALink" icon="clipboard" @click="copy(l.TheURL)"></b-icon>

                 </div>

                 </div>
                <hr />
                
              </div>
            </b-tab>

            <b-tab title="Quick Move In" v-if="qmiData != null">
              <h5> {{homeData.HomeDesignName}} - {{qmiData.QmiAddress}} </h5>

       <!--price-->
              <b-row>
                                  <b-col>
                  <b-icon icon="tag-fill" variant="success"></b-icon>
                  {{ qmiData.QmiPrice | toCurrency }}
                </b-col>
              </b-row>
              <br>

              <!--First Row-->
              <b-row>
                 <b-col>
                  <b-icon
                    icon="house-door-fill"
                    style="color: #fb9536"
                  ></b-icon>
                  {{ homeData.HomeDesignType }}
                </b-col>

                <b-col>
                  <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                  {{ qmiData.QmiSqft }} sqft
                </b-col>

            
             
              </b-row>

              <!--Second Row -->
              <b-row>
                            
                <b-col>
                  <b-icon icon="moon" style="color: #599097"></b-icon>
                  {{ qmiData.QmiBed }} Bedroom(s)
                </b-col>

                           <b-col>
                  <b-icon icon="droplet-fill" variant="primary"></b-icon>
                  {{ qmiData.QmiBaths }} Bathroom(s)
                </b-col>                
              </b-row>
              
              <!--Third row-->
                <b-row>
                    
                <b-col>
                  <b-icon icon="hammer" style="color: #545b62"></b-icon>
                  {{ qmiData.QmiGarages }} Garage(s)
                </b-col>

                <b-col>
                  <b-icon
                    icon="arrow-up-right-square-fill"
                    style="color: #86bcc2"
                  ></b-icon>
                  {{ qmiData.QmiStories }} Floors(s)
                </b-col>
                
                
                             
                </b-row>

                <br/>

                <!--Promotion Row -->
                 <b-row>
                    <br/>

                <b-col v-if="homeData.HasPromotions == true">
                  <div v-for="(p, index) in homeData.Promotions" :key="p + index">
                     <b-icon
                    icon="star-fill"
                    variant="warning"
                  ></b-icon><b> Promotion: {{p.PromoHeadline}}</b> <br/> 
                  {{p.PromoDescription}} <br/>
                  <a :href="p.PromoUrl" target="_blank">Website URL</a> <b-icon class="notALink" icon="clipboard" @click="copy(p.PromoUrl)"></b-icon>
                </div>
                </b-col>   
                  </b-row>
                  <br />
       
       <p><b>Description</b> <br/>
       <span v-html="qmiData.QmiDescription"></span></p>

<hr />
            </b-tab>

        <b-tab title="Community" v-if="infoData != null" lazy>
           <!-- Community-->
         <div class="community">
             <h4> The Community  </h4>
          <div class="meta-data">
            <b class="text-muted"
              >{{ infoData.CommunityCity }}, {{ infoData.CommunityState }} |
              {{ infoData.CommunityBrandName }}
              <span v-if="infoData != undefined && infoData.CommunityType != undefined">
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

            <b>Website URL: </b> <a :href="infoData.CommunityURL" target="_blank"> Link </a> <b-icon class="notALink" icon="clipboard" @click="copy(infoData.CommunityURL)"></b-icon>
            </div>
            <br><br>
        </b-tab>

          <div v-if="infoData.HomeDesigns.length > 0 && homeData == null">
        <b-tab title="HDs"  lazy>
          <!--Home Designs-->
            <div class="Home Designs">
              <h4> Home Designs </h4>

              <div v-for="(hd, index) in infoData.HomeDesigns" :key="hd+index">
                <br>
                <h5>{{hd.HomeDesignName}}</h5>

              <!--price-->
              <b-row>
                                  <b-col>
                  <b-icon icon="tag-fill" variant="success"></b-icon>
                  Starting at {{ hd.Price | toCurrency }}
                </b-col>
              </b-row>
              <br>

              <!--First Row-->
              <b-row>
                 <b-col>
                  <b-icon
                    icon="house-door-fill"
                    style="color: #fb9536"
                  ></b-icon>
                  {{ hd.HomeDesignType }}
                </b-col>

                <b-col>
                  <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                  {{ hd.Sqft }} sqft
                </b-col>

            
             
              </b-row>

              <!--Second Row -->
              <b-row>
                            
                <b-col>
                  <b-icon icon="moon" style="color: #599097"></b-icon>
                  {{ hd.Bedrooms }} Bedroom(s)
                </b-col>

                           <b-col>
                  <b-icon icon="droplet-fill" variant="primary"></b-icon>
                  {{ hd.Bathrooms }} Bathroom(s)
                </b-col>

                
               
            

              </b-row>
              
              <!--Third row-->
                <b-row>
                    
                <b-col>
                  <b-icon icon="hammer" style="color: #545b62"></b-icon>
                  {{ hd.Garages }} Garage(s)
                </b-col>

                <b-col>
                  <b-icon
                    icon="arrow-up-right-square-fill"
                    style="color: #86bcc2"
                  ></b-icon>
                  {{ hd.Stories }} Floors(s)
                </b-col>
                
                
                             
                </b-row>

                <br/>

                <!--Promotion Row -->
                 <b-row>

                <b-col v-if="hd.HasPromotions == true">
                  <div v-for="(p, index) in hd.Promotions" :key="p + index">
                     <b-icon
                    icon="star-fill"
                    variant="warning"
                  ></b-icon><b> Promotion: {{p.PromoHeadline}}</b> <br/> 
                  {{p.PromoDescription}} <br/>
                  <a :href="p.PromoUrl" target="_blank">Website URL</a> <b-icon class="notALink" icon="clipboard" @click="copy(p.PromoUrl)"></b-icon>
                </div>
                <br/>
                </b-col>   
                  </b-row>
                
                
       
                <p><b> Description </b> <br />
                 <span v-html="hd.Description"></span> </p>

                 <div v-if="hd.WebsiteURL != undefined && hd.WebsiteURL.length > 0">
                 <b>Links</b>

                 <div v-for="(l, index) in hd.WebsiteURL" :key="l + index"> 
                   <a :href="l.TheURL" target="_blank"> {{l.Type}} </a> <b-icon class="notALink" icon="clipboard" @click="copy(l.TheURL)"></b-icon>

                 </div>

                 </div>
                <hr />
                </div>
              </div>
        </b-tab>
          </div>

                <b-tab title="QMIs" v-if="hasQMIs == true && qmiData == null" lazy>
   <!--QMIs-->
    <h4> Quick Move Ins </h4>
<div v-for="(hd, index) in infoData.HomeDesigns" :key="hd+index">
  <div v-if="hd.HasQMI == true">
       <div class="QMIs">
     <br>

     <div v-for="(qmi, i) in hd.QMIs" :key="qmi + i">
      
       <h5> {{hd.HomeDesignName}} - {{qmi.QmiAddress}} </h5>

       <!--price-->
              <b-row>
                                  <b-col>
                  <b-icon icon="tag-fill" variant="success"></b-icon>
                  {{ qmi.QmiPrice | toCurrency }}
                </b-col>
              </b-row>
              <br>

              <!--First Row-->
              <b-row>
                 <b-col>
                  <b-icon
                    icon="house-door-fill"
                    style="color: #fb9536"
                  ></b-icon>
                  {{ hd.HomeDesignType }}
                </b-col>

                <b-col>
                  <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                  {{ qmi.QmiSqft }} sqft
                </b-col>

            
             
              </b-row>

              <!--Second Row -->
              <b-row>
                            
                <b-col>
                  <b-icon icon="moon" style="color: #599097"></b-icon>
                  {{ qmi.QmiBed }} Bedroom(s)
                </b-col>

                           <b-col>
                  <b-icon icon="droplet-fill" variant="primary"></b-icon>
                  {{ qmi.QmiBaths }} Bathroom(s)
                </b-col>                
              </b-row>
              
              <!--Third row-->
                <b-row>
                    
                <b-col>
                  <b-icon icon="hammer" style="color: #545b62"></b-icon>
                  {{ qmi.QmiGarages }} Garage(s)
                </b-col>

                <b-col>
                  <b-icon
                    icon="arrow-up-right-square-fill"
                    style="color: #86bcc2"
                  ></b-icon>
                  {{ qmi.QmiStories }} Floors(s)
                </b-col>
                
                
                             
                </b-row>

              

                <!--Promotion Row -->
                 <b-row>
                    <br/>

                <b-col v-if="hd.HasPromotions == true">
                  <div v-for="(p, index) in hd.Promotions" :key="p + index">
                     <b-icon
                    icon="star-fill"
                    variant="warning"
                  ></b-icon><b> Promotion: {{p.PromoHeadline}}</b> <br/> 
                  {{p.PromoDescription}} <br/>
                  <a :href="p.PromoUrl" target="_blank">Website URL</a> <b-icon class="notALink" icon="clipboard" @click="copy(p.PromoUrl)"></b-icon>
                </div>
                <br />
                </b-col>   
                  </b-row>
                  
       
       <p><b>Description</b> <br/>
       <span v-html="qmi.QmiDescription"></span></p>

<hr />
       </div>
    </div>

          </div>
          </div>
            </b-tab>

              
      </b-tabs>

      </b-col>

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
import VueClipboard from "vue-clipboard2";

Vue.use(VueRouter);
Vue.use(Affix);
Vue.use(VueClipboard);

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
      homeData: null,
      qmiData: null,
      suggestions: [],
      hasQMIs: false,
      sidebarTabIndex: 0,
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
      async handler(val) {
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

        console.log(this.filterQuery);

        //Location
        if (this.filterQuery.radius != 0) {
          var long = this.filterQuery.locationLong;
          var lat = this.filterQuery.locationLat;
          var miles = await this.ConvertToMeters(this.filterQuery.radius);

          if (filter != "") {
            filter +=
              " and geo.distance(CommunitySalesOfficeLocation, geography'POINT(" +
              long +
              " " +
              lat +
              ")') le " +
              miles;
          } else {
            filter +=
              "geo.distance(CommunitySalesOfficeLocation, geography'POINT(" +
              long +
              " " +
              lat +
              ")') le " +
              miles;
          }
        } else {
          if (this.filterQuery.location != "") {
            if (
              this.filterQuery.locationCity == null ||
              this.filterQuery.locationCity == ""
            ) {
              this.filterQuery.locationCity = "''";
            }
            if (
              this.filterQuery.locationState == null ||
              this.filterQuery.locationState == ""
            ) {
              this.filterQuery.locationState = "''";
            }
            if (
              this.filterQuery.locationZip == null ||
              this.filterQuery.locationZip == ""
            ) {
              this.filterQuery.locationZip = "''";
            }

            search.push(
              "CommunityCity:(" +
                this.filterQuery.locationCity +
                ") AND CommunityState:(" +
                this.filterQuery.locationState +
                ") AND CommunityZip:(" +
                this.filterQuery.locationZip +
                ")"
            );
            console.log(search);
          }
        }

        var searchString = "";
        var searchFilterString = "";

        if (search != undefined) {
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

        // console.log(search);
        console.log("search: " + this.currentSearch);
        console.log("fields: " + this.currentSearchFields);
        console.log("filter: " + this.currentFilter);

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

      if (response != undefined) {
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
                    this.QMIs.push(this.communities[h].HomeDesigns[hd].QMIs[q]);
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
      } else {
        this.communitiesTotalCount = 0;
        this.hdTotalCount = 0;
        this.qmiTotalCount = 0;
      }
    },
    async ConvertToMeters(miles) {
      var mi = 1.60934;
      var meters = miles * mi;

      return meters;
    },
    openInfo(comData, homeData, qmiData) {
      this.infoData = null;
      this.homeData = null;
      this.qmiData = null;

      this.hasQMIs = false;

      if (comData != null) {
        for (var i = 0; i < comData.HomeDesigns.length; i++) {
          if (comData.HomeDesigns[i].HasQMI == true) {
            this.hasQMIs = true;
          }
        }
      }

      this.infoData = comData;
      this.homeData = homeData;
      this.qmiData = qmiData;

      this.visible = !this.visible;
    },
    copy(val) {
      var _this = this;
      this.$copyText(val).then(
        function (e) {
          _this.makeToast("success", "Success", "Copied: " + val);
        },
        function (e) {
          _this.makeToast("danger", "Failed", "Failed to copy");
        }
      );
    },
    makeToast(variant = null, title, msg) {
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 1000,
        appendToast: true,
        solid: true,
        variant: variant,
      });
    },
  },
};
</script>