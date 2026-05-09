import AdminLayout from '/src/js/components/layout/AdminLayout.js';
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js';

export default {
  name: 'EditProducts',
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  computed: {
    currentPageTitle() {
      return 'Edit Products';
    },
    productUuid() {
      return this.$route.params.product_uuid || '';
    },
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <div class="w-full space-y-6 lg:max-w-[70%]" style="width: 70%;">
      <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Edit Product</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Product UUID: <span class="font-medium text-gray-700 dark:text-gray-300">{{ productUuid }}</span>
        </p>
      </div>
    </div>
  </admin-layout>
  `,
};
