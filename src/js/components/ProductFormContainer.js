import AdminLayout from '/src/js/components/layout/AdminLayout.js';
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js';
import ProductThumbnailTab from '/src/js/components/product/ProductThumbnailTab.js';
import ProductCheckoutTab from '/src/js/components/product/ProductCheckoutTab.js';
import ProductOptionsTab from '/src/js/components/product/ProductOptionsTab.js';
import ProductStorePreview from '/src/js/components/product/ProductStorePreview.js';
import {
  createProductForm,
  normalizeBadgeColor,
  normalizeProductPayload,
} from '/src/js/composables/useProductForm.js';

const { webService } = await import(`/src/js/utils/webService.js?v=${v}`);
const { env } = await import(`/src/js/config/env.js?v=${v}`);

export default {
  name: 'ProductFormContainer',
  components: {
    AdminLayout,
    PageBreadcrumb,
    ProductThumbnailTab,
    ProductCheckoutTab,
    ProductOptionsTab,
    ProductStorePreview,
  },
  props: {
    initialPayload: {
      type: Object,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    pageTitle: {
      type: String,
      default: 'Create New Product',
    }
  },
  data() {
    const pf = createProductForm();
    return Object.assign(pf, {
      currentPageTitle: this.pageTitle,
      isSubmitting: false,
      slugEditedManually: false,
      activeTab: 'thumb',
      previewMode: 'card',
      firstStepSaved: this.isEditMode,
      addFieldOptions: [
        { label: 'Phone', name: 'Phone Number', type: 'phone' },
        { label: 'Company', name: 'Company', type: 'text' },
        { label: 'Source', name: 'How did you find us?', type: 'dropdown' },
        { label: 'Custom', name: 'Custom Question', type: 'text' },
      ],
    });
  },
  computed: {
    routeType() {
      return String(this.$route?.query?.type || '').trim();
    },
    selectedType() {
      const list = Array.isArray(this.productTypes) ? this.productTypes : [];
      return list.find((item) => item.id === this.uiType) || list[0] || { id: '', apiType: null, emoji: '', name: '' };
    },
    isTypeSupported() {
      return Boolean(this.selectedType.apiType);
    },
    canAccessLaterTabs() {
      return this.isEditMode || this.firstStepSaved;
    },
    shortDescriptionLength() {
      return this.form.subtitle.length;
    },
    showFileCard() {
      return this.uiType === 'digital_download';
    },
    previewTitle() {
      return this.form.title.trim() || 'Add a title above ->';
    },
    previewSubtitle() {
      return this.form.subtitle.trim() || 'Your subtitle goes here';
    },
    previewPrice() {
      if (this.form.isFree) {
        return 'FREE';
      }
      const value = Number(this.form.price);
      if (!Number.isNaN(value) && this.form.price !== '') {
        return `$${value.toFixed(2)}`;
      }
      return '$0.00';
    },
    previewCompareAtPrice() {
      if (this.form.isFree) {
        return '';
      }
      const value = Number(this.form.compareAtPrice);
      if (!Number.isNaN(value) && this.form.compareAtPrice !== '') {
        return `$${value.toFixed(2)}`;
      }
      return '';
    },
    previewDescription() {
      const value = (this.form.description || '').trim();
      if (!value) {
        return 'Your description will appear here to help convince buyers.';
      }
      return value.length > 100 ? `${value.slice(0, 100)}...` : value;
    },
    previewHeadline() {
      return this.form.headline.trim() || 'Add your headline ->';
    },
    previewCardClasses() {
      return ['ap2-pcard'];
    },
    previewTypeLabel() {
      return String(this.selectedType?.name || '').toUpperCase();
    },
    previewCalloutCardStyle() {
      return {
        background: this.emojiBackground,
      };
    },
    previewCalloutImageStyle() {
      return {
        background: 'rgba(255,255,255,0.16)',
        color: '#fff',
        height: '132px',
        fontSize: '44px',
        position: 'relative',
      };
    },
    previewClassicImageStyle() {
      return {
        background: this.emojiBackground,
        color: '#fff',
        height: '96px',
        fontSize: '36px',
        borderBottom: '1px solid #E5E7EB',
      };
    },
    previewButtonImageStyle() {
      return {
        background: this.emojiBackground,
        color: '#fff',
        height: '84px',
        fontSize: '34px',
        borderRadius: '12px',
        marginBottom: '10px',
      };
    },
    nextButtonLabel() {
      if (this.activeTab === 'thumb') {
        return 'Next: Checkout ->';
      }
      if (this.activeTab === 'checkout') {
        return 'Next: Options ->';
      }
      if (this.isEditMode) {
        return 'Update Product';
      }
      return this.form.publishImmediately ? 'Publish Product' : 'Save as Draft';
    },
    showTypeSettings() {
      return ['custom_service', 'lead_magnet', 'external_link'].includes(this.uiType);
    },
    typeSettingsTitle() {
      if (this.uiType === 'custom_service') {
        return '📅 Coaching Settings';
      }
      if (this.uiType === 'lead_magnet') {
        return '📧 Lead Magnet Settings';
      }
      if (this.uiType === 'external_link') {
        return '🔗 External Link Settings';
      }
      return 'Type Settings';
    },
  },
  mounted() {
    if (this.initialPayload) {
      const typeCode = this.initialPayload.type_code || this.initialPayload.ui_type;
      if (typeCode) {
        this.uiType = typeCode;
        const matchedType = this.productTypes.find((item) => item.id === typeCode);
        if (matchedType) {
          this.emoji = matchedType.emoji;
          const emojiOption = this.emojiOptions.find((option) => option.emoji === matchedType.emoji);
          if (emojiOption) {
            this.emojiBackground = emojiOption.bg;
          }
        }
      } else if (!this.isEditMode) {
        this.setTypeFromQuery();
      }
    } else {
      if (!this.isEditMode) {
        this.setTypeFromQuery();
      }
    }

    this.$nextTick(() => {
      if (this.initialPayload) {
        try {
          this.hydrateFromPayload(this.initialPayload);
          if (this.initialPayload.product_uuid) {
            this.draftProductUuid = this.initialPayload.product_uuid;
            this.firstStepSaved = true;
          }
        } catch (err) {
          console.warn('Failed to hydrate initial payload', err);
        }
      }
    });
  },
  watch: {
    '$route.query.type'() {
      if (!this.isEditMode) {
        this.setTypeFromQuery();
      }
    },
  },
  methods: {
    setTypeFromQuery() {
      if (!this.routeType) {
        alert('No product type specified in the URL. Please choose a product type from the product list.');
        this.$router.push('/products');
        return;
      }
      const matchedType = this.productTypes.find((item) => item.id === this.routeType);
      if (!matchedType) {
        this.showToast('error', 'Invalid product type. Please choose from product list.');
        this.$router.push('/products');
        return;
      }
      this.selectType(matchedType.id);
    },
    showToast(type, message, duration = 3500) {
      if (typeof toast === 'function') {
        toast({ type, message, duration });
      }
    },
    resolveProductUuidFromResponse(responseData) {
      const data = responseData?.data || {};
      return data.product_uuid || '';
    },
    getProductEndpoint() {
      return this.draftProductUuid ? '/api/platform/update-product' : '/api/platform/add-product';
    },
    slugify(value) {
      return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
    },
    isValidUrl(value) {
      try {
        new URL(value);
        return true;
      } catch (error) {
        return false;
      }
    },
    selectType(typeId) {
      const type = this.productTypes.find((item) => item.id === typeId);
      if (!type) {
        return;
      }
      this.uiType = type.id;
      this.emoji = type.emoji;
      const emojiOption = this.emojiOptions.find((option) => option.emoji === type.emoji);
      if (emojiOption) {
        this.emojiBackground = emojiOption.bg;
      }
      if (this.uiType === 'lead_magnet') {
        this.form.ctaText = 'Get Free Access';
      } else if (this.uiType === 'custom_service') {
        this.form.ctaText = 'Book Now';
      } else if (!this.form.ctaText.trim()) {
        this.form.ctaText = 'Get Instant Access';
      }
      this.clearValidation('type');
      this.validateFileUrl();
      this.validateExternalUrl();
      this.validateLeadMagnetRedirectUrl();
      this.validateServiceMeetingUrl();
    },
    switchTab(tabName) {
      if (tabName !== 'thumb' && !this.canAccessLaterTabs) {
        return;
      }

      this.activeTab = tabName;
      if (tabName === 'checkout') {
        this.previewMode = 'checkout';
      } else {
        this.previewMode = 'card';
      }
    },
    scrollFormToTop() {
      this.$nextTick(() => {
        const tabContent = this.$el?.querySelector?.('.ap2-tab-content');
        if (tabContent) {
          tabContent.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const formBuilder = this.$el?.querySelector?.('.ap2-wrap');
        formBuilder?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      });
    },
    validateDraftForCurrentTab() {
      const validators = [
        this.validateSupportedType(),
        this.validateTitle(),
        this.validateSubtitle(),
        this.validateSlug(),
        this.validateCtaText(),
      ];

      if (this.activeTab === 'checkout') {
        validators.push(this.validateDescription());
        validators.push(this.validatePrice());
        validators.push(this.validateCompareAtPrice());
        validators.push(this.validateFileUrl());
        if (this.uiType === 'external_link') {
          validators.push(this.validateExternalUrl());
        }
        if (this.uiType === 'custom_service') {
          validators.push(this.validateServiceMeetingUrl());
        }
        if (this.uiType === 'lead_magnet') {
          validators.push(this.validateLeadMagnetRedirectUrl());
        }
      }

      const isValid = validators.every(Boolean);
      if (!isValid) {
        const pendingFields = Object.keys(this.validation).filter((key) =>
          this.validation[key]?.status === 'error'
        );

        console.log('Draft validation failed for current tab', {
          tab: this.activeTab,
          uiType: this.uiType,
          pendingFields,
          validation: this.validation,
        });
      }

      return isValid;
    },
    async saveFormAndContinue() {
      this.resetValidationState();
      if (!this.validateDraftForCurrentTab()) {
        this.showToast('error', 'Please fix the highlighted fields.');
        return false;
      }

      this.isSubmitting = true;
      try {
        const payload = this.buildPayload('draft');
        const endpoint = this.getProductEndpoint();
        const response = await webService.post(endpoint, payload);

        if (response.data.code === 200) {
          const responseProductUuid = this.resolveProductUuidFromResponse(response.data);
          if (responseProductUuid) {
            this.draftProductUuid = responseProductUuid;
          }
          this.showToast('success', response.data.message || 'Form saved.');
          return true;
        }

        if (response.data.code === 600) {
          this.handleValidationErrors(response.data.errors);
          this.showToast('error', response.data.message || 'Please fix the highlighted validation errors.');
          return false;
        }

        this.showToast('error', response.data.message || 'Failed to save form. Please try again.');
        return false;
      } catch (error) {
        const apiErrors = error?.response?.data?.errors || null;
        if (apiErrors) {
          this.handleValidationErrors(apiErrors);
        }
        this.showToast('error', error?.response?.data?.message || 'Request failed while saving form.');
        return false;
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleNextAction() {
      if (this.activeTab === 'thumb' || this.activeTab === 'checkout') {
        const completedTab = this.activeTab;
        const success = await this.saveFormAndContinue();
        if (success) {
          if (completedTab === 'thumb' && !this.isEditMode) {
            this.firstStepSaved = true;
          }
          this.switchTab(completedTab === 'thumb' ? 'checkout' : 'options');
          this.scrollFormToTop();
        }
        return;
      }
      this.submitProduct();
    },
    switchPreviewMode(mode) {
      this.previewMode = mode;
    },
    selectCardStyle(style) {
      this.cardStyle = style;
    },
    selectEmoji(option) {
      this.emoji = option.emoji;
      this.emojiBackground = option.bg;
    },
    async handleThumbnailUpload(croppedBlob) {
      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append('thumbnail', croppedBlob, 'thumbnail.jpg');
        if (this.draftProductUuid) {
          formData.append('product_uuid', this.draftProductUuid);
        }

        const response = await webService.post('/api/platform/upload-media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.code === 200 && response.data.data?.thumbnail_url) {
          const rawPath = response.data.data.thumbnail_url;
          this.form.thumbnailUrl = `${env.BASE_URL}/${rawPath}`;
          this.form.thumbnail = rawPath;
          this.showToast('success', 'Thumbnail uploaded successfully.');
        } else {
          this.showToast('error', response.data.message || 'Failed to upload thumbnail.');
        }
      } catch (error) {
        console.error('Error uploading thumbnail:', error);
        this.showToast('error', error?.response?.data?.message || 'Failed to upload thumbnail.');
      } finally {
        this.isSubmitting = false;
      }
    },
    handleThumbnailRemove() {
      this.form.thumbnail = '';
      this.form.thumbnailUrl = '';
    },
    async handleCheckoutBannerUpload(croppedBlob) {
      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append('checkout_banner', croppedBlob, 'checkout_banner.jpg');
        if (this.draftProductUuid) {
          formData.append('product_uuid', this.draftProductUuid);
        }

        const response = await webService.post('/api/platform/upload-media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.code === 200 && response.data.data?.checkout_banner_url) {
          const rawPath = response.data.data.checkout_banner_url;
          this.form.checkoutBannerUrl = `${env.BASE_URL}/${rawPath}`;
          this.form.checkoutBanner = rawPath;
          this.showToast('success', 'Checkout banner uploaded successfully.');
        } else {
          this.showToast('error', response.data.message || 'Failed to upload checkout banner.');
        }
      } catch (error) {
        console.error('Error uploading checkout banner:', error);
        this.showToast('error', error?.response?.data?.message || 'Failed to upload checkout banner.');
      } finally {
        this.isSubmitting = false;
      }
    },
    handleCheckoutBannerRemove() {
      this.form.checkoutBanner = '';
      this.form.checkoutBannerUrl = '';
    },
    async handleProductFileUpload(file) {
      if (!this.draftProductUuid) {
        this.showToast('error', 'Please save the product first before uploading a file.');
        return;
      }

      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append('product_uuid', this.draftProductUuid);
        formData.append('file', file);

        const response = await webService.post('/api/platform/upload-media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.code === 200) {
          const filePath = response.data.data?.file_url || response.data.data?.url || '';
          if (filePath) {
            this.form.fileUrl = '';
            this.form.productFileUrl = `${env.BASE_URL}/${filePath}`;
            this.form.fileName = '';
            this.showToast('success', 'File uploaded successfully.');
          } else {
            this.showToast('error', 'Failed to get file URL from response.');
          }
        } else {
          this.showToast('error', response.data.message || 'Failed to upload file.');
        }
      } catch (error) {
        console.error('Error uploading product file:', error);
        this.showToast('error', error?.response?.data?.message || 'Failed to upload file.');
      } finally {
        this.isSubmitting = false;
      }
    },
    handleProductFileRemove() {
      this.form.fileUrl = '';
      this.form.productFileUrl = '';
      this.form.fileName = '';
    },
    onTitleInput() {
      if (!this.slugEditedManually || !this.form.slug.trim()) {
        this.form.slug = this.slugify(this.form.title);
      }
      this.validateTitle();
      this.validateSlug();
    },
    onSlugInput() {
      this.slugEditedManually = true;
      this.form.slug = this.slugify(this.form.slug);
      this.validateSlug();
    },
    onShortDescriptionInput() {
      if (this.form.subtitle.length > 100) {
        this.form.subtitle = this.form.subtitle.slice(0, 100);
      }
      this.validateSubtitle();
    },
    toggleFreeProduct() {
      if (this.form.isFree) {
        this.form.price = '0.00';
        this.form.compareAtPrice = '0.00';
      } else {
        if (this.form.price === '0.00') {
          this.form.price = '';
        }
        if (this.form.compareAtPrice === '0.00') {
          this.form.compareAtPrice = '';
        }
      }
      this.validatePrice();
      this.validateCompareAtPrice();
    },
    selectFileType(type) {
      const prevType = this.form.fileDeliveryType;
      this.form.fileDeliveryType = type;

      if (prevType === 'upload' && type === 'url') {
        this._savedUploadFile = {
          fileUrl: this.form.fileUrl,
          fileName: this.form.fileName,
          productFileUrl: this.form.productFileUrl,
        };
        this.form.fileUrl = '';
        this.form.fileName = '';
      } else if (prevType === 'url' && type === 'upload') {
        this.form.fileUrl = '';
        this.form.fileName = '';
        if (this._savedUploadFile) {
          this.form.fileUrl = this._savedUploadFile.fileUrl;
          this.form.fileName = this._savedUploadFile.fileName;
          this.form.productFileUrl = this._savedUploadFile.productFileUrl;
          this._savedUploadFile = null;
        }
      }

      this.validateFileUrl();
      this.validateFileName();
    },
    onPublishImmediatelyChange() {
      if (this.form.publishImmediately) {
        this.form.scheduledPublishAt = '';
      }
    },
    addCollectField(option) {
      this.collectFields.push({
        id: `${option.type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: option.name,
        type: option.type,
        locked: false,
      });
    },
    removeCollectField(index) {
      if (!this.collectFields[index] || this.collectFields[index].locked) {
        return;
      }
      this.collectFields.splice(index, 1);
    },
    inputClasses(field) {
      const base = 'ap2-input';
      const status = this.validation[field]?.status;
      if (status === 'error') {
        return `${base} ap2-input-error`;
      }
      if (status === 'success') {
        return `${base} ap2-input-success`;
      }
      return base;
    },
    textareaClasses(field) {
      const base = 'ap2-input ap2-textarea';
      const status = this.validation[field]?.status;
      if (status === 'error') {
        return `${base} ap2-input-error`;
      }
      if (status === 'success') {
        return `${base} ap2-input-success`;
      }
      return base;
    },
    setValidationState(field, status, message = '') {
      this.validation[field] = { status, message };
    },
    clearValidation(field) {
      this.validation[field] = { status: null, message: '' };
    },
    validateSupportedType() {
      if (!this.selectedType.apiType) {
        this.setValidationState('type', 'error', 'This product type is not yet supported by API.');
        return false;
      }
      this.setValidationState('type', 'success', '');
      return true;
    },
    validateTitle() {
      const value = this.form.title.trim();
      if (!value) {
        this.setValidationState('title', 'error', 'Product title is required.');
        return false;
      }
      if (value.length > 80) {
        this.setValidationState('title', 'error', 'Please keep title within 80 characters.');
        return false;
      }
      this.setValidationState('title', 'success', '');
      return true;
    },
    validateSubtitle() {
      const value = this.form.subtitle.trim();
      if (!value) {
        this.setValidationState('subtitle', 'error', 'Short description is required.');
        return false;
      }
      if (value.length > 100) {
        this.setValidationState('subtitle', 'error', 'Short description must be 100 characters or less.');
        return false;
      }
      this.setValidationState('subtitle', 'success', '');
      return true;
    },
    validateSlug() {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      const value = this.form.slug.trim();
      if (!value) {
        this.setValidationState('slug', 'error', 'Slug is required.');
        return false;
      }
      if (!slugRegex.test(value)) {
        this.setValidationState('slug', 'error', 'Slug can contain lowercase letters, numbers, and hyphens only.');
        return false;
      }
      this.setValidationState('slug', 'success', '');
      return true;
    },
    validateDescription() {
      const value = this.form.description.trim();
      if (!value) {
        this.setValidationState('description', 'error', 'Description is required.');
        return false;
      }
      this.setValidationState('description', 'success', '');
      return true;
    },
    validateCtaText() {
      if (!this.form.ctaText.trim()) {
        this.setValidationState('ctaText', 'error', 'CTA button text is required.');
        return false;
      }
      this.setValidationState('ctaText', 'success', '');
      return true;
    },
    validatePrice() {
      if (this.form.isFree) {
        this.setValidationState('price', 'success', '');
        return true;
      }
      const value = Number(this.form.price);
      if (this.form.price === '' || Number.isNaN(value)) {
        this.setValidationState('price', 'error', 'Price is required.');
        return false;
      }
      if (value < 0) {
        this.setValidationState('price', 'error', 'Price cannot be negative.');
        return false;
      }
      this.setValidationState('price', 'success', '');
      return true;
    },
    validateCompareAtPrice() {
      if (this.form.isFree) {
        this.setValidationState('compareAtPrice', 'success', '');
        return true;
      }
      const value = Number(this.form.compareAtPrice);
      const currentPrice = Number(this.form.price);
      if (this.form.compareAtPrice === '' || Number.isNaN(value)) {
        this.setValidationState('compareAtPrice', 'error', 'Compare-at price is required.');
        return false;
      }
      if (value < 0) {
        this.setValidationState('compareAtPrice', 'error', 'Compare-at price cannot be negative.');
        return false;
      }
      if (!Number.isNaN(currentPrice) && value < currentPrice) {
        this.setValidationState('compareAtPrice', 'error', 'Compare-at price should be greater than or equal to price.');
        return false;
      }
      this.setValidationState('compareAtPrice', 'success', '');
      return true;
    },
    validateFileUrl() {
      if (!this.showFileCard) {
        this.setValidationState('fileUrl', 'success', '');
        this.setValidationState('fileName', 'success', '');
        return true;
      }

      if (this.form.fileDeliveryType === 'url') {
        const urlValue = this.form.fileUrl.trim();
        const nameValue = this.form.fileName.trim();
        let valid = true;

        if (!urlValue) {
          this.setValidationState('fileUrl', 'error', 'Destination URL is required for URL delivery.');
          valid = false;
        } else if (!this.isValidUrl(urlValue)) {
          this.setValidationState('fileUrl', 'error', 'Please enter a valid URL.');
          valid = false;
        } else {
          this.setValidationState('fileUrl', 'success', '');
        }

        if (!nameValue) {
          this.setValidationState('fileName', 'error', 'File / Product Name is required for URL delivery.');
          valid = false;
        } else {
          this.setValidationState('fileName', 'success', '');
        }

        return valid;
      }

      if (this.form.fileDeliveryType === 'upload') {
        if (!this.form.fileUrl) {
          this.setValidationState('fileUrl', 'error', 'Please upload a product file.');
          return false;
        }
      }

      this.setValidationState('fileUrl', 'success', '');
      this.setValidationState('fileName', 'success', '');
      return true;
    },
    validateFileName() {
      if (!this.showFileCard || this.form.fileDeliveryType !== 'url') {
        this.setValidationState('fileName', 'success', '');
        return true;
      }
      const value = this.form.fileName.trim();
      if (!value) {
        this.setValidationState('fileName', 'error', 'File / Product Name is required for URL delivery.');
        return false;
      }
      this.setValidationState('fileName', 'success', '');
      return true;
    },
    validateExternalUrl() {
      if (this.uiType !== 'external_link') {
        this.setValidationState('externalUrl', 'success', '');
        return true;
      }
      const value = this.form.externalUrl.trim();
      if (!value) {
        this.setValidationState('externalUrl', 'error', 'Destination URL is required for external links.');
        return false;
      }
      if (!this.isValidUrl(value)) {
        this.setValidationState('externalUrl', 'error', 'Please enter a valid destination URL.');
        return false;
      }
      this.setValidationState('externalUrl', 'success', '');
      return true;
    },
    validateLeadMagnetRedirectUrl() {
      if (this.uiType !== 'lead_magnet') {
        this.setValidationState('leadMagnetRedirectUrl', 'success', '');
        return true;
      }
      const value = this.form.leadMagnetRedirectUrl.trim();
      if (!value) {
        this.setValidationState('leadMagnetRedirectUrl', 'success', '');
        return true;
      }
      if (!this.isValidUrl(value)) {
        this.setValidationState('leadMagnetRedirectUrl', 'error', 'Please enter a valid redirect URL.');
        return false;
      }
      this.setValidationState('leadMagnetRedirectUrl', 'success', '');
      return true;
    },
    validateServiceMeetingUrl() {
      if (this.uiType !== 'custom_service') {
        this.setValidationState('serviceMeetingUrl', 'success', '');
        return true;
      }
      const value = this.form.serviceMeetingUrl.trim();
      if (!value) {
        this.setValidationState('serviceMeetingUrl', 'success', '');
        return true;
      }
      if (!this.isValidUrl(value)) {
        this.setValidationState('serviceMeetingUrl', 'error', 'Please enter a valid meeting URL.');
        return false;
      }
      this.setValidationState('serviceMeetingUrl', 'success', '');
      return true;
    },
    validateForm() {
      const validators = [
        { name: 'type', result: this.validateSupportedType() },
        { name: 'title', result: this.validateTitle() },
        { name: 'subtitle', result: this.validateSubtitle() },
        { name: 'slug', result: this.validateSlug() },
        { name: 'description', result: this.validateDescription() },
        { name: 'ctaText', result: this.validateCtaText() },
        { name: 'price', result: this.validatePrice() },
        { name: 'compareAtPrice', result: this.validateCompareAtPrice() },
        { name: 'fileUrl', result: this.validateFileUrl() },
        { name: 'fileName', result: this.validateFileName() },
        { name: 'externalUrl', result: this.validateExternalUrl() },
        { name: 'leadMagnetRedirectUrl', result: this.validateLeadMagnetRedirectUrl() },
        { name: 'serviceMeetingUrl', result: this.validateServiceMeetingUrl() },
      ];
      const failed = validators.filter((v) => !v.result);
      if (failed.length) {
        console.log('Validation failed for:', failed.map((v) => v.name), 'uiType:', this.uiType);
      }
      return validators.every((v) => v.result);
    },
    resetValidationState() {
      Object.keys(this.validation).forEach((key) => {
        this.validation[key] = { status: null, message: '' };
      });
    },
    handleValidationErrors(errors) {
      if (!errors) {
        return;
      }
      const fieldMap = {
        title: 'title',
        slug: 'slug',
        short_description: 'subtitle',
        description: 'description',
        cta_text: 'ctaText',
        price: 'price',
        compare_at_price: 'compareAtPrice',
        destination_url: 'externalUrl',
        file_url: 'fileUrl',
        file_name: 'fileName',
        redirect_url: 'leadMagnetRedirectUrl',
        meeting_url: 'serviceMeetingUrl',
      };
      Object.keys(errors).forEach((apiField) => {
        const localField = fieldMap[apiField];
        if (!localField || !this.validation[localField]) {
          return;
        }
        const messageList = errors[apiField];
        this.validation[localField] = {
          status: 'error',
          message: Array.isArray(messageList) && messageList.length ? messageList[0] : 'Invalid value.',
        };
      });
    },
    buildTypeSettings() {
      const typeSettings = {};
      if (this.uiType === 'custom_service') {
        typeSettings.session_duration = this.form.serviceSessionDuration || null;
        typeSettings.platform = this.form.servicePlatform || null;
        typeSettings.buffer_before = this.form.serviceBufferBefore || null;
        typeSettings.buffer_after = this.form.serviceBufferAfter || null;
        typeSettings.max_bookings_per_day = this.form.serviceMaxBookingsPerDay || null;
        typeSettings.advance_booking_days = this.form.serviceAdvanceBookingDays || null;
        typeSettings.meeting_url = this.form.serviceMeetingUrl.trim() || null;
      } else if (this.uiType === 'lead_magnet') {
        typeSettings.cta_label = this.form.leadMagnetCtaLabel.trim() || null;
        typeSettings.success_message = this.form.leadMagnetSuccessMessage.trim() || null;
        typeSettings.redirect_url = this.form.leadMagnetRedirectUrl.trim() || null;
      } else if (this.uiType === 'external_link') {
        typeSettings.destination_url = this.form.externalUrl.trim() || null;
        typeSettings.link_label = this.form.externalLabel.trim() || null;
        typeSettings.show_after_purchase = this.form.externalShowAfterPurchase;
      }
      return typeSettings;
    },
    buildPayload(saveMode = 'publish') {
      const numericPrice = Number(this.form.price);
      const numericCompareAtPrice = Number(this.form.compareAtPrice);
      const isDraftMode = saveMode === 'draft';
      const payload = {
        save_mode: saveMode,
        type_code: this.selectedType.apiType,
        title: this.form.title.trim(),
        slug: this.form.slug.trim(),
        short_description: this.form.subtitle.trim(),
        description: this.form.description.trim(),
        cta_text: this.form.ctaText.trim(),
        price: this.form.isFree ? 0 : (isDraftMode && this.form.price === '' ? null : (Number.isNaN(numericPrice) ? null : numericPrice)),
        compare_at_price: this.form.isFree ? 0 : (isDraftMode && this.form.compareAtPrice === '' ? null : (Number.isNaN(numericCompareAtPrice) ? null : numericCompareAtPrice)),
        is_free: this.form.isFree,
        is_featured: this.form.isFeatured,
        card_badge_enabled: this.form.cardBadgeEnabled,
        badge_text: this.form.badge_text.trim() || null,
        badge_color: normalizeBadgeColor(this.form.badge_color),
      };
      if (this.draftProductUuid) {
        payload.product_uuid = this.draftProductUuid;
      }

      if (this.form.thumbnail) {
        payload.thumbnail_url = this.form.thumbnail;
      }

      if (this.form.checkoutBanner) {
        payload.checkout_banner_url = this.form.checkoutBanner;
      }

      payload.builder_config = {
        ui_type: this.uiType,
        card_style: this.cardStyle,
        preview_emoji: this.emoji,
        preview_background: this.emojiBackground,
        card_button_color: this.form.cardButtonColor || '#5B4FE9',
        headline: this.form.headline.trim(),
        file_delivery_type: this.form.fileDeliveryType,
        file_url: this.form.fileDeliveryType === 'upload' ? this.form.fileUrl.trim() : null,
        file_label: this.form.fileDeliveryType === 'upload' ? this.form.fileName.trim() : null,
        external_url: this.form.externalUrl.trim() || null,
        external_label: this.form.externalLabel.trim() || null,
        publish_immediately: this.form.publishImmediately,
        scheduled_publish_at: this.form.publishImmediately ? null : (this.form.scheduledPublishAt || null),
        social_proof: {
          enable_reviews: this.form.enableReviews,
        },
        marketing_automation: {
          email_flows: this.form.emailFlows,
          order_bumps: this.form.orderBumps,
          affiliate_share: this.form.affiliateShare,
          upsell_after_purchase: this.form.upsellAfterPurchase,
        },
        confirmation_email: {
          subject: this.form.emailSubject.trim() || null,
          body: this.form.emailBody.trim() || null,
        },
        seo: {
          meta_title: this.form.metaTitle.trim() || null,
          meta_description: this.form.metaDescription.trim() || null,
        },
        type_settings: this.buildTypeSettings(),
        collect_fields: this.collectFields.map((field) => ({
          name: field.name,
          type: field.type,
        })),
      };

      return payload;
    },
    async submitProduct() {
      this.resetValidationState();
      if (!this.validateForm()) {
        this.showToast('error', 'Please fix the highlighted fields.');
        return;
      }

      const saveMode = this.form.publishImmediately ? 'publish' : 'draft';
      this.isSubmitting = true;
      try {
        const payload = this.buildPayload(saveMode);
        const endpoint = this.getProductEndpoint();
        const response = await webService.post(endpoint, payload);

        if (response.data.code === 200) {
          const productUuid = this.resolveProductUuidFromResponse(response.data) || this.draftProductUuid;
          const action = saveMode === 'publish' ? 'published' : 'saved as draft';
          const successMessage = this.isEditMode ? 'Product updated successfully.' : `Product ${action} successfully.`;
          this.showToast('success', response.data.message || successMessage);
          if (productUuid) {
            this.$router.push(`/product/${productUuid}`);
            return;
          }
          return;
        }

        if (response.data.code === 600) {
          this.handleValidationErrors(response.data.errors);
          this.showToast('error', response.data.message || 'Please fix the highlighted validation errors.');
          return;
        }

        this.showToast('error', response.data.message || 'Failed to save product. Please try again.');
      } catch (error) {
        const apiErrors = error?.response?.data?.errors || null;
        if (apiErrors) {
          this.handleValidationErrors(apiErrors);
        }
        this.showToast('error', error?.response?.data?.message || 'Request failed while saving product.');
      } finally {
        this.isSubmitting = false;
      }
    },
    hydrateFromPayload(payload) {
      if (!payload || typeof payload !== 'object') return;
      const hasExplicitType = Boolean(payload.type_code || payload.ui_type || payload.builder_config?.ui_type || payload.product_uuid);
      payload = normalizeProductPayload(payload);
      const builderConfig = payload.builder_config || {};
      const seo = builderConfig.seo || {};
      const socialProof = builderConfig.social_proof || {};
      const marketing = builderConfig.marketing_automation || {};
      const confirmationEmail = builderConfig.confirmation_email || {};
      const typeSettings = builderConfig.type_settings || {};

      Object.assign(this.form, {
        title: payload.title || '',
        subtitle: payload.short_description || payload.subtitle || '',
        slug: payload.slug || '',
        metaTitle: seo.meta_title || payload.meta_title || '',
        metaDescription: seo.meta_description || payload.meta_description || '',
        headline: builderConfig.headline || payload.headline || '',
        description: payload.description || '',
        ctaText: payload.cta_text || '',
        price: payload.price ?? '',
        compareAtPrice: payload.compare_at_price ?? '',
        enableReviews: socialProof.enable_reviews ?? payload.enable_reviews ?? true,
        emailFlows: marketing.email_flows ?? payload.email_flows ?? false,
        orderBumps: marketing.order_bumps ?? payload.order_bumps ?? false,
        affiliateShare: marketing.affiliate_share ?? payload.affiliate_share ?? false,
        upsellAfterPurchase: marketing.upsell_after_purchase ?? payload.upsell_after_purchase ?? false,
        emailSubject: confirmationEmail.subject || payload.email_subject || this.form.emailSubject,
        emailBody: confirmationEmail.body || payload.email_body || this.form.emailBody,
        isFeatured: payload.is_featured ?? false,
        publishImmediately: builderConfig.publish_immediately ?? payload.publish_immediately ?? true,
        scheduledPublishAt: builderConfig.scheduled_publish_at || payload.scheduled_publish_at || '',
        fileDeliveryType: builderConfig.file_delivery_type || payload.file_delivery_type || 'upload',
        fileUrl: builderConfig.file_url || payload.file_url || '',
        fileName: builderConfig.file_label || payload.file_label || '',
        externalUrl: builderConfig.external_url || payload.external_url || '',
        externalLabel: builderConfig.external_label || payload.external_label || '',
        cardButtonColor: builderConfig.card_button_color || payload.card_button_color || this.form.cardButtonColor,
        cardBadgeEnabled: payload.card_badge_enabled ?? builderConfig.card_badge_enabled ?? this.form.cardBadgeEnabled,
        badge_text: payload.badge_text || builderConfig.card_badge_text || payload.card_badge_text || this.form.badge_text,
        badge_color: normalizeBadgeColor(payload.badge_color || builderConfig.card_badge_color || payload.card_badge_color || this.form.badge_color),
        externalShowAfterPurchase: typeSettings.show_after_purchase ?? payload.show_after_purchase ?? true,
        leadMagnetCtaLabel: typeSettings.cta_label || payload.cta_label || this.form.leadMagnetCtaLabel,
        leadMagnetSuccessMessage: typeSettings.success_message || payload.success_message || '',
        leadMagnetRedirectUrl: typeSettings.redirect_url || payload.redirect_url || '',
        serviceSessionDuration: typeSettings.session_duration ?? payload.session_duration ?? this.form.serviceSessionDuration,
        servicePlatform: typeSettings.platform || payload.platform || this.form.servicePlatform,
        serviceBufferBefore: typeSettings.buffer_before ?? payload.buffer_before ?? this.form.serviceBufferBefore,
        serviceBufferAfter: typeSettings.buffer_after ?? payload.buffer_after ?? this.form.serviceBufferAfter,
        serviceMaxBookingsPerDay: typeSettings.max_bookings_per_day ?? payload.max_bookings_per_day ?? '',
        serviceAdvanceBookingDays: typeSettings.advance_booking_days ?? payload.advance_booking_days ?? this.form.serviceAdvanceBookingDays,
        serviceMeetingUrl: typeSettings.meeting_url || payload.meeting_url || '',
      });

      if (hasExplicitType) {
        this.uiType = builderConfig.ui_type || payload.ui_type || this.uiType;
      }
      this.cardStyle = builderConfig.card_style || payload.card_style || this.cardStyle;
      this.emoji = builderConfig.preview_emoji || payload.preview_emoji || this.emoji;
      this.emojiBackground = builderConfig.preview_background || payload.preview_background || this.emojiBackground;
      const thumbRaw = payload.thumbnail_url || builderConfig.thumbnail || payload.thumbnail || '';
      this.form.thumbnail = thumbRaw;
      this.form.thumbnailUrl = thumbRaw ? `${env.BASE_URL}/${thumbRaw}` : '';
      const bannerRaw = payload.checkout_banner_url || builderConfig.checkout_banner || payload.checkout_banner || '';
      this.form.checkoutBanner = bannerRaw;
      this.form.checkoutBannerUrl = bannerRaw ? `${env.BASE_URL}/${bannerRaw}` : '';
      const fileRaw = this.form.fileUrl;
      this.form.productFileUrl = fileRaw ? `${env.BASE_URL}/${fileRaw}` : '';
      this.draftProductUuid = payload.product_uuid || '';

      const collectFields = builderConfig.collect_fields || payload.collect_fields;
      if (Array.isArray(collectFields)) {
        this.collectFields = collectFields.map((field) => ({
          id: `${field.type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: field.name || '',
          type: field.type || 'text',
          locked: field.locked ?? false,
        }));
      }

      this.form.isFree = payload.is_free ?? false;
      if (payload.is_free === undefined && (this.form.price === '0' || this.form.price === '0.00' || this.form.price === '' || this.form.price === 0)) {
        this.form.isFree = true;
      }
    },
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <div class="ap2-wrap">
      <div class="ap2-grid">
        <section class="ap2-form-area">
          <div class="ap2-tabs">
            <div class="ap2-tab-list">
              <button type="button" class="ap2-tab-btn" :class="activeTab === 'thumb' ? 'active' : ''" @click="switchTab('thumb')">1. Thumbnail</button>
              <button
                type="button"
                class="ap2-tab-btn"
                :class="activeTab === 'checkout' ? 'active' : ''"
                :disabled="!canAccessLaterTabs"
                @click="switchTab('checkout')"
              >
                2. Checkout Page
              </button>
              <button
                type="button"
                class="ap2-tab-btn"
                :class="activeTab === 'options' ? 'active' : ''"
                :disabled="!canAccessLaterTabs"
                @click="switchTab('options')"
              >
                3. Options
              </button>
              <span class="ap2-fixed-type">{{ selectedType.emoji }} {{ selectedType.name }}</span>
            </div>
            <button
              type="button"
              class="ap2-btn-primary ap2-publish-btn"
              :class="(!isTypeSupported || isSubmitting) ? 'ap2-btn-disabled' : ''"
              :disabled="!isTypeSupported || isSubmitting"
              @click="submitProduct"
            >
              {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Product' : (form.publishImmediately ? 'Publish Product' : 'Save as Draft')) }}
            </button>
          </div>

          <div class="ap2-tab-content">
            <product-thumbnail-tab
              v-show="activeTab === 'thumb'"
              :form="form"
              :validation="validation"
              :cardStyle="cardStyle"
              :emoji="emoji"
              :emojiOptions="emojiOptions"
              :selectedType="selectedType"
              :emojiBackground="emojiBackground"
              :previewTitle="previewTitle"
              :previewSubtitle="previewSubtitle"
              :previewPrice="previewPrice"
              :previewCompareAtPrice="previewCompareAtPrice"
              :previewDescription="previewDescription"
              :previewCardClasses="previewCardClasses"
              :previewTypeLabel="previewTypeLabel"
              :previewCalloutCardStyle="previewCalloutCardStyle"
              :previewCalloutImageStyle="previewCalloutImageStyle"
              :previewClassicImageStyle="previewClassicImageStyle"
              :previewButtonImageStyle="previewButtonImageStyle"
              :previewMode="previewMode"
              :previewHeadline="previewHeadline"
              :inputClasses="inputClasses"
              :thumbnailUrl="form.thumbnailUrl"
              @input:title="onTitleInput"
              @input:subtitle="onShortDescriptionInput"
              @input:ctaText="validateCtaText"
              @select:cardStyle="selectCardStyle"
              @select:emoji="selectEmoji"
              @upload:thumbnail="handleThumbnailUpload"
              @remove:thumbnail="handleThumbnailRemove"
              @switch:previewMode="switchPreviewMode"
              @toast="showToast"
              @shortDescriptionLength="shortDescriptionLength"
            />

            <product-checkout-tab
              v-show="activeTab === 'checkout'"
              :form="form"
              :validation="validation"
              :showFileCard="showFileCard"
              :collectFields="collectFields"
              :addFieldOptions="addFieldOptions"
              :inputClasses="inputClasses"
              :textareaClasses="textareaClasses"
              :uiType="uiType"
              :showTypeSettings="showTypeSettings"
              :typeSettingsTitle="typeSettingsTitle"
              :checkoutBannerUrl="form.checkoutBannerUrl"
              :isSubmitting="isSubmitting"
              @input:headline="validateDescription"
              @input:description="validateDescription"
              @toggle:isFree="toggleFreeProduct"
              @input:price="validatePrice"
              @input:compareAtPrice="validateCompareAtPrice"
              @select:fileType="selectFileType"
              @input:fileUrl="validateFileUrl"
              @input:fileName="validateFileName"
              @input:externalUrl="validateExternalUrl"
              @input:externalLabel="() => {}"
              @toggle:externalShowAfterPurchase="() => {}"
              @input:leadMagnetCtaLabel="() => {}"
              @input:leadMagnetSuccessMessage="() => {}"
              @input:leadMagnetRedirectUrl="validateLeadMagnetRedirectUrl"
              @input:serviceSessionDuration="() => {}"
              @input:servicePlatform="() => {}"
              @input:serviceBufferBefore="() => {}"
              @input:serviceBufferAfter="() => {}"
              @input:serviceMaxBookingsPerDay="() => {}"
              @input:serviceAdvanceBookingDays="() => {}"
              @input:serviceMeetingUrl="validateServiceMeetingUrl"
              @add:collectField="addCollectField"
              @remove:collectField="removeCollectField"
              @upload:checkoutBanner="handleCheckoutBannerUpload"
              @remove:checkoutBanner="handleCheckoutBannerRemove"
              @upload:productFile="handleProductFileUpload"
              @remove:productFile="handleProductFileRemove"
              @toast="showToast"
            />

            <product-options-tab
              v-show="activeTab === 'options'"
              :form="form"
              :validation="validation"
              :uiType="uiType"
              :inputClasses="inputClasses"
              :textareaClasses="textareaClasses"
              @input:emailSubject="() => {}"
              @input:emailBody="() => {}"
              @toggle:isFeatured="() => {}"
              @toggle:publishImmediately="onPublishImmediatelyChange"
              @input:scheduledPublishAt="() => {}"
              @input:slug="onSlugInput"
              @input:metaTitle="() => {}"
              @input:metaDescription="() => {}"
              @toggle:enableReviews="() => {}"
              @toggle:emailFlows="() => {}"
              @toggle:orderBumps="() => {}"
              @toggle:affiliateShare="() => {}"
              @toggle:upsellAfterPurchase="() => {}"
            />
          </div>

          <div class="ap2-bottom-bar">
            <div class="ap2-draft-note">
              <span class="ap2-draft-dot"></span>
              Draft - not published
            </div>
            <div class="ap2-bottom-actions">
              <button type="button" class="ap2-btn-primary" :class="isSubmitting ? 'ap2-btn-disabled' : ''" :disabled="isSubmitting" @click="handleNextAction">{{ nextButtonLabel }}</button>
            </div>
          </div>
        </section>

        <aside class="ap2-preview-col">
          <div class="ap2-preview-label">PRODUCT PREVIEW</div>

          <div v-show="previewMode === 'card'" class="ap2-preview-wrap">
            <product-store-preview
              :card-style="cardStyle"
              :form="form"
              :emoji="emoji"
              :emoji-background="emojiBackground"
              :preview-title="previewTitle"
              :preview-subtitle="previewSubtitle"
              :preview-price="previewPrice"
              :preview-compare-at-price="previewCompareAtPrice"
              :thumbnail-url="form.thumbnailUrl"
            />
          </div>

          <div v-show="previewMode === 'checkout'" class="ap2-preview-wrap">
            <div class="ap2-checkout-preview">
              <div class="ap2-checkout-banner" :style="form.checkoutBannerUrl ? { backgroundImage: 'url(' + form.checkoutBannerUrl + ')', backgroundSize: 'cover', backgroundPosition: 'center' } : { background: emojiBackground }">{{ form.checkoutBannerUrl ? '' : emoji }}</div>
              <div class="ap2-checkout-body">
                <div class="ap2-checkout-title">{{ previewHeadline }}</div>
                <div class="ap2-checkout-desc">{{ previewDescription }}</div>
                <div class="ap2-checkout-price" :class="form.isFree ? 'free' : ''">{{ previewPrice }}</div>
                <input class="ap2-checkout-input" placeholder="Email address" readonly />
                <input class="ap2-checkout-input" placeholder="First name" readonly />
                <div class="ap2-checkout-btn">{{ form.ctaText || 'Get Instant Access' }}</div>
              </div>
            </div>
          </div>

          <div class="ap2-preview-toggle">
            <button type="button" class="ap2-preview-toggle-btn" :class="previewMode === 'card' ? 'active' : ''" @click="switchPreviewMode('card')">Card</button>
            <button type="button" class="ap2-preview-toggle-btn" :class="previewMode === 'checkout' ? 'active' : ''" @click="switchPreviewMode('checkout')">Checkout</button>
          </div>
          <div class="ap2-preview-hint">Updates as you type</div>
        </aside>
      </div>
    </div>

    <p v-if="validation.type.status === 'error'" class="mt-3 text-xs text-error-500">{{ validation.type.message }}</p>
  </admin-layout>
  `,
};
