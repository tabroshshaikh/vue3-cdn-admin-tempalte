import ProductFormContainer from '/src/js/components/ProductFormContainer.js';
import { normalizeProductPayload } from '/src/js/composables/useProductForm.js';
const { webService } = await import(`/src/js/utils/webService.js?v=${v}`);

export default {
  name: 'EditProduct',
  components: {
    ProductFormContainer,
  },
  data() {
    return {
      loading: false,
      error: null,
      productPayload: null,
    };
  },
  async mounted() {
    const uuid = this.$route?.params?.product_uuid || this.$route?.query?.product_uuid;
    console.log('Edit_Product mounted with uuid:', uuid);

    if (!uuid) {
      console.error('No product UUID found in route');
      this.error = 'Product ID not found';
      this.$router.push('/products');
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      console.log('Fetching product from API:', `/api/platform/product/${uuid}`);
      const resp = await webService.get(`/api/platform/product/${uuid}`);
      console.log('API Response:', resp);

      if (resp?.data?.code === 200 && resp.data.data) {
        console.log('Product data received:', resp.data.data);
        this.productPayload = this.normalizeProductResponse(resp.data.data);
        console.log('Normalized payload:', this.productPayload);
      } else {
        console.error('Invalid API response:', resp?.data);
        this.error = resp?.data?.message || 'Failed to load product';
      }
    } catch (err) {
      console.error('Failed to load product for edit:', err);
      this.error = err?.response?.data?.message || err.message || 'Failed to load product';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    normalizeProductResponse(data) {
      return normalizeProductPayload(data);
    },
  },
  template: `
    <div>
      <div v-if="loading" class="ap2-wrap">
        <div class="ap2-grid">
          <section class="ap2-form-area">
            <div>Loading product...</div>
          </section>
        </div>
      </div>
      <product-form-container v-else :initial-payload="productPayload" :is-edit-mode="true" page-title="Edit Product" />
    </div>
  `,
};
