import AdminLayout from '/src/js/components/layout/AdminLayout.js';
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js';

export default {
  name: 'Products',
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  data() {
    return {
      currentPageTitle: 'Products',
      productTypes: [
        { label: 'Digital Download', type: 'digital_download' },
        { label: 'Lead Magnet', type: 'lead_magnet' },
        { label: 'External Link', type: 'external_link' },
        { label: 'Custom Service', type: 'custom_service' },
      ],
    };
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <div class="w-full space-y-6 lg:max-w-[70%]" style="width: 70%;">
      <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Products</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select a product type to create a new product.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <router-link
          v-for="item in productTypes"
          :key="item.type"
          :to="'/add-product?type=' + item.type"
          class="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ item.label }}</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Type: {{ item.type }}</p>
        </router-link>
      </div>
    </div>
  </admin-layout>
  `,
};
