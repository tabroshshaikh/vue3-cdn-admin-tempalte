import AdminLayout from '/src/js/components/layout/AdminLayout.js'
import EcommerceMetrics from '/src/js/components/ecommerce/EcommerceMetrics.js'
import MonthlySale from '/src/js/components/ecommerce/MonthlySale.js'
import MonthlyTarget from '/src/js/components/ecommerce/MonthlyTarget.js'
import CustomerDemographic from '/src/js/components/ecommerce/CustomerDemographic.js'
import StatisticsChart from '/src/js/components/ecommerce/StatisticsChart.js'
import RecentOrders from '/src/js/components/ecommerce/RecentOrders.js'

export default {
  name: 'Ecommerce',
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlySale,
    MonthlyTarget,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  template: `
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
        <monthly-sale />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-target />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
  `
}
