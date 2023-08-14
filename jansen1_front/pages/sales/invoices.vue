<template>
  <div>
    
    <div class="has-background-pageheader px-4 py-2 w-full flex items-center justify-between border-b border-gray-200">

      <h3 class="has-text-header">Invoices</h3>
      <div class="flex items-center">
        <b-button type="is-primary" icon-left="plus" class="is-small text-white">New</b-button>
        <b-button type="is-primary" icon-left="playlist-edit" class="is-small ml-1">Edit</b-button>
      </div>
      
    </div>


    <div class="grid grid-cols-8 gap-4 p-4 has-background-pageheader">

      <div class="col-span-4 wrapper-h bg-white">

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

            :data="salesTransactions"
            :columns="tbl_salestransactions_columns">

            <template slot="top-left">
            </template>

          </b-table>
        </div>

        

      </div>

      <div class="col-span-4 wrapper-h bg-white">
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

            :data="salesTransactionItems"
            :columns="tbl_salestransaction_items_columns">

            <template slot="top-left">
            </template>

          </b-table>
        </div>
      </div>

    </div>

    <div class="grid grid-cols-8 gap-4 px-4 has-background-pageheader">
      <div class="col-span-8 wrapper-h bg-white">
        <div class="flex items-center justify-between has-background-primary p-2">
          <h3 class="font-bold text-white">Sales Invoice Form</h3>
          <div>
            <b-button class="is-light is-small">Deliver</b-button>
            <b-button class="is-light is-small">Close</b-button>
            <b-button class="is-light is-small">Cash Tend</b-button>
          </div>
        </div>
        
        <div class="flex text-sm">

          <div class="w-1/3 mx-2 my-2">
            <div class="flex mb-2 items-center">
              <p class="w-40">Sales Order #</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-40">Invoice #</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-40">Customer Code</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-40">Customer Name</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-40">Ship To</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
          </div>

          <div class="w-1/3 mx-2 my-2">
            <div class="flex mb-2 items-center">
              <p class="w-32">Date</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-32">Delivery Date</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-32">Balance</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-32">Terms</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
          </div>

          <div class="w-1/3 mx-2 my-2">
            <div class="flex mb-2 items-center">
              <p class="w-24">Net of VAT</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-24">VAT</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
            <div class="flex mb-2 items-center">
              <p class="w-24">Grand Total</p>
              <b-input type="is-primary" size="is-small"></b-input>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex'

  export default {


    components: {
      
    },

    computed: mapGetters({
        salesTransactions: 'sales/getSalesTransactions',
        salesTransactionItems: 'sales/getSalesTransactionItems',
    }),

    data() {
      return {

        tbl_salestransactions_columns : [
          { field: 'Or_no', label: 'OR No.'},
          // { field: 'transaction_date', label: 'Date', width: '150', sortable: true },
          { field: 'customer_id', label: 'CustomerId'},
          { field: 'transaction_type', label: 'Type'},
          { field: 'total_amount_due', label: 'Amount Due'},
          { field: 'invoice_no', label: 'Invoice No'},
          // { field: 'total_amount_tendered', label: 'Amount Tendered'},
          // { field: 'status', label: 'Status'},
      
        ],



        tbl_salestransaction_items_columns : [
          { field: 'qty', label: 'Qty', width: '150'},
          { field: 'product_id', label: 'Product', width: '40' },
          { field: 'price_per_unit', label: 'Price', width: '40' },
          { field: 'unit', label: 'Unit', width: '40' },
        ],


        form_invoice : {
          sales_order : null,
          invoice_no : null,
          customer_id : null,
          customer_name : null,
          ship_to : null,
          date : null,
          delivery_date : null,
          balance : null,
          terms : null,
          net_of_vat : null,
          vat : null,
          grand_total : null,
        }

      }
    },

    methods: {

      ...mapActions({
        GetSalesTransactions: 'sales/GetSalesTransactions',
        GetSalesTransactionItems: 'sales/GetSalesTransactionItems'
      }),

      ...mapMutations({
      
      }),

  
    },

    mounted () {
        this.GetSalesTransactions()
        this.GetSalesTransactionItems()
    },

  }
</script>

<style scoped>

  .wrapper-h{
    /* height : calc(100vh - 125px) */
    height : 300px;
  }

</style>
