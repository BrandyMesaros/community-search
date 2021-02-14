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

                <b v-if="com.CommunityStatus == 'ComingSoon'" class="comingSoon">{{ com.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                <b v-if="com.CommunityStatus == 'Active'" class="activeStatus">{{ com.CommunityStatus }}</b>
                <b v-if="com.CommunityStatus == 'Closeout'" class="closeout">{{ com.CommunityStatus }}</b>
                <b v-if="com.CommunityStatus == 'GrandOpening'" class="grandOpening">{{ com.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                

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
              <div  v-for="(com, h) in homes" :key="com + h">
              <b-list-group-item
               @click="openInfo(com)"
                :key="com.HomeDesigns[0].HomeDesignNumber + h"
                href="#"
                class="flex-column align-items-start"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">
                    {{ com.HomeDesigns[0].HomeDesignName }} - {{ com.CommunityName }} <b-icon icon="check-circle-fill" style="color: #9dc47d;"></b-icon>
                  </h5>
                <b v-if="com.CommunityStatus == 'ComingSoon'" class="comingSoon">{{ com.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                <b v-if="com.CommunityStatus == 'Active'" class="activeStatus">{{ com.CommunityStatus }}</b>
                <b v-if="com.CommunityStatus == 'Closeout'" class="closeout">{{ com.CommunityStatus }}</b>
                <b v-if="com.CommunityStatus == 'GrandOpening'" class="grandOpening">{{ com.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                
     </div>

                <div class="meta-data">
                  <b class="text-muted">{{ com.HomeDesigns[0].HomeDesignType }}</b> |
                  <b class="text-muted">{{ com.HomeDesigns[0].Bedrooms }} Bedrooms</b> |
                  <b class="text-muted">{{ com.HomeDesigns[0].Bathrooms }} Bathrooms</b> |
                  <b class="text-muted">{{ com.HomeDesigns[0].Sqft }} Sqft</b> |
                  <b class="text-muted">{{ com.HomeDesigns[0].Price | toCurrency }}</b>
                </div>

                <div v-html="com.HomeDesigns[0].Description"></div>
              </b-list-group-item>   
              </div>

 <!-- <div v-for="(com, i) in communities" :key="i">
  <div  v-for="(home, h) in com.HomeDesigns" :key="h">
              <b-list-group-item
                v-if="otherHomes.includes(home)"
               @click="openInfo(com, home, null)"
                href="#"
                class="flex-column align-items-start"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">
                    {{ home.HomeDesignName }} - {{ com.CommunityName }} 
                  </h5>
                <b v-if="com.CommunityStatus == 'ComingSoon'" class="comingSoon">{{ com.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                <b v-if="com.CommunityStatus == 'Active'" class="activeStatus">{{ com.CommunityStatus }}</b>
                <b v-if="com.CommunityStatus == 'Closeout'" class="closeout">{{ com.CommunityStatus }}</b>
                <b v-if="com.CommunityStatus == 'GrandOpening'" class="grandOpening">{{ com.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                
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
              </div> -->
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
                v-for="(home, qmi) in QMIs"
                :key="home + qmi"
              >
                <b-list-group-item
                  v-if="(QMIs.includes(home))"
                   @click="openInfo(home)"
                  :key="home.HomeDesigns[0].QMIs[0].QmiID + qmi"
                  href="#"
                  class="flex-column align-items-start"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">
                      {{ home.HomeDesigns[0].HomeDesignName }} - {{ home.HomeDesigns[0].QMIs[0].QmiAddress }} -
                      {{ home.CommunityName }} <b-icon icon="check-circle-fill" style="color: #9dc47d;"></b-icon>
                    </h5>

                    
                <b v-if="home.CommunityStatus == 'ComingSoon'" class="comingSoon">{{ home.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                <b v-if="home.CommunityStatus == 'Active'" class="activeStatus">{{ home.CommunityStatus }}</b>
                <b v-if="home.CommunityStatus == 'Closeout'" class="closeout">{{ home.CommunityStatus }}</b>
                <b v-if="home.CommunityStatus == 'GrandOpening'" class="grandOpening">{{ home.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                            
                    
                  </div>

                  <div class="meta-data">
                    <b class="text-muted">{{ home.HomeDesigns[0].HomeDesignType }}</b> |
                    <b class="text-muted">{{ home.HomeDesigns[0].QMIs[0].QmiBed }} Bedrooms</b> |
                    <b class="text-muted">{{ home.HomeDesigns[0].QMIs[0].QmiBaths }} Bathrooms</b> |
                    <b class="text-muted">{{ home.HomeDesigns[0].QMIs[0].QmiSqft }} Sqft</b> |
                    <b class="text-muted">{{ home.HomeDesigns[0].QMIs[0].QmiPrice | toCurrency }}</b>
                  </div>

                  <div v-html="home.HomeDesigns[0].QMIs[0].QmiDescription"></div>
                </b-list-group-item>

<!-- 
<div
                v-for="(hd, i) in home.HomeDesigns"
                :key="hd.HomeDesignNumber + 'QMI2' + i"
              >
                <div
                v-for="(QMI, qmi) in hd.QMIs"
                :key="QMI + '2' + qmi"
              >
                <b-list-group-item
                  v-if="(otherQMIs.includes(QMI))"
                   @click="openInfo(home, hd, QMI)"
                  :key="QMI.QmiID + '2' + qmi"
                  href="#"
                  class="flex-column align-items-start"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">
                      {{ hd.HomeDesignName }} - {{ QMI.QmiAddress }} -
                      {{ home.CommunityName }}
                    </h5>

                    
                <b v-if="home.CommunityStatus == 'ComingSoon'" class="comingSoon">{{ home.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                <b v-if="home.CommunityStatus == 'Active'" class="activeStatus">{{ home.CommunityStatus }}</b>
                <b v-if="home.CommunityStatus == 'Closeout'" class="closeout">{{ home.CommunityStatus }}</b>
                <b v-if="home.CommunityStatus == 'GrandOpening'" class="grandOpening">{{ home.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                            
                    
                  </div>

                  <div class="meta-data">
                    <b class="text-muted">{{ hd.HomeDesignType }}</b> |
                    <b class="text-muted">{{ QMI.QmiBed }} Bedrooms</b> |
                    <b class="text-muted">{{ QMI.QmiBaths }} Bathrooms</b> |
                    <b class="text-muted">{{ QMI.QmiSqft }} Sqft</b> |
                    <b class="text-muted">{{ QMI.QmiPrice | toCurrency }}</b>
                  </div>

                  <div v-html="QMI.QmiDescription"></div>
                </b-list-group-item>
                </div>
                </div> -->

            
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
       
                   <b-tab title="Quick Move In" v-if="infoType == 'QMI' ">
                     <h5> {{infoData.HomeDesigns[0].HomeDesignName}}</h5>

                       <div class="meta-data">
                <div class="text-muted">
       <p><b>  {{infoData.HomeDesigns[0].QMIs[0].QmiAddress}} </b> <b-icon class="notALink" icon="clipboard" @click="copy(infoData.HomeDesigns[0].QMIs[0].QmiAddress)"></b-icon> </p>
       </div> </div>


       <!--price-->
              <b-row>
                                  <b-col>
                  <b-icon icon="tag-fill" variant="success"></b-icon>
                  {{ infoData.HomeDesigns[0].QMIs[0].QmiPrice | toCurrency }}
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
                  {{ infoData.HomeDesigns[0].HomeDesignType }}
                </b-col>

                <b-col>
                  <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                  {{ infoData.HomeDesigns[0].QMIs[0].QmiSqft }} sqft
                </b-col>

            
             
              </b-row>

              <!--Second Row -->
              <b-row>
                            
                <b-col>
                  <b-icon icon="moon" style="color: #599097"></b-icon>
                  {{ infoData.HomeDesigns[0].QMIs[0].QmiBed }} Bedroom(s)
                </b-col>

                           <b-col>
                  <b-icon icon="droplet-fill" variant="primary"></b-icon>
                  {{ infoData.HomeDesigns[0].QMIs[0].QmiBaths }} Bathroom(s)
                </b-col>                
              </b-row>
              
              <!--Third row-->
                <b-row>
                    
                <b-col>
                  <b-icon icon="hammer" style="color: #545b62"></b-icon>
                  {{ infoData.HomeDesigns[0].QMIs[0].QmiGarages }} Garage(s)
                </b-col>

                <b-col>
                  <b-icon
                    icon="arrow-up-right-square-fill"
                    style="color: #86bcc2"
                  ></b-icon>
                  {{ infoData.HomeDesigns[0].QMIs[0].QmiStories }} Floors(s)
                </b-col>
                
                
                             
                </b-row>

                <br/>

                <!--Promotion Row -->
                 <b-row>
                    <br/>

                <b-col v-if="infoData.HomeDesigns[0].HasPromotions == true">
                  <div v-for="(p, index) in infoData.HomeDesigns[0].Promotions" :key="p + index">
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
       <span v-html="infoData.HomeDesigns[0].QMIs[0].QmiDescription"></span></p>

<hr />
            </b-tab>
            
             <b-tab title="Home Design" v-if="infoType == 'HomeDesign' || infoType == 'QMI'">
               <div class="Home Designs">
              <h4> {{infoData.HomeDesigns[0].HomeDesignName}} </h4>
              <!--price-->
              <b-row>
                                  <b-col>
                  <b-icon icon="tag-fill" variant="success"></b-icon>
                  Starting at {{ infoData.HomeDesigns[0].Price | toCurrency }}
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
                  {{ infoData.HomeDesigns[0].HomeDesignType }}
                </b-col>

                <b-col>
                  <b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                  {{ infoData.HomeDesigns[0].Sqft }} sqft
                </b-col>  
              </b-row>

              <!--Second Row -->
              <b-row>
                            
                <b-col>
                  <b-icon icon="moon" style="color: #599097"></b-icon>
                  {{ infoData.HomeDesigns[0].Bedrooms }} Bedroom(s)
                </b-col>

                           <b-col>
                  <b-icon icon="droplet-fill" variant="primary"></b-icon>
                  {{ infoData.HomeDesigns[0].Bathrooms }} Bathroom(s)
                </b-col>
              </b-row>
              
              <!--Third row-->
                <b-row>
                    
                <b-col>
                  <b-icon icon="hammer" style="color: #545b62"></b-icon>
                  {{ infoData.HomeDesigns[0].Garages }} Garage(s)
                </b-col>

                <b-col>
                  <b-icon
                    icon="arrow-up-right-square-fill"
                    style="color: #86bcc2"
                  ></b-icon>
                  {{ infoData.HomeDesigns[0].Stories }} Floors(s)
                </b-col>
                           </b-row>

                <br/>

                <!--Promotion Row -->
                 <b-row>

                <b-col v-if="infoData.HomeDesigns[0].HasPromotions == true">
                  <div v-for="(p, index) in infoData.HomeDesigns[0].Promotions" :key="p + index">
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
                 <span v-html="infoData.HomeDesigns[0].Description"></span> </p>

                 <div v-if="infoData.HomeDesigns[0].WebsiteURL != undefined && infoData.HomeDesigns[0].WebsiteURL.length > 0">
                 <b>Links</b>

                 <div v-for="(l, index) in infoData.HomeDesigns[0].WebsiteURL" :key="l + index"> 
                   <a  :href="l.TheURL" target="_blank">{{l.Type}}</a> <b-icon class="notALink" icon="clipboard" @click="copy(l.TheURL)"></b-icon>

                 </div>

                 </div>
                <hr />
                
              </div>
            </b-tab>


            <b-tab title="Community" v-if="infoData != null" lazy>
           <!-- Community-->
         <div class="community">
             <h4> {{ infoData.CommunityName }}  </h4>
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

          <p><b>Status: </b>
              <b v-if="infoData.CommunityStatus == 'ComingSoon'" class="comingSoon">{{ infoData.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
                <b v-if="infoData.CommunityStatus == 'Active'" class="activeStatus">{{ infoData.CommunityStatus }}</b>
                <b v-if="infoData.CommunityStatus == 'Closeout'" class="closeout">{{ infoData.CommunityStatus }}</b>
                <b v-if="infoData.CommunityStatus == 'GrandOpening'" class="grandOpening">{{ infoData.CommunityStatus.replace(/([A-Z])/g, ' $1').trim() }}</b>
          
            </p>

            
               <div v-if="infoData.HomeDesigns[0] != undefined && infoData.HomeDesigns[0].Promotions != undefined">
                  <div v-for="(p, index) in infoData.HomeDesigns[0].Promotions" :key="p + 'com' + index">
                     <b-icon
                    icon="star-fill"
                    variant="warning"
                  ></b-icon><b> Promotion: {{p.PromoHeadline}}</b> <br/> 
                  {{p.PromoDescription}} <br/>
                  <a :href="p.PromoUrl" target="_blank">Website URL</a> <b-icon class="notALink" icon="clipboard" @click="copy(p.PromoUrl)"></b-icon>
                </div>
                <br/>  
                  </div>
              

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
            <b-icon icon="house-fill"></b-icon> {{infoData.CommunitySalesOfficeAddress}} <b-icon class="notALink" icon="clipboard" @click="copy(infoData.CommunitySalesOfficeAddress)"></b-icon> <br />
              <b-icon icon="telephone-fill"></b-icon> {{infoData.CommunitySalesOfficePhone}}
            </p>

            <b>Website URL: </b> <a :href="infoData.CommunityURL" target="_blank"> Link </a> <b-icon class="notALink" icon="clipboard" @click="copy(infoData.CommunityURL)"></b-icon>
            </div>
            <br><br>
            </b-tab>

          <div v-if="infoData.HomeDesigns.length != 0 && infoType == 'Community'">
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

                <b-tab title="QMIs" v-if="infoData.HomeDesigns.length != 0  && infoData.HomeDesigns[0].QMIs.length != 0   && infoType != 'QMI'" lazy>
   <!--QMIs-->
    <h4> Quick Move Ins </h4>
<div v-for="(hd, index) in infoData.HomeDesigns" :key="hd+index">
  <div v-if="hd.HasQMI == true">
       <div class="QMIs">
     <br>

     <div v-for="(qmi, i) in hd.QMIs" :key="qmi + i">
      
       <h5> {{hd.HomeDesignName}}</h5>
     
                       <div class="meta-data">
                <div class="text-muted">
       <p><b>  {{qmi.QmiAddress}} </b> <b-icon class="notALink" icon="clipboard" @click="copy(qmi.QmiAddress)"></b-icon> </p>
       </div> </div>


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

                <br/>    

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
        <br/> <br/>
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
var searchURL = process.env.VUE_APP_FULL_SEARCHURL;

export default {
  router,
  name: "SearchResults",
  props: ["filterQuery", "searchQuery"],
  data() {
    return {
      communities: [],
      homes: [],
      QMIs: [],
      otherHomes: [],
      otherQMIs: [],
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
      stopShowing: false,
      infoType: "",
    };
  },
  mounted: async function () {
    var s = "";

    if (this.tabIndex == 0) {
      s = "Type:(Community) ";
    } else if (this.tabIndex == 1) {
      s = "Type:(HomeDesign) ";
    } else if (this.tabIndex == 2) {
      s = "Type:(QMI) ";
    }

    var path = this.$route.path;
    if (path != "" && path != "/") {
      var search = path.replace("/", "");
      s += ' AND CommunityID:("' + search + '")';
      var body = {
        search: s,
        searchMode: "any",
        queryType: "full",
        count: "true",
        top: 5,
      };
      var com = await this.SearchAPI(body);
      if (com != null && (com.value != null) & (com.value.length > 0)) {
        this.openInfo(com.value[0], null, null);
      }
    }
  },
  watch: {
    filterQuery: {
      async handler(val) {
        this.filter();
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
    hdCurrentPage: {
      handler(val) {
        var skip = 50 * (this.hdCurrentPage - 1);
        this.GetHomes(
          this.currentSearch,
          this.currentSearchFields,
          this.currentFilter,
          "",
          skip
        );
      },
    },
    qmiCurrentPage: {
      handler(val) {
        var skip = 50 * (this.qmiCurrentPage - 1);
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
    tabIndex: {
      handler(val) {
        this.filter();
      },
    },
  },
  methods: {
    async SearchAPI(body) {
      var val;

      console.log(searchURL);

      await axios
        .post(searchURL, body, { headers })
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
        top: 50,
        skip: skipNum,
      };

      console.log(body);

      var response = await this.SearchAPI(body);

      if (response != undefined) {
        this.communitiesTotalCount = response["@odata.count"];
        this.hdTotalCount = response["@odata.count"];
        this.qmiTotalCount = response["@odata.count"];

        this.homes = [];
        this.QMIs = [];

        if (response.value != "") {
          var val = response.value;

          if (this.tabIndex == 0) {
            this.communities = val;
          } else if (this.tabIndex == 1) {
            this.homes = val;
          } else if (this.tabIndex == 2) {
            this.QMIs = val;
          }

          if (this.filterQuery != null) {
            var isEmpty = !Object.values(this.filterQuery).some(
              (x) =>
                x !== null &&
                x !== "" &&
                x !== "No_QMI" &&
                x !== "Any" &&
                x !== Array(0) &&
                x !== undefined
            );
          }

          // if (this.homes != undefined && skipNum == 0) {
          //   this.hdTotalCount = this.homes.length;
          // }
          // if (this.QMIs != undefined && skipNum == 0) {
          //   this.qmiTotalCount = this.QMIs.length;
          // }

          // if (isEmpty == false) {
          //   this.filterMore(this.homes, "homes");
          //   this.filterMore(this.QMIs, "qmis");
          // }

          console.log(this.homes.length);
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
    openInfo(info) {
      this.visible == false;
      this.infoData = null;
      this.sidebarTabIndex = 0;
      this.hasQMIs = false;

      if (info != null) {
        for (var i = 0; i < info.HomeDesigns.length; i++) {
          if (info.HomeDesigns[i].HasQMI == true) {
            this.hasQMIs = true;
          }
        }
      }

      this.infoType = info.Type;
      this.infoData = info;
      this.visible = true;
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
    async filter() {
      this.communities = [];
      this.homes = [];
      this.QMIs = [];

      //Start creating search/filters
      var search = [];
      var searchFields = [];
      var filter = "";

      //Tabs
      if (this.tabIndex == 0) {
        search.push("Type:(Community) ");
      } else if (this.tabIndex == 1) {
        search.push("Type:(HomeDesign) ");
      } else if (this.tabIndex == 2) {
        search.push("Type:(QMI) ");
      }

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
        if (
          this.filterQuery.location != null &&
          this.filterQuery.location != ""
        ) {
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
        }
      }

      //Price Range
      if (this.filterQuery.minPrice != "" && this.filterQuery.maxPrice != "") {
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
      if (this.filterQuery.minPrice == "" && this.filterQuery.maxPrice != "") {
        if (filter != "") {
          filter +=
            " and HomeDesigns/any (h: h/Price le " +
            this.filterQuery.maxPrice +
            ")";
        } else {
          filter +=
            "HomeDesigns/any (h: h/Price le " + this.filterQuery.maxPrice + ")";
        }
      }
      if (this.filterQuery.minPrice != "" && this.filterQuery.maxPrice == "") {
        if (filter != "") {
          filter +=
            " and HomeDesigns/any (h: h/Price ge " +
            this.filterQuery.minPrice +
            ")";
        } else {
          filter +=
            "HomeDesigns/any (h: h/Price ge " + this.filterQuery.minPrice + ")";
        }
      }

      //Home Type
      if (
        this.filterQuery.homeType.length != null &&
        this.filterQuery.homeType.length > 0
      ) {
        var ss = "";

        for (var ii = 0; ii < this.filterQuery.homeType.length; ii++) {
          ss += "'" + this.filterQuery.homeType[ii] + "'";
          if (ii + 1 < this.filterQuery.homeType.length) {
            ss += " OR ";
          }
        }

        search.push("HomeDesigns/HomeDesignType:(" + ss + ")");
      }

      //Bedrooms
      if (this.filterQuery.bedrooms != "Any") {
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
      if (this.filterQuery.bathrooms != "Any") {
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
      if (this.filterQuery.garages != "Any") {
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
      if (this.filterQuery.stories != "Any") {
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

      //Has QMIs
      if (this.filterQuery.QMIStatus == "yes_QMI") {
        if (filter != "") {
          filter += " and HomeDesigns/any (h: h/HasQMI eq true)";
        } else {
          filter += "HomeDesigns/any (h: h/HasQMI eq true)";
        }
      }

      //SQFT
      if (
        this.filterQuery.minSqFootage != "" &&
        this.filterQuery.maxSqFootage != ""
      ) {
        if (filter != "") {
          filter +=
            " and HomeDesigns/any (h: h/Sqft ge " +
            this.filterQuery.minSqFootage +
            " and h/Sqft le " +
            this.filterQuery.maxSqFootage +
            ")";
        } else {
          filter +=
            "HomeDesigns/any (h: h/Sqft ge " +
            this.filterQuery.minSqFootage +
            " and h/Sqft le " +
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

      //Move in date
      if (this.filterQuery.moveInDate != "") {
        var d = new Date(this.filterQuery.moveInDate);
        if (filter != "") {
          filter +=
            " and HomeDesigns/any (h: h/QMIs/any (q: q/QmiMoveInDate le " +
            d.toISOString() +
            "))";
        } else {
          filter +=
            "HomeDesigns/any (h: h/QMIs/any (q: q/QmiMoveInDate le " +
            d.toISOString() +
            "))";
        }
      }

      //Brand Name
      if (
        this.filterQuery.brand.length != null &&
        this.filterQuery.brand.length > 0
      ) {
        var br = "";

        for (var b = 0; b < this.filterQuery.brand.length; b++) {
          br += "'" + this.filterQuery.brand[b] + "'";
          if (b + 1 < this.filterQuery.brand.length) {
            br += " OR ";
          }
        }

        search.push('CommunityBrandName:("' + br + '")');
      }

      //Ammenities
      if (
        this.filterQuery.amenities.length != null &&
        this.filterQuery.amenities.length > 0
      ) {
        var am = "";

        for (var a = 0; a < this.filterQuery.amenities.length; a++) {
          am += "'" + this.filterQuery.amenities[a] + "'";
          if (a + 1 < this.filterQuery.amenities.length) {
            am += " AND ";
          }
        }

        search.push('HomeDesigns/Amenities:("' + am + '")');
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

      console.log(search);
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

      this.stopShowing = true;
    },
    filterMore(homes, type) {
      var other = [];
      var remove = [];

      for (var h = 0; h < homes.length; h++) {
        //Price
        if (
          this.filterQuery.minPrice != "" &&
          this.filterQuery.maxPrice != ""
        ) {
          if (
            (homes[h].Price || homes[h].QmiPrice) < this.filterQuery.minPrice ||
            (homes[h].Price || homes[h].QmiPrice) > this.filterQuery.maxPrice
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        } else if (
          this.filterQuery.minPrice == "" &&
          this.filterQuery.maxPrice != ""
        ) {
          if (
            (homes[h].Price || homes[h].QmiPrice) > this.filterQuery.maxPrice
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        } else if (
          this.filterQuery.minPrice != "" &&
          this.filterQuery.maxPrice == ""
        ) {
          if (
            (homes[h].Price || homes[h].QmiPrice) < this.filterQuery.minPrice
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //Home Designs
        if (this.filterQuery.homeType.length > 0) {
          if (
            !this.filterQuery.homeType.includes(
              homes[h].HomeDesignType || homes[h].QmiHomeType
            )
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //Bedrooms
        if (this.filterQuery.bedrooms != "Any") {
          if (
            (homes[h].Bedrooms || homes[h].QmiBed) < this.filterQuery.bedrooms
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //Bathrooms
        if (this.filterQuery.bathrooms != "Any") {
          if (
            (homes[h].Bathrooms || homes[h].QmiBaths) <
            this.filterQuery.bathrooms
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //Garages
        if (this.filterQuery.garages != "Any") {
          if (
            (homes[h].Garages || homes[h].QmiGarages) < this.filterQuery.garages
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //Stories
        if (this.filterQuery.stories != "Any") {
          if (
            (homes[h].Stories || homes[h].QmiStories) < this.filterQuery.stories
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //Has QMIs
        if (this.filterQuery.QMIStatus == "yes_QMI") {
          if (homes[h].HasQMI == false) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }

        //SQFT
        if (
          this.filterQuery.minSqFootage != "" &&
          this.filterQuery.maxSqFootage != ""
        ) {
          if (
            (homes[h].Sqft || homes[h].QmiSqft) <
              this.filterQuery.minSqFootage ||
            (homes[h].Sqft || homes[h].QmiSqft) > this.filterQuery.maxSqFootage
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        } else if (
          this.filterQuery.minSqFootage == "" &&
          this.filterQuery.maxSqFootage != ""
        ) {
          if (
            (homes[h].Sqft || homes[h].QmiSqft) > this.filterQuery.maxSqFootage
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        } else if (
          this.filterQuery.minSqFootage != "" &&
          this.filterQuery.maxSqFootage == ""
        ) {
          if (
            (homes[h].Sqft || homes[h].QmiSqft) < this.filterQuery.minSqFootage
          ) {
            remove.push(h);
            other.push(homes[h]);
            continue;
          }
        }
      }

      if (remove.length > 0) {
        for (var r = remove.length - 1; r >= 0; r--) {
          homes.splice(remove[r], 1);
        }
      }

      if (type == "homes") {
        this.homes = homes;
        this.otherHomes = other;
      } else if (type == "qmis") {
        this.QMIs = homes;
        this.otherQMIs = other;
      }
    },
  },
};
</script>