import ProductFormContainer from '/src/js/components/ProductFormContainer.js';
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
      if (!data) return null;

      const typeRecord = data.type_record || {};
      const fileUrl = typeRecord.file_url || data.file_url || '';
      const fileLabel = typeRecord.file_name || data.file_name || '';

      return {
        product_id: data.product_id,
        product_uuid: data.product_uuid,
        store_id: data.store_id,
        type_code: data.type_code,
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        description: data.description,
        cta_text: data.cta_text,
        price: data.price,
        compare_at_price: data.compare_at_price,
        is_free: data.is_free,
        is_featured: data.is_featured,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        status: data.status,
        ui_type: data.type_code,
        card_style: data.card_style,
        preview_emoji: data.preview_emoji,
        preview_background: data.preview_background,
        builder_config: {
          ui_type: data.type_code,
          card_style: data.card_style,
          preview_emoji: data.preview_emoji,
          preview_background: data.preview_background,
          headline: data.headline,
          publish_immediately: data.publish_immediately || (data.status === 'publish'),
          scheduled_publish_at: data.scheduled_publish_at,
          file_delivery_type: typeRecord.file_delivery_type || 'upload',
          file_url: fileUrl,
          file_label: fileLabel,
          external_url: data.external_url,
          external_label: data.external_label,
          seo: {
            meta_title: data.meta_title,
            meta_description: data.meta_description,
          },
          social_proof: {
            enable_reviews: data.enable_reviews !== undefined ? data.enable_reviews : true,
          },
          marketing_automation: {
            email_flows: data.email_flows || false,
            order_bumps: data.order_bumps || false,
            affiliate_share: data.affiliate_share || false,
            upsell_after_purchase: data.upsell_after_purchase || false,
          },
          confirmation_email: {
            subject: data.email_subject,
            body: data.email_body,
          },
          type_settings: data.type_settings || {},
          collect_fields: data.collect_fields || [],
        },
      };
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
