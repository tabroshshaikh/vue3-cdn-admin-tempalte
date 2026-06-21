import ProductFormContainer from '/src/js/components/ProductFormContainer.js';

export default {
  name: 'AddProduct',
  components: {
    ProductFormContainer,
  },
  props: {
    initialPayload: {
      type: Object,
      default: () => ({
      collect_fields: [
        { id: 'name', name: 'Name', type: 'text', locked: true },
        { id: 'email', name: 'Email Address', type: 'email', locked: true },
      ],
    }),
    },
  },
  data() {
    return {
      // defaultCollectFields: [
      //   { id: 'name', name: 'Name', type: 'text', locked: true },
      //   { id: 'email', name: 'Email Address', type: 'email', locked: true },
      // ],
    };
  },
  computed: {
    pageTitle() {
      return this.initialPayload?.product_uuid ? 'Edit Product' : 'Create New Product';
    },
    isEditMode() {
      return Boolean(this.initialPayload?.product_uuid);
    },
  },
  template: `
    <product-form-container
      :initial-payload="initialPayload"
      :is-edit-mode="isEditMode"
      :page-title="pageTitle"
    />
  `,
};
