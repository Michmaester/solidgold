<template>
  <div>
    
    <div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

      <h3 class="has-text-header">Orders</h3>
      <div class="flex items-center">
        <b-button :disabled="checked_salesorder.length <= 0" type="is-danger" icon-left="trash-can-outline" class="is-small text-white mr-1">Trash</b-button>
        <b-dropdown aria-role="list" position="is-bottom-left">
            <b-button type="is-primary" size="is-small" slot="trigger" slot-scope="{ active }">
                <span>Actions</span>
                <b-icon size="is-small" :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
            </b-button>

            <b-dropdown-item class="text-xs" aria-role="listitem">Action 1</b-dropdown-item>
            <b-dropdown-item class="text-xs" aria-role="listitem">Other action</b-dropdown-item>
        </b-dropdown>
        <!-- <b-button type="is-primary" icon-left="plus" class="is-small text-white" @click="NewForm">New</b-button>
        <b-button type="is-primary" icon-left="playlist-edit" class="is-small ml-1" @click="EditForm">Edit</b-button> -->
      </div>
      
    </div>


    <div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

      <div class="col-span-8 wrapper-h bg-white">

        <!-- main table -->
        <div class="text-xs p-2">
          <b-table
            :bordered="false"
            :striped="true"
            :narrowed="true"
            :hoverable="true"
            :loading="false"
            
            sort-icon = "arrow-up"
            sort-icon-size = "is-small"

            :paginated="true"
            :per-page="10"
            current-page.sync="1"
            :pagination-simple="false"
            :pagination-position="'top'"
            pagination-size = "is-small"

            :selected.sync="selected_salesorder"
            @select="SelectedSalesOrder"

            :checked-rows.sync="checked_salesorder"
            :is-row-checkable="(row) => row.status == 'submitted'"
            checkable
            :checkbox-position="'right'"

            :data="salesOrders"
            :columns="tbl_salesorders_columns">

            <template slot="top-left">
              <p>filters here</p>
            </template>

          </b-table>
        </div>

        <!-- items table -->
        <div class="text-xs p-2">
          <b-table
            :bordered="false"
            :striped="true"
            :narrowed="true"
            :hoverable="true"
            :loading="false"
            
            sort-icon = "arrow-up"
            sort-icon-size = "is-small"

            :paginated="true"
            :per-page="10"
            current-page.sync="1"
            :pagination-simple="false"
            :pagination-position="'top'"
            pagination-size = "is-small"

            :data="sales_order_items"
            :columns="tbl_salesorder_items_columns">

            <template slot="top-left">
            </template>

          </b-table>
        </div>

      </div>

    </div>


    <b-modal :active.sync="isModalShow"
              has-modal-card
              trap-focus
              :width="1200"
              @close="CloseSalesOrderModal"
              :destroy-on-hide="false">

        
        <div class="modal-card" style="width: 1200px;">

          

            <header class="modal-card-head p-3 has-background-primary">
                <p class="modal-card-title text-base font-semibold text-white">Sales Order Form</p>
            </header>
            <section class="modal-card-body app-modal-form">

              <div class="columns mb-0">
                <div class="column">
                  <b-field label="Order Date" custom-class="text-xs">
                    <b-input disabled size='is-small' type="text" v-model="form_salesorder.order_date"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Customer" custom-class="text-xs">
                      <b-select placeholder="Select brand" size='is-small' expanded @input="CustomerSeleted" v-model="form_salesorder.customer_id">
                          <option
                              v-for="customer in customers"
                              :value="customer.customer_id"
                              :key="customer.id">
                              {{ customer.name }}
                          </option>
                      </b-select>
                  </b-field>
                  <!-- <b-field label="Customer" custom-class="font-semibold">
                    <b-input size='is-small' type="text" v-model="form_salesorder.customer_id"></b-input>
                  </b-field> -->
                </div>

                <div class="column">
                  <b-field label="Customer Address" custom-class="text-xs">
                    <b-input disabled size='is-small' type="text" v-model="form_salesorder.customer_address"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Sales Type" custom-class="text-xs">
                      <b-select placeholder="Select brand" size='is-small' expanded v-model="form_salesorder.sales_type">
                          <option value="retail">Retail</option>
                          <option value="wholesale">Wholesale</option>
                      </b-select>
                  </b-field>
                </div>
              </div>


              <div class="flex flex-col">

                <!-- header -->
                <div class="flex text-sm p-2">
                  <div class="w-40 mr-2">
                    <p>Product Name</p>
                  </div>
                  <div class="w-24 mr-2">
                    <p>Sale Price</p>
                  </div>
                  <div class="w-24 mr-2">
                    <p>Quantity</p>
                  </div>
                  <!-- <div class="w-40 mr-2">
                    <p>Active Start</p>
                  </div>
                  <div class="w-40 mr-2">
                    <p>Active End</p>
                  </div>
                  <div class="w-64 mr-2">
                    <p>Details</p>
                  </div> -->
                  <div class="w-16 justify-end flex">
                    <b-button class="mr-1" type="is-success" size="is-small" icon-left="plus" @click="AddOrderItemsRow"></b-button>
                  </div>
                </div>

                <!-- rows -->
                
                <div class="flex text-sm px-2 py-1 mb-1 items-center" v-for="(item,index) in form_salesorder_items" :key="index">

                  <div class="w-40 mr-2">
                    
                      <b-select :disabled="!isFormCreate" placeholder="Select a code" expanded v-model="item.product_id" size='is-small'>
                          <option
                              v-for="prod in products"
                              :value="prod.product_id"
                              :key="prod.product_id">
                              {{ prod.name }}
                          </option>
                      </b-select>
                     
                  </div>

                  

                  

                  <div class="w-24 mr-2">
                    
                      <b-input
                          size='is-small'
                          type="text"
                          v-model="item.quantity"
                          >
                      </b-input>
                     
                  </div>

                  <div class="w-24 mr-2">
                    
                      <b-input
                          size='is-small'
                          type="text"
                          v-model="item.sale_price"
                          >
                      </b-input>
                     
                  </div>

                  <!-- <div class="w-64 flex-col mr-2 leading-tight text-xs">
                    <p>Name : {{ rawmat.rm_name }}</p>
                    <p>Type : {{ rawmat.rm_type }}</p>
                  </div> -->

                  <div class="w-16 justify-end flex">
                    <b-button class="mr-1" type="is-danger" size="is-small" icon-left="close" @click="RemoveOrderItemsRow(index)"></b-button>
                  </div>
                </div>
              </div>

              


              <!-- form_salesorder : {
                customer_id : null,
                sales_type : null,
                order_date : null,
                order_no : null,
                status : null,
                customer_name : null,
                customer_address : null,
                is_printed : null
              }, -->

            </section>
            <footer class="modal-card-foot p-3">
                <b-button v-show="isFormCreate" type="is-primary" size="is-small" @click="SaveSalesOrderForm" icon-left="content-save">Save</b-button>
                <b-button v-show="!isFormCreate"  type="is-primary" size="is-small" @click="UpdateSalesOrderForm">Update</b-button>
                <b-button type="is-secondary" size="is-small">Clear</b-button>
            </footer>

         
        </div>
    </b-modal>

   

  </div>
