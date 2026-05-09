import AdminLayout from '/src/js/components/layout/AdminLayout.js';
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js';
const { webService } = await import(`/src/js/utils/webService.js?v=${v}`);

export default {
  name: 'AddProduct',
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  data() {
    return {
      currentPageTitle: 'Create New Product',
      isSubmitting: false,
      slugEditedManually: false,
      form: {
        typeCode: 'digital_download',
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        ctaText: '',
        isFree: false,
        price: '',
        compareAtPrice: '',
        metaTitle: '',
        metaDescription: '',
        isFeatured: true,
      },
      validation: {
        title: { status: null, message: '' },
        slug: { status: null, message: '' },
        shortDescription: { status: null, message: '' },
        description: { status: null, message: '' },
        ctaText: { status: null, message: '' },
        price: { status: null, message: '' },
        compareAtPrice: { status: null, message: '' },
        metaTitle: { status: null, message: '' },
        metaDescription: { status: null, message: '' },
      },
    };
  },
  computed: {
    normalizedType() {
      const knownTypes = ['digital_download', 'lead_magnet', 'external_link', 'custom_service'];
      return knownTypes.includes(this.form.typeCode) ? this.form.typeCode : 'digital_download';
    },
    typeCopy() {
      const copyMap = {
        digital_download: {
          typeLabel: 'Digital Download',
          heroTitle: 'Create New Digital Download',
          heroDescription: 'Add a downloadable product like an ebook, preset pack, guide, or template.',
          basicInfoDescription: 'Set clear product details so buyers understand what they will get instantly after purchase.',
          titlePlaceholder: 'Instagram Growth Templates Pack',
          titleNote: 'Required. Use a clear product name that explains what is being downloaded.',
          slugPlaceholder: 'instagram-growth-templates-pack',
          slugNote: 'Required. This becomes your product URL and is auto-created from the title.',
          shortDescriptionPlaceholder: 'Ready-to-use post and reel templates for creators.',
          shortDescriptionNote: 'Required. Keep this summary short and outcome-focused (max 100 chars).',
          descriptionNote: 'Required. Explain deliverables, file formats, what is included, and usage instructions.',
          ctaPlaceholder: 'Download Now',
          ctaNote: 'Required. Button text shown to buyers (examples: Buy Now, Download Now).',
          pricingDescription: 'Set your selling and strike-through pricing for this downloadable product.',
          freeProductNote: 'Mark as free if you want users to download without payment. Price fields become 0.00.',
          pricePlaceholder: '1499.00',
          priceNote: 'Required unless marked free. Use your final selling price.',
          compareAtPricePlaceholder: '1999.00',
          compareAtPriceNote: 'Required unless marked free. Usually the original or list price.',
          seoDescription: 'Improve discoverability with search-friendly metadata.',
          metaTitlePlaceholder: 'Instagram Growth Templates Pack',
          metaTitleNote: 'Required. Use key terms buyers might search for.',
          metaDescriptionPlaceholder: 'Download creator-friendly templates to plan and publish better content.',
          metaDescriptionNote: 'Required. Write a concise search snippet that highlights value.',
          footerNote: 'All fields are required. Review content, pricing, and SEO details before saving.',
          saveButton: 'Save Digital Download',
        },
        lead_magnet: {
          typeLabel: 'Lead Magnet',
          heroTitle: 'Create New Lead Magnet',
          heroDescription: 'Create a value-packed free offer to capture leads and grow your audience.',
          basicInfoDescription: 'Describe the free resource clearly so visitors know why they should opt in.',
          titlePlaceholder: 'Free Content Planning Checklist',
          titleNote: 'Required. Name the free resource in a benefit-first way.',
          slugPlaceholder: 'free-content-planning-checklist',
          slugNote: 'Required. Keep the URL short, clear, and easy to share.',
          shortDescriptionPlaceholder: 'A simple checklist to plan content for the whole week.',
          shortDescriptionNote: 'Required. Mention the key outcome in one short line (max 100 chars).',
          descriptionNote: 'Required. Explain who it is for, what they get, and how to use it.',
          ctaPlaceholder: 'Get Free Access',
          ctaNote: 'Required. Use action text for free signup (examples: Get Free Access, Download Free).',
          pricingDescription: 'Lead magnets are usually free, but you can still set pricing if needed.',
          freeProductNote: 'Recommended for lead magnets. If checked, pricing locks to 0.00.',
          pricePlaceholder: '0.00',
          priceNote: 'Required only if not free. For most lead magnets, keep this at 0.00.',
          compareAtPricePlaceholder: '499.00',
          compareAtPriceNote: 'Required only if not free. Use only when showing promotional value.',
          seoDescription: 'Add metadata so your lead magnet can rank and be shared effectively.',
          metaTitlePlaceholder: 'Free Content Planning Checklist',
          metaTitleNote: 'Required. Match what users search when looking for this free resource.',
          metaDescriptionPlaceholder: 'Grab this free checklist to create better content with less stress.',
          metaDescriptionNote: 'Required. Focus on value and who should download it.',
          footerNote: 'All fields are required. For lead magnets, free pricing and strong CTA text usually perform best.',
          saveButton: 'Save Lead Magnet',
        },
        external_link: {
          typeLabel: 'External Link',
          heroTitle: 'Create New External Link Product',
          heroDescription: 'Promote an offer hosted outside your platform and send users to the destination link.',
          basicInfoDescription: 'Use clear messaging so users know what they will get after clicking through.',
          titlePlaceholder: 'Creator Brand Kit Bundle',
          titleNote: 'Required. Use the offer name users will recognize on the destination page.',
          slugPlaceholder: 'creator-brand-kit-bundle',
          slugNote: 'Required. This slug is used for your internal route and sharing.',
          shortDescriptionPlaceholder: 'Access the full brand kit from the partner checkout page.',
          shortDescriptionNote: 'Required. Tell users what they get before they click out (max 100 chars).',
          descriptionNote: 'Required. Clarify where the link goes, what users can expect, and any conditions.',
          ctaPlaceholder: 'Visit Offer',
          ctaNote: 'Required. Use click-through action text (examples: Visit Offer, Open Link).',
          pricingDescription: 'Set display pricing details for this external offer.',
          freeProductNote: 'Check if the external offer is free. Price fields become 0.00.',
          pricePlaceholder: '999.00',
          priceNote: 'Required unless marked free. This is shown as offer price on your listing.',
          compareAtPricePlaceholder: '1499.00',
          compareAtPriceNote: 'Required unless marked free. Use if you want to show a discount context.',
          seoDescription: 'Use SEO metadata so your listing page can rank even if purchase happens externally.',
          metaTitlePlaceholder: 'Creator Brand Kit Bundle - External Offer',
          metaTitleNote: 'Required. Mention it is an external offer if needed for clarity.',
          metaDescriptionPlaceholder: 'View and purchase this creator bundle on our trusted partner page.',
          metaDescriptionNote: 'Required. Keep expectations clear before users leave your site.',
          footerNote: 'All fields are required. Make sure your copy clearly signals this is an external destination.',
          saveButton: 'Save External Link Product',
        },
        custom_service: {
          typeLabel: 'Custom Service',
          heroTitle: 'Create New Custom Service',
          heroDescription: 'Set up a service offer such as consulting, audits, coaching, or implementation.',
          basicInfoDescription: 'Describe your service scope clearly so buyers know exactly what is included.',
          titlePlaceholder: '1:1 Content Strategy Session',
          titleNote: 'Required. Use the exact service name clients are buying.',
          slugPlaceholder: '1-1-content-strategy-session',
          slugNote: 'Required. Keep this URL readable and service-specific.',
          shortDescriptionPlaceholder: '60-minute call to plan your content and grow your audience.',
          shortDescriptionNote: 'Required. Summarize service outcome in one strong line (max 100 chars).',
          descriptionNote: 'Required. Explain deliverables, duration, process, and turnaround expectations.',
          ctaPlaceholder: 'Book Now',
          ctaNote: 'Required. Service-friendly CTA works best (examples: Book Now, Request Service).',
          pricingDescription: 'Set your service fee and optional compare-at price.',
          freeProductNote: 'Check this only if the service is complimentary. Pricing becomes 0.00.',
          pricePlaceholder: '5000.00',
          priceNote: 'Required unless marked free. Use the actual payable service fee.',
          compareAtPricePlaceholder: '7500.00',
          compareAtPriceNote: 'Required unless marked free. Useful to show standard pricing.',
          seoDescription: 'Add search metadata so your service page can attract qualified leads.',
          metaTitlePlaceholder: '1:1 Content Strategy Session',
          metaTitleNote: 'Required. Include service keywords your clients search for.',
          metaDescriptionPlaceholder: 'Book a personalized strategy session for content, positioning, and growth.',
          metaDescriptionNote: 'Required. Highlight service outcome and target audience.',
          footerNote: 'All fields are required. Clear scope and pricing reduce back-and-forth with clients.',
          saveButton: 'Save Service',
        },
      };
      return copyMap[this.normalizedType];
    },
    shortDescriptionLength() {
      return this.form.shortDescription.length;
    },
    metaDescriptionLength() {
      return this.form.metaDescription.length;
    },
    isPricingReadonly() {
      return this.form.isFree;
    },
  },
  mounted() {
    this.setTypeFromQuery();
    this.syncEditorHtml();
  },
  watch: {
    '$route.query.type'() {
      this.setTypeFromQuery();
    },
  },
  methods: {
    setTypeFromQuery() {
      const routeType = String(this.$route?.query?.type || '').trim();
      if (!routeType) {
        this.$router.push('/products');
        return;
      }
      this.form.typeCode = routeType;
    },
    inputClasses(field) {
      if (this.validation[field].status === 'error') {
        return 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800';
      }
      if (this.validation[field].status === 'success') {
        return 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800';
      }
      return 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800';
    },
    textAreaClasses(field) {
      if (this.validation[field].status === 'error') {
        return 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800';
      }
      if (this.validation[field].status === 'success') {
        return 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800';
      }
      return 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800';
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
      if (this.form.shortDescription.length > 100) {
        this.form.shortDescription = this.form.shortDescription.slice(0, 100);
      }
      this.validateShortDescription();
    },
    onMetaDescriptionInput() {
      this.validateMetaDescription();
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
    applyEditorCommand(command) {
      const editor = this.$refs.descriptionEditor;
      if (!editor) {
        return;
      }
      editor.focus();
      if (typeof document.execCommand === 'function') {
        document.execCommand(command, false, null);
      }
      this.form.description = editor.innerHTML;
      this.validateDescription();
    },
    onDescriptionInput() {
      const editor = this.$refs.descriptionEditor;
      this.form.description = editor ? editor.innerHTML : '';
      this.validateDescription();
    },
    syncEditorHtml() {
      if (this.$refs.descriptionEditor && this.$refs.descriptionEditor.innerHTML !== this.form.description) {
        this.$refs.descriptionEditor.innerHTML = this.form.description || '';
      }
    },
    getPlainText(html) {
      const tempNode = document.createElement('div');
      tempNode.innerHTML = html || '';
      return (tempNode.textContent || tempNode.innerText || '').replace(/\s+/g, ' ').trim();
    },
    validateTitle() {
      if (!this.form.title.trim()) {
        this.validation.title = { status: 'error', message: 'Product title is required.' };
        return false;
      }
      this.validation.title = { status: 'success', message: '' };
      return true;
    },
    validateSlug() {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!this.form.slug.trim()) {
        this.validation.slug = { status: 'error', message: 'Slug is required.' };
        return false;
      }
      if (!slugRegex.test(this.form.slug)) {
        this.validation.slug = { status: 'error', message: 'Slug must use lowercase letters, numbers, and hyphens only.' };
        return false;
      }
      this.validation.slug = { status: 'success', message: '' };
      return true;
    },
    validateShortDescription() {
      const value = this.form.shortDescription.trim();
      if (!value) {
        this.validation.shortDescription = { status: 'error', message: 'Short description is required.' };
        return false;
      }
      if (value.length > 100) {
        this.validation.shortDescription = { status: 'error', message: 'Short description must be 100 characters or less.' };
        return false;
      }
      this.validation.shortDescription = { status: 'success', message: '' };
      return true;
    },
    validateDescription() {
      const value = this.getPlainText(this.form.description);
      if (!value) {
        this.validation.description = { status: 'error', message: 'Full description is required.' };
        return false;
      }
      this.validation.description = { status: 'success', message: '' };
      return true;
    },
    validateCtaText() {
      if (!this.form.ctaText.trim()) {
        this.validation.ctaText = { status: 'error', message: 'CTA button text is required.' };
        return false;
      }
      this.validation.ctaText = { status: 'success', message: '' };
      return true;
    },
    validatePrice() {
      if (this.form.isFree) {
        this.validation.price = { status: 'success', message: '' };
        return true;
      }
      const value = Number(this.form.price);
      if (this.form.price === '' || Number.isNaN(value)) {
        this.validation.price = { status: 'error', message: 'Price is required when product is not free.' };
        return false;
      }
      if (value < 0) {
        this.validation.price = { status: 'error', message: 'Price cannot be negative.' };
        return false;
      }
      this.validation.price = { status: 'success', message: '' };
      return true;
    },
    validateCompareAtPrice() {
      if (this.form.isFree) {
        this.validation.compareAtPrice = { status: 'success', message: '' };
        return true;
      }
      const value = Number(this.form.compareAtPrice);
      const currentPrice = Number(this.form.price);
      if (this.form.compareAtPrice === '' || Number.isNaN(value)) {
        this.validation.compareAtPrice = { status: 'error', message: 'Compare-at price is required when product is not free.' };
        return false;
      }
      if (value < 0) {
        this.validation.compareAtPrice = { status: 'error', message: 'Compare-at price cannot be negative.' };
        return false;
      }
      if (!Number.isNaN(currentPrice) && value < currentPrice) {
        this.validation.compareAtPrice = { status: 'error', message: 'Compare-at price should be greater than or equal to price.' };
        return false;
      }
      this.validation.compareAtPrice = { status: 'success', message: '' };
      return true;
    },
    validateMetaTitle() {
      if (!this.form.metaTitle.trim()) {
        this.validation.metaTitle = { status: 'error', message: 'Meta title is required.' };
        return false;
      }
      this.validation.metaTitle = { status: 'success', message: '' };
      return true;
    },
    validateMetaDescription() {
      if (!this.form.metaDescription.trim()) {
        this.validation.metaDescription = { status: 'error', message: 'Meta description is required.' };
        return false;
      }
      this.validation.metaDescription = { status: 'success', message: '' };
      return true;
    },
    validateForm() {
      const validators = [
        this.validateTitle(),
        this.validateSlug(),
        this.validateShortDescription(),
        this.validateDescription(),
        this.validateCtaText(),
        this.validatePrice(),
        this.validateCompareAtPrice(),
        this.validateMetaTitle(),
        this.validateMetaDescription(),
      ];
      return validators.every(Boolean);
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
        short_description: 'shortDescription',
        description: 'description',
        cta_text: 'ctaText',
        price: 'price',
        compare_at_price: 'compareAtPrice',
        meta_title: 'metaTitle',
        meta_description: 'metaDescription',
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
    resetForm() {
      this.slugEditedManually = false;
      const currentType = this.form.typeCode;
      this.form = {
        typeCode: currentType,
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        ctaText: '',
        isFree: false,
        price: '',
        compareAtPrice: '',
        metaTitle: '',
        metaDescription: '',
        isFeatured: true,
      };
      this.resetValidationState();
      this.$nextTick(() => {
        this.syncEditorHtml();
      });
    },
    async submitProduct() {
      this.syncEditorHtml();
      this.resetValidationState();

      if (!this.validateForm()) {
        toast({
          type: 'error',
          message: 'Please complete all required fields before saving.',
          duration: 3500,
        });
        return;
      }

      this.isSubmitting = true;

      const payload = {
        type_code: this.form.typeCode,
        title: this.form.title.trim(),
        slug: this.form.slug.trim(),
        short_description: this.form.shortDescription.trim(),
        description: this.form.description,
        price: this.form.isFree ? 0 : Number(this.form.price),
        compare_at_price: this.form.isFree ? 0 : Number(this.form.compareAtPrice),
        is_free: this.form.isFree,
        is_featured: this.form.isFeatured,
        meta_title: this.form.metaTitle.trim(),
        meta_description: this.form.metaDescription.trim(),
        cta_text: this.form.ctaText.trim(),
      };

      try {
        const response = await webService.post('/api/platform/add-product', payload);

        if (response.data.code === 200) {
          toast({
            type: 'success',
            message: response.data.message || 'Product created successfully.',
            duration: 3500,
          });
          this.resetForm();
          return;
        }

        if (response.data.code === 600) {
          this.handleValidationErrors(response.data.errors);
          toast({
            type: 'error',
            message: response.data.message || 'Please fix the highlighted validation errors.',
            duration: 4000,
          });
          return;
        }

        toast({
          type: 'error',
          message: response.data.message || 'Failed to create product. Please try again.',
          duration: 4000,
        });
      } catch (error) {
        const apiErrors = error?.response?.data?.errors || null;
        if (apiErrors) {
          this.handleValidationErrors(apiErrors);
        }
        toast({
          type: 'error',
          message: error?.response?.data?.message || 'Request failed while creating product.',
          duration: 4000,
        });
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <form @submit.prevent="submitProduct" class="w-full space-y-6 lg:max-w-[70%]" style="width: 70%;">
      <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">{{ typeCopy.heroTitle }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ typeCopy.heroDescription }}
        </p>
        <p class="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Type: {{ typeCopy.typeLabel }} ({{ form.typeCode }})
        </p>
      </div>

      <section class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">1) Basic Information</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ typeCopy.basicInfoDescription }}</p>
        </div>
        <div class="space-y-5 p-4 sm:p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Product Title <span class="text-error-500">*</span></label>
            <input
              v-model="form.title"
              type="text"
              :placeholder="typeCopy.titlePlaceholder"
              @input="onTitleInput"
              :class="['dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', inputClasses('title')]"
            />
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.titleNote }}</p>
            <p v-if="validation.title.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.title.message }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Slug <span class="text-error-500">*</span></label>
            <input
              v-model="form.slug"
              type="text"
              :placeholder="typeCopy.slugPlaceholder"
              @input="onSlugInput"
              :class="['dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', inputClasses('slug')]"
            />
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.slugNote }}</p>
            <p v-if="validation.slug.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.slug.message }}</p>
          </div>

          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Short Description <span class="text-error-500">*</span></label>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ shortDescriptionLength }}/100</span>
            </div>
            <textarea
              v-model="form.shortDescription"
              rows="3"
              :placeholder="typeCopy.shortDescriptionPlaceholder"
              @input="onShortDescriptionInput"
              :class="['dark:bg-dark-900 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', textAreaClasses('shortDescription')]"
            ></textarea>
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.shortDescriptionNote }}</p>
            <p v-if="validation.shortDescription.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.shortDescription.message }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Full Description <span class="text-error-500">*</span></label>
            <div class="overflow-hidden rounded-lg border" :class="validation.description.status === 'error' ? 'border-error-300 dark:border-error-700' : 'border-gray-300 dark:border-gray-700'">
              <div class="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
                <button type="button" @click="applyEditorCommand('bold')" class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Bold</button>
                <button type="button" @click="applyEditorCommand('italic')" class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Italic</button>
                <button type="button" @click="applyEditorCommand('insertUnorderedList')" class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Bullets</button>
                <button type="button" @click="applyEditorCommand('insertOrderedList')" class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Numbered</button>
              </div>
              <div
                ref="descriptionEditor"
                contenteditable="true"
                @input="onDescriptionInput"
                @blur="validateDescription"
                class="dark:bg-dark-900 min-h-[180px] w-full bg-transparent px-4 py-3 text-sm text-gray-800 focus:outline-hidden dark:bg-gray-900 dark:text-white/90"
              ></div>
            </div>
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.descriptionNote }}</p>
            <p v-if="validation.description.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.description.message }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">CTA Text (Button Text) <span class="text-error-500">*</span></label>
            <input
              v-model="form.ctaText"
              type="text"
              :placeholder="typeCopy.ctaPlaceholder"
              @input="validateCtaText"
              :class="['dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', inputClasses('ctaText')]"
            />
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.ctaNote }}</p>
            <p v-if="validation.ctaText.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.ctaText.message }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">2) Pricing</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ typeCopy.pricingDescription }}</p>
        </div>
        <div class="space-y-5 p-4 sm:p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Free Product</label>
            <label for="freeProductCheckbox" class="flex items-start text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
              <div class="relative mt-0.5">
                <input
                  id="freeProductCheckbox"
                  v-model="form.isFree"
                  type="checkbox"
                  class="sr-only"
                  @change="toggleFreeProduct"
                />
                <div
                  :class="form.isFree ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'"
                  class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500"
                >
                  <span :class="form.isFree ? '' : 'opacity-0'">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
              <span class="mt-0.5 block text-theme-xs font-normal text-gray-500 dark:text-gray-400">
                {{ typeCopy.freeProductNote }}
              </span>
            </label>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Price <span class="text-error-500">*</span></label>
              <input
                v-model="form.price"
                type="number"
                step="0.01"
                min="0"
                :readonly="isPricingReadonly"
                @input="validatePrice"
                :placeholder="typeCopy.pricePlaceholder"
                :class="['dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', inputClasses('price'), isPricingReadonly ? 'cursor-not-allowed bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : '']"
              />
              <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.priceNote }}</p>
              <p v-if="validation.price.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.price.message }}</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Compare-at Price <span class="text-error-500">*</span></label>
              <input
                v-model="form.compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                :readonly="isPricingReadonly"
                @input="validateCompareAtPrice"
                :placeholder="typeCopy.compareAtPricePlaceholder"
                :class="['dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', inputClasses('compareAtPrice'), isPricingReadonly ? 'cursor-not-allowed bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : '']"
              />
              <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.compareAtPriceNote }}</p>
              <p v-if="validation.compareAtPrice.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.compareAtPrice.message }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">3) SEO</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ typeCopy.seoDescription }}</p>
        </div>
        <div class="space-y-5 p-4 sm:p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Meta Title <span class="text-error-500">*</span></label>
            <input
              v-model="form.metaTitle"
              type="text"
              :placeholder="typeCopy.metaTitlePlaceholder"
              @input="validateMetaTitle"
              :class="['dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', inputClasses('metaTitle')]"
            />
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.metaTitleNote }}</p>
            <p v-if="validation.metaTitle.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.metaTitle.message }}</p>
          </div>

          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Meta Description <span class="text-error-500">*</span></label>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ metaDescriptionLength }} chars</span>
            </div>
            <textarea
              v-model="form.metaDescription"
              rows="3"
              :placeholder="typeCopy.metaDescriptionPlaceholder"
              @input="onMetaDescriptionInput"
              :class="['dark:bg-dark-900 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30', textAreaClasses('metaDescription')]"
            ></textarea>
            <p class="mt-1.5 text-theme-xs text-gray-500">{{ typeCopy.metaDescriptionNote }}</p>
            <p v-if="validation.metaDescription.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">{{ validation.metaDescription.message }}</p>
          </div>
        </div>
      </section>

      <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ typeCopy.footerNote }}</p>
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="['inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600', isSubmitting ? 'cursor-not-allowed opacity-60' : '']"
          >
            {{ isSubmitting ? 'Saving...' : typeCopy.saveButton }}
          </button>
        </div>
      </div>
    </form>
  </admin-layout>
  `,
};
