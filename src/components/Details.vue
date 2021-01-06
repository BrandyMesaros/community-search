<template>
    <div>
      <div>
        <b-tabs content-class="mt-3">
          <b-tab class="Overview" title="Overview" active>
            <!--Top Overview-->
            <h5>Overview</h5>
            <b-row class="col-sm-12">
              <div class="info">
                <!--First Row-->
                <b-list-group horizontal="md">
                  <b-list-group-item
                    ><b-icon icon="tag-fill" variant="success"></b-icon>
                    {{ modalData.Price | toCurrency }}</b-list-group-item
                  >
                  <b-list-group-item
                    ><b-icon icon="moon" variant="warning"></b-icon>
                    {{ modalData.Bedrooms }} Bedroom(s)</b-list-group-item
                  >
                  <b-list-group-item
                    ><b-icon icon="hammer" style="color: #fb9536"></b-icon>
                    {{ modalData.Garages }} Garage(s)</b-list-group-item
                  >

                  <b-list-group-item v-if="modalData.IsAvailable == true"
                    ><b-icon
                      icon="check-circle-fill"
                      variant="success"
                    ></b-icon>
                    Available</b-list-group-item
                  >

                  <b-list-group-item v-if="modalData.IsAvailable == false"
                    ><b-icon icon="x-circle-fill" variant="danger"></b-icon> Not
                    Available</b-list-group-item
                  >
                </b-list-group>

                <!--Second Row -->
                <b-list-group horizontal="md">
                  <b-list-group-item
                    ><b-icon icon="grid-1x2-fill" variant="secondary"></b-icon>
                    {{ modalData.Sqft }} sqft</b-list-group-item
                  >
                  <b-list-group-item
                    ><b-icon icon="droplet-fill" variant="primary"></b-icon>
                    {{ modalData.Bathrooms }} Bathroom(s)</b-list-group-item
                  >
                  <b-list-group-item
                    ><b-icon
                      icon="arrow-up-right-square-fill"
                      style="color: #86bcc2"
                    ></b-icon>
                    {{ modalData.Stories }} Story(s)</b-list-group-item
                  >

                  <b-list-group-item
                    ><b-icon
                      icon="house-door-fill"
                      style="color: #fb9536"
                    ></b-icon>
                    {{ modalData.HomeDesignType }}</b-list-group-item
                  >
                </b-list-group>
              </div>
            </b-row>

            <br /><br />

            <b-row>
              <!--Left Column-->
              <b-col class="col-sm-8">
                <b class="info"> Description </b>
                <p>{{ modalData.Description }}</p>
              </b-col>

              <!--Right Column-->
              <b-col class="col-sm-4">
                <b class="info"> Community </b>
                <p>
                  {{ modalData.CommunityName }}

                  <span v-if="modalData.CommunityAddress != null">
                    <br />
                    {{ modalData.CommunityAddress.Street }}
                    {{ modalData.CommunityAddress.City }}
                    {{ modalData.CommunityAddress.State }}
                    {{ modalData.CommunityAddress.Zip }}
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
          </b-tab>

          <b-tab v-if="modalData.HasQMI == true" title="QMI">
            <b-list-group v-if="modalData.HasQMI == true" id="qmiList">
              <h5>Quick Move-In Homes</h5>

              <b-list-group-item v-for="qmi in modalData.QMIs" :key="qmi.QmiID">
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
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    methods: {

    }
}
</script>