</template>

<script>

  import { mapActions, mapMutations, mapGetters } from 'vuex'
  import simplebar from 'simplebar-vue'
  import dayjs from 'dayjs'

  export default {


    components: {
      simplebar
    },

    computed: mapGetters({
        customers: 'partners/getCustomers',
        salesOrders: 'sales/getSalesOrders',
        salesOrderItems: 'sales/getSalesOrderItems',

        products: 'products/getProducts',
        // comments: 'articles/comments/get'
    }),

    data() {
      return {

        tbl_salesorders_columns : [
          { field: 'order_no', label: 'Order No', sortable: true},
          { field: 'status', label: 'Status', sortable: true},
          { field: 'customer_name', label: 'Customer', sortable: true},
          { field: 'customer_address', label: 'Address'},
          // { field: 'customer_id', label: 'CustomerId', width: '150', sortable: true },
          { field: 'user.username', label: 'Sales'},
          { field: 'sales_type', label: 'Type'},
          { field: 'dateOrder', label: 'Order Date'},
        ],


        tbl_salesorder_items_columns : [
          // { field: 'order_no', label: 'Sales Order', width: '150', sortable: true },
          { field: 'product.name', label: 'Product', width: '150', sortable: true},
          { field: 'sale_price', label: 'Price', width: '40' },
          { field: 'quantity', label: 'Quantity', width: '40' }
        ],

        selected_salesorder : {},
        sales_order_items : [],
        checked_salesorder : [],


        form_salesorder : {
          customer_id : null,
          user_id : null,
          sales_type : null,
          order_date : null,
          order_no : null,
          status : null,
          customer_name : null,
          customer_address : null,
          is_printed : null
        },

        form_salesorder_items : [
          {
            product_id : null,
            quantity : null,
            sale_price : null
          }
        ],
        

        selectedOptions : [],
        
        isFormCreate : false,
        isModalShow : false,




      }
    },

    methods: {

      ...mapActions({
        GetCustomers: 'partners/GetCustomers',
        GetSalesOrders: 'sales/GetSalesOrders',
        GetSalesOrderItems: 'sales/GetSalesOrderItems',
        GetProducts: 'products/GetProducts',

        InsertSalesOrder : 'sales/InsertSalesOrder',

        
      }),

      ...mapMutations({
          // PushAddSalesOrder: 'sales/add'
      }),


      AddOrderItemsRow(){

        this.form_salesorder_items.push(
            {
              product_id : null,
              quantity : null,
              sale_price : null
            }
        )

      },

      RemoveOrderItemsRow(index){
          this.form_salesorder_items.splice(index, 1);
          if(index===0)
          this.AddOrderItemsRow()
      },


      SelectedSalesOrder(data){
        // console.log(data)
        this.sales_order_items = data.order_items
      },

      CustomerSeleted(){

        var res = this.customers.filter((item) => {
          return item.customer_id == this.form_salesorder.customer_id
        })[0]

        this.form_salesorder.customer_address = res.address
        this.form_salesorder.customer_name = res.name
      },


      NewForm(){
        this.isFormCreate = true

        this.form_salesorder.order_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.form_salesorder.user_id = 1

        this.isModalShow = true
      },

      EditForm(){
        this.isFormCreate = false
        this.isModalShow = true
      },

      CloseSalesOrderModal(){
        this.isModalShow = false
      },


      async SaveSalesOrderForm(){
          
          let res = await this.InsertSalesOrder({
            salesorder : this.form_salesorder,
            salesorder_items : this.form_salesorder_items
          })

            if(res.status === 'ok'){
              
              this.CloseSalesOrderModal()
            }
      },

      async UpdateSalesOrderForm(){

      }

  
    },

    mounted () {
        this.GetSalesOrders()
        this.GetSalesOrderItems()
        this.GetCustomers()
        this.GetProducts()
    },

  }
</script>

<style scoped>

  .wrapper-h{
    height : calc(100vh - 125px)
  }

</style>
