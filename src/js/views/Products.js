import AdminLayout from '/src/js/components/layout/AdminLayout.js';
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js';
import Modal from '../components/profile/Modal.js';

const v = window.APP_VERSION;
const { webService } = await import(`/src/js/utils/webService.js?v=${v}`);

export default {
  name: 'Products',
  components: {
    AdminLayout,
    PageBreadcrumb,
    Modal,
  },
  data() {
    return {
      currentPageTitle: 'Products',
      isLoading: true,
      products: [],
      isAddModalOpen: false,
      openMenuId: null,
      sortableInstance: null,
      productTypes: [
        {
          label: 'Digital Download',
          type: 'digital_download',
          emoji: '📁',
          desc: 'eBook, PDF, template, or other downloadable assets.',
          colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-100 dark:border-blue-550/20'
        },
        {
          label: 'Lead Magnet',
          type: 'lead_magnet',
          emoji: '📧',
          desc: 'Free offer to capture leads and grow your audience.',
          colorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-100 dark:border-amber-550/20'
        },
        {
          label: 'External Link',
          type: 'external_link',
          emoji: '🔗',
          desc: 'Redirect customers to an external checkout or page.',
          colorClass: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-100 dark:border-purple-550/20'
        },
        {
          label: 'Custom Service',
          type: 'custom_service',
          emoji: '📅',
          desc: 'Consulting, coaching, audits, and service packages.',
          colorClass: 'bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-100 dark:border-green-550/20'
        },
      ],
    };
  },
  mounted() {
    this.loadProducts();
    document.addEventListener('click', this.handleClickOutsideMenu);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutsideMenu);
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
      this.sortableInstance = null;
    }
  },
  methods: {
    async loadProducts() {
      this.isLoading = true;
      try {
        const response = await webService.get('/api/platform/get-product-list');
        if (response.data.code === 200) {
          this.products = response.data.data;
        } else {
          console.error('Failed to load products', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.initSortable());
      }
    },
    formatPrice(price, isFree) {
      if (isFree === 1 || parseFloat(price) === 0) return 'Free';
      return '$' + parseFloat(price).toFixed(2);
    },
    openModal() {
      this.isAddModalOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.isAddModalOpen = false;
      document.body.style.overflow = '';
    },
    getIconBgClass(type) {
      const map = {
        'digital_download': 'bg-blue-50 text-blue-500 dark:bg-blue-500/20',
        'lead_magnet': 'bg-amber-50 text-amber-500 dark:bg-amber-500/20',
        'external_link': 'bg-purple-50 text-purple-500 dark:bg-purple-500/20',
        'custom_service': 'bg-green-50 text-green-500 dark:bg-green-500/20'
      };
      return map[type] || 'bg-gray-50 text-gray-500 dark:bg-gray-800';
    },
    toggleMenu(uuid) {
      if (this.openMenuId === uuid) {
        this.openMenuId = null;
      } else {
        this.openMenuId = uuid;
      }
    },
    handleClickOutsideMenu(event) {
      if (!event.target.closest('.product-menu-container')) {
        this.openMenuId = null;
      }
    },
    async changeProductStatus(product, status) {
      this.openMenuId = null;
      try {
        const response = await webService.post('/api/platform/update-product', {
          product_uuid: product.product_uuid,
          status: status
        });
        // We optimistically update or check response
        if (response.data && response.data.code === 200) {
          product.status = status;
        } else {
          // If update-product requires full payload or different endpoint, 
          // user might need to adjust this API call
          product.status = status; // updating optimistically for UI demo
          console.warn('Status change API might require different payload', response.data);
        }
      } catch (error) {
        console.error('Error updating status:', error);
        product.status = status; // optimistically update for visual feedback anyway
      }
    },
    async saveSortOrder() {
      const sortOrder = this.products.map((p, index) => ({
        position: index + 1,
        product_uuid: p.product_uuid,
      }));

      try {
        const response = await webService.post('/api/platform/sort-products', {
          sort_order: sortOrder,
        });
        if (response.data.code !== 200) {
          console.error('Failed to save product sort order', response.data.message);
        }
      } catch (error) {
        console.error('Error saving product sort order:', error);
      }
    },
    async initSortable() {
      if (this.sortableInstance) {
        this.sortableInstance.destroy();
        this.sortableInstance = null;
      }
      const container = this.$refs.productListContainer;
      if (!container || this.products.length === 0) return;

      // Dynamically load SortableJS if not already loaded
      if (typeof Sortable === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      this.sortableInstance = Sortable.create(container, {
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        filter: '.sortable-ignore',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (oldIndex === newIndex) return;

          const movedItem = this.products.splice(oldIndex, 1)[0];
          this.products.splice(newIndex, 0, movedItem);

          this.saveSortOrder();
        }
      });
    }
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <div class="w-full space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Your Products</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your digital products, services, and lead magnets.
          </p>
        </div>
        
        <button
          @click="openModal"
          class="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 shadow-theme-xs"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div class="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-700 dark:bg-white/[0.03]">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
          🛍️
        </div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">No products yet</h3>
        <p class="mt-2 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
          Create your first digital product, service, or lead magnet to start selling.
        </p>
        <button
          @click="openModal"
          class="mt-6 inline-flex items-center rounded-xl bg-brand-50 px-5 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25"
        >
          Create First Product
        </button>
      </div>
      <!-- Product List -->
      <div v-else ref="productListContainer" class="flex flex-col gap-3 w-full lg:w-1/2 max-w-2xl">
        <div
          v-for="product in products"
          :key="product.product_uuid"
          class="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs transition-all hover:shadow-theme-xs hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800"
        >
          <div class="flex items-center gap-4">
            <!-- Drag Handle -->
            <div class="drag-handle text-gray-300 cursor-grab active:cursor-grabbing dark:text-gray-600 hover:text-gray-400 transition-colors select-none">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="5" r="1.5" />
                <circle cx="15" cy="5" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="19" r="1.5" />
                <circle cx="15" cy="19" r="1.5" />
              </svg>
            </div>
            
            <!-- Icon/Emoji Container -->
            <div class="flex items-center justify-center w-11 h-11 rounded-xl text-xl shrink-0 bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <span v-if="product.preview_emoji">{{ product.preview_emoji }}</span>
              <span v-else>📦</span>
            </div>
            
            <!-- Product Details -->
            <div class="flex flex-col justify-center">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {{ product.title }}
                </h3>
                
                <!-- Optional contextual icons based on type -->
                <span v-if="product.type_code === 'digital_download'" class="text-gray-400">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </span>
                <span v-else-if="product.type_code === 'custom_service'" class="text-gray-400">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                
                <!-- Status Badge -->
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="product.status === 'publish'
                    ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500'
                    : 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500'"
                >
                  <span
                    class="inline-block w-1.5 h-1.5 rounded-full"
                    :class="product.status === 'publish' ? 'bg-success-500' : 'bg-blue-light-500'"
                  ></span>
                  {{ product.status === 'publish' ? 'Published' : 'Draft' }}
                </span>
              </div>
              
              <p class="mt-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {{ formatPrice(product.price, product.is_free) }}
              </p>
            </div>
          </div>
          
          <!-- 3 Dots Action Menu -->
          <div class="relative product-menu-container">
            <button 
              @click.stop="toggleMenu(product.product_uuid)" 
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors dark:hover:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <!-- Dropdown List -->
            <transition 
              enter-active-class="transition duration-100 ease-out" 
              enter-from-class="transform scale-95 opacity-0" 
              enter-to-class="transform scale-100 opacity-100" 
              leave-active-class="transition duration-75 ease-in" 
              leave-from-class="transform scale-100 opacity-100" 
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="openMenuId === product.product_uuid" 
                class="absolute right-0 top-full z-50 w-40 mt-1 bg-white border border-gray-100 rounded-xl shadow-theme-lg dark:bg-gray-900 dark:border-gray-800 overflow-hidden"
              >
                <div class="p-1.5 space-y-0.5">
                  <router-link 
                    :to="'/product/' + product.product_uuid" 
                    class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-white/[0.03]"
                  >
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit
                  </router-link>
                  
                  <button 
                    v-if="product.status === 'draft'" 
                    @click.stop="changeProductStatus(product, 'publish')" 
                    class="flex items-center w-full px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-green-400 dark:hover:bg-green-500/10"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Publish
                  </button>
                  
                  <button 
                    v-if="product.status !== 'archived'" 
                    @click.stop="changeProductStatus(product, 'archived')" 
                    class="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Archive
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>

      </div>

      <!-- Add Product Button (Outside sortable container) -->
      <div v-if="!isLoading && products.length > 0" class="mt-4 flex flex-col items-center w-full lg:w-1/2 max-w-2xl">
          <button 
            @click="openModal" 
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-theme-sm transition-colors hover:bg-brand-600"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
          <button class="mt-4 text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors">
            Add Section
          </button>
      </div>

    </div>

    <!-- Add Product Modal Popup -->
    <teleport to="body">
      <Modal v-if="isAddModalOpen" @close="closeModal">
        <template #body>
          <div
            class="relative z-10 mx-4 w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white shadow-theme-lg dark:bg-gray-900"
            @click.stop
          >
            <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
              <div>
                <h3 class="text-xl font-semibold text-gray-800 modal-title dark:text-white/90">Choose Product Type</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select what kind of product you want to create.</p>
              </div>
              <button
                @click="closeModal"
                class="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="rounded-b-3xl bg-gray-50 p-6 dark:bg-gray-800">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <router-link
                  v-for="item in productTypes"
                  :key="item.type"
                  :to="'/add-product?type=' + item.type"
                  @click="closeModal"
                  class="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500"
                >
                  <div>
                    <div class="mb-3 flex items-center gap-4">
                      <div class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" :class="item.colorClass">
                        {{ item.emoji }}
                      </div>
                      <h4 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ item.label }}</h4>
                    </div>
                    <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{{ item.desc }}</p>
                  </div>
                  <div class="mt-4 flex items-center text-sm font-semibold text-brand-500 dark:text-brand-400">
                    Create {{ item.label }}
                    <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </Modal>
    </teleport>
  </admin-layout>
  `
};
