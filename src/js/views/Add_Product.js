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
      draftLoaded: false,
      draftSavedAt: null,
      draftProductUuid: '',
      autosaveState: 'idle',
      autosaveErrorMessage: '',
      autosaveDebounceMs: 1200,
      autosaveTimer: null,
      isAutosaveInFlight: false,
      pendingAutosave: false,
      autosaveRequestCounter: 0,
      latestHandledAutosaveRequest: 0,
      isHydratingDraft: false,
      uiType: '',
      activeTab: 'thumb',
      previewMode: 'card',
      cardStyle: 'button',
      emoji: '📁',
      emojiBackground: 'linear-gradient(135deg,#5B4FE9,#A78BFA)',
      form: {
        title: '',
        subtitle: '',
        ctaText: 'Get Instant Access',
        headline: '',
        description: '',
        slug: '',
        metaTitle: '',
        metaDescription: '',
        isFree: false,
        price: '',
        compareAtPrice: '',
        enableReviews: true,
        emailFlows: false,
        orderBumps: false,
        affiliateShare: false,
        upsellAfterPurchase: false,
        emailSubject: "🎉 You're in! Here's your access",
        emailBody: `Hey {{first_name}},

Thank you so much for your purchase! Here's how to access your product:

{{product_access_link}}

Let me know if you have any questions 🙌`,
        isFeatured: false,
        publishImmediately: true,
        scheduledPublishAt: '',
        fileDeliveryType: 'upload',
        fileUrl: '',
        fileName: '',
        externalUrl: '',
        externalLabel: '',
        externalShowAfterPurchase: true,
        leadMagnetCtaLabel: 'Get Free Access',
        leadMagnetSuccessMessage: '',
        leadMagnetRedirectUrl: '',
        serviceSessionDuration: '60',
        servicePlatform: 'Zoom',
        serviceBufferBefore: '0',
        serviceBufferAfter: '15',
        serviceMaxBookingsPerDay: '',
        serviceAdvanceBookingDays: '30',
        serviceMeetingUrl: '',
      },
      collectFields: [
        { id: 'name', name: 'Name', type: 'text',  locked: true},
        { id: 'email', name: 'Email Address', type: 'email', locked: true },
      ],
      addFieldOptions: [
        { label: 'Phone', name: 'Phone Number', type: 'phone' },
        { label: 'Company', name: 'Company', type: 'text' },
        { label: 'Source', name: 'How did you find us?', type: 'dropdown' },
        { label: 'Custom', name: 'Custom Question', type: 'text' },
      ],
      validation: {
        type: { status: null, message: '' },
        title: { status: null, message: '' },
        subtitle: { status: null, message: '' },
        slug: { status: null, message: '' },
        description: { status: null, message: '' },
        ctaText: { status: null, message: '' },
        price: { status: null, message: '' },
        compareAtPrice: { status: null, message: '' },
        fileUrl: { status: null, message: '' },
        externalUrl: { status: null, message: '' },
        leadMagnetRedirectUrl: { status: null, message: '' },
        serviceMeetingUrl: { status: null, message: '' },
      },
      productTypes: [
        {
          id: 'digital_download',
          apiType: 'digital_download',
          emoji: '📁',
          name: 'Digital Download',
          desc: 'eBook, template, PDF',
        },
        {
          id: 'lead_magnet',
          apiType: 'lead_magnet',
          emoji: '📧',
          name: 'Lead Magnet',
          desc: 'Free - collect emails',
        },
        {
          id: 'external_link',
          apiType: 'external_link',
          emoji: '🔗',
          name: 'External Link',
          desc: 'Redirect to any URL',
        },
        {
          id: 'custom_service',
          apiType: 'custom_service',
          emoji: '📅',
          name: 'Custom Service',
          desc: '1-on-1 or done-for-you offer',
        },
      ],
      emojiOptions: [
        { emoji: '📁', bg: 'linear-gradient(135deg,#5B4FE9,#A78BFA)' },
        { emoji: '🎓', bg: 'linear-gradient(135deg,#EC4899,#F97316)' },
        { emoji: '📅', bg: 'linear-gradient(135deg,#0284C7,#38BDF8)' },
        { emoji: '👑', bg: 'linear-gradient(135deg,#059669,#34D399)' },
        { emoji: '🎥', bg: 'linear-gradient(135deg,#D97706,#FBBF24)' },
        { emoji: '📧', bg: 'linear-gradient(135deg,#DB2777,#F43F5E)' },
        { emoji: '📊', bg: 'linear-gradient(135deg,#7C3AED,#C026D3)' },
        { emoji: '🔗', bg: 'linear-gradient(135deg,#0F172A,#334155)' },
        { emoji: '🎁', bg: 'linear-gradient(135deg,#B45309,#D97706)' },
        { emoji: '✨', bg: 'linear-gradient(135deg,#BE185D,#EC4899)' },
        { emoji: '💡', bg: 'linear-gradient(135deg,#047857,#059669)' },
        { emoji: '🚀', bg: 'linear-gradient(135deg,#1D4ED8,#3B82F6)' },
      ],
    };
  },
  computed: {
    routeType() {
      return String(this.$route?.query?.type || '').trim();
    },
    selectedType() {
      return this.productTypes.find((item) => item.id === this.uiType) || this.productTypes[0];
    },
    isTypeSupported() {
      return Boolean(this.selectedType.apiType);
    },
    shortDescriptionLength() {
      return this.form.subtitle.length;
    },
    showFileCard() {
      const noFileTypes = ['custom_service', 'external_link', 'lead_magnet'];
      return !noFileTypes.includes(this.uiType);
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
      return 'Publish Product';
    },
    showTypeSettings() {
      return ['custom_service', 'lead_magnet', 'external_link'].includes(this.uiType);
    },
    hasUnsavedChanges() {
      return this.autosaveState === 'dirty' || this.autosaveState === 'saving' || this.autosaveState === 'error' || this.pendingAutosave;
    },
    autosaveStatusText() {
      if (this.autosaveState === 'saving') {
        return 'Saving...';
      }
      if (this.autosaveState === 'saved') {
        return 'Saved just now';
      }
      if (this.autosaveState === 'error') {
        return this.autosaveErrorMessage || 'Save failed';
      }
      if (this.autosaveState === 'dirty') {
        return 'Unsaved changes';
      }
      return 'Draft - not published';
    },
    saveDraftButtonLabel() {
      if (this.autosaveState === 'saving' && !this.isSubmitting) {
        return 'Saving...';
      }
      return 'Save Draft';
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
    this.isHydratingDraft = true;
    this.setTypeFromQuery();
    this.loadDraft();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.$nextTick(() => {
      this.isHydratingDraft = false;
      if (this.draftLoaded) {
        this.autosaveState = 'saved';
      }
    });
  },
  beforeUnmount() {
    this.clearAutosaveTimer();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  watch: {
    '$route.query.type'() {
      this.setTypeFromQuery();
    },
    form: {
      deep: true,
      handler() {
        this.onDraftContentChanged();
      },
    },
    collectFields: {
      deep: true,
      handler() {
        this.onDraftContentChanged();
      },
    },
    uiType() {
      this.onDraftContentChanged();
    },
    cardStyle() {
      this.onDraftContentChanged();
    },
    emoji() {
      this.onDraftContentChanged();
    },
    emojiBackground() {
      this.onDraftContentChanged();
    },
  },
  methods: {
    setTypeFromQuery() {
      if (!this.routeType) {
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
    draftStorageKey() {
      return 'creator_add_product_draft';
    },
    clearAutosaveTimer() {
      if (!this.autosaveTimer) {
        return;
      }
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    },
    resolveProductUuidFromResponse(responseData) {
      const data = responseData?.data || {};
      return data.product_uuid || '';
    },
    getProductEndpoint() {
      return this.draftProductUuid ? '/api/platform/update-product' : '/api/platform/add-product';
    },
    onDraftContentChanged() {
      if (this.isHydratingDraft || this.isSubmitting) {
        return;
      }
      if (this.isAutosaveInFlight) {
        this.pendingAutosave = true;
      }
      if (this.autosaveState !== 'saving') {
        this.autosaveState = 'dirty';
      }
      this.autosaveErrorMessage = '';
      this.persistLocalDraft();
      this.scheduleAutosave();
    },
    scheduleAutosave() {
      this.clearAutosaveTimer();
      this.autosaveTimer = setTimeout(() => {
        this.saveDraftToApi({ notifySuccess: false, force: false });
      }, this.autosaveDebounceMs);
    },
    async triggerImmediateAutosave({ notifySuccess = false, force = false } = {}) {
      this.clearAutosaveTimer();
      return this.saveDraftToApi({ notifySuccess, force });
    },
    validateDraftForm() {
      if (!this.validateSupportedType()) {
        return false;
      }

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      const slugValue = this.form.slug.trim();
      if (!slugValue) {
        this.clearValidation('slug');
      } else if (!slugRegex.test(slugValue)) {
        this.setValidationState('slug', 'error', 'Slug can contain lowercase letters, numbers, and hyphens only.');
        return false;
      } else {
        this.setValidationState('slug', 'success', '');
      }

      if (this.showFileCard && this.form.fileDeliveryType === 'url') {
        const fileUrl = this.form.fileUrl.trim();
        if (fileUrl && !this.isValidUrl(fileUrl)) {
          this.setValidationState('fileUrl', 'error', 'Please enter a valid URL.');
          return false;
        }
      } else {
        this.clearValidation('fileUrl');
      }

      if (this.uiType === 'external_link') {
        const externalUrl = this.form.externalUrl.trim();
        if (externalUrl && !this.isValidUrl(externalUrl)) {
          this.setValidationState('externalUrl', 'error', 'Please enter a valid destination URL.');
          return false;
        }
      } else {
        this.clearValidation('externalUrl');
      }

      if (this.uiType === 'lead_magnet') {
        const redirectUrl = this.form.leadMagnetRedirectUrl.trim();
        if (redirectUrl && !this.isValidUrl(redirectUrl)) {
          this.setValidationState('leadMagnetRedirectUrl', 'error', 'Please enter a valid redirect URL.');
          return false;
        }
      } else {
        this.clearValidation('leadMagnetRedirectUrl');
      }

      if (this.uiType === 'custom_service') {
        const meetingUrl = this.form.serviceMeetingUrl.trim();
        if (meetingUrl && !this.isValidUrl(meetingUrl)) {
          this.setValidationState('serviceMeetingUrl', 'error', 'Please enter a valid meeting URL.');
          return false;
        }
      } else {
        this.clearValidation('serviceMeetingUrl');
      }

      return true;
    },
    handleBeforeUnload(event) {
      if (!this.hasUnsavedChanges) {
        return;
      }
      event.preventDefault();
      event.returnValue = '';
    },
    persistLocalDraft() {
      try {
        const payload = this.buildPayload('draft');
        payload._local_saved_at = Date.now();
        localStorage.setItem(this.draftStorageKey(), JSON.stringify(payload));
        this.draftLoaded = true;
      } catch (error) {
        console.warn('Unable to save local draft', error);
      }
    },
    loadDraft() {
      try {
        const raw = localStorage.getItem(this.draftStorageKey());
        if (!raw) {
          return;
        }
        const payload = JSON.parse(raw);
        if (!payload || typeof payload !== 'object') {
          return;
        }

        const builderConfig = payload.builder_config || {};
        const seo = builderConfig.seo || {};
        const socialProof = builderConfig.social_proof || {};
        const marketing = builderConfig.marketing_automation || {};
        const confirmationEmail = builderConfig.confirmation_email || {};
        const typeSettings = builderConfig.type_settings || {};

        this.form.title = payload.title || '';
        this.form.subtitle = payload.short_description || payload.subtitle || '';
        this.form.slug = payload.slug || '';
        this.form.metaTitle = seo.meta_title || payload.meta_title || '';
        this.form.metaDescription = seo.meta_description || payload.meta_description || '';
        this.form.description = payload.description || '';
        this.form.ctaText = payload.cta_text || '';
        this.form.price = payload.price ?? '';
        this.form.compareAtPrice = payload.compare_at_price ?? '';
        this.form.enableReviews = socialProof.enable_reviews ?? payload.enable_reviews ?? true;
        this.form.emailFlows = marketing.email_flows ?? payload.email_flows ?? false;
        this.form.orderBumps = marketing.order_bumps ?? payload.order_bumps ?? false;
        this.form.affiliateShare = marketing.affiliate_share ?? payload.affiliate_share ?? false;
        this.form.upsellAfterPurchase = marketing.upsell_after_purchase ?? payload.upsell_after_purchase ?? false;
        this.form.emailSubject = confirmationEmail.subject || payload.email_subject || this.form.emailSubject;
        this.form.emailBody = confirmationEmail.body || payload.email_body || this.form.emailBody;
        this.form.isFeatured = payload.is_featured ?? false;
        this.form.publishImmediately = builderConfig.publish_immediately ?? payload.publish_immediately ?? true;
        this.form.scheduledPublishAt = builderConfig.scheduled_publish_at || payload.scheduled_publish_at || '';
        this.form.fileDeliveryType = builderConfig.file_delivery_type || payload.file_delivery_type || 'upload';
        this.form.fileUrl = builderConfig.file_url || payload.file_url || '';
        this.form.fileName = builderConfig.file_label || payload.file_label || '';
        this.form.externalUrl = builderConfig.external_url || payload.external_url || '';
        this.form.externalLabel = builderConfig.external_label || payload.external_label || '';
        this.form.externalShowAfterPurchase = typeSettings.show_after_purchase ?? payload.show_after_purchase ?? true;
        this.form.leadMagnetCtaLabel = typeSettings.cta_label || payload.cta_label || this.form.leadMagnetCtaLabel;
        this.form.leadMagnetSuccessMessage = typeSettings.success_message || payload.success_message || '';
        this.form.leadMagnetRedirectUrl = typeSettings.redirect_url || payload.redirect_url || '';
        this.form.serviceSessionDuration = typeSettings.session_duration || payload.session_duration || this.form.serviceSessionDuration;
        this.form.servicePlatform = typeSettings.platform || payload.platform || this.form.servicePlatform;
        this.form.serviceBufferBefore = typeSettings.buffer_before || payload.buffer_before || this.form.serviceBufferBefore;
        this.form.serviceBufferAfter = typeSettings.buffer_after || payload.buffer_after || this.form.serviceBufferAfter;
        this.form.serviceMaxBookingsPerDay = typeSettings.max_bookings_per_day || payload.max_bookings_per_day || '';
        this.form.serviceAdvanceBookingDays = typeSettings.advance_booking_days || payload.advance_booking_days || this.form.serviceAdvanceBookingDays;
        this.form.serviceMeetingUrl = typeSettings.meeting_url || payload.meeting_url || '';

        this.uiType = builderConfig.ui_type || payload.ui_type || this.uiType || 'digital_download';
        this.cardStyle = builderConfig.card_style || payload.card_style || this.cardStyle;
        this.emoji = builderConfig.preview_emoji || payload.preview_emoji || this.emoji;
        this.emojiBackground = builderConfig.preview_background || payload.preview_background || this.emojiBackground;
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

        this.draftLoaded = true;
        this.draftSavedAt = payload._local_saved_at || Date.now();
      } catch (error) {
        console.warn('Unable to load draft', error);
      }
    },
    clearDraft() {
      try {
        localStorage.removeItem(this.draftStorageKey());
        this.draftLoaded = false;
        this.draftSavedAt = null;
        this.draftProductUuid = '';
      } catch (error) {
        console.warn('Unable to clear draft', error);
      }
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
      const tabChanged = this.activeTab !== tabName;
      this.activeTab = tabName;
      if (tabName === 'checkout') {
        this.previewMode = 'checkout';
      } else {
        this.previewMode = 'card';
      }
      if (tabChanged) {
        this.triggerImmediateAutosave({ notifySuccess: false, force: false });
      }
    },
    handleNextAction() {
      if (this.activeTab === 'thumb') {
        this.switchTab('checkout');
        return;
      }
      if (this.activeTab === 'checkout') {
        this.switchTab('options');
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
      this.form.fileDeliveryType = type;
      this.validateFileUrl();
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
      if (!this.showFileCard || this.form.fileDeliveryType !== 'url') {
        this.setValidationState('fileUrl', 'success', '');
        return true;
      }
      const value = this.form.fileUrl.trim();
      if (!value) {
        this.setValidationState('fileUrl', 'error', 'Destination URL is required for URL delivery.');
        return false;
      }
      if (!this.isValidUrl(value)) {
        this.setValidationState('fileUrl', 'error', 'Please enter a valid URL.');
        return false;
      }
      this.setValidationState('fileUrl', 'success', '');
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
        this.validateSupportedType(),
        this.validateTitle(),
        this.validateSubtitle(),
        this.validateSlug(),
        this.validateDescription(),
        this.validateCtaText(),
        this.validatePrice(),
        this.validateCompareAtPrice(),
        this.validateFileUrl(),
        this.validateExternalUrl(),
        this.validateLeadMagnetRedirectUrl(),
        this.validateServiceMeetingUrl(),
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
        short_description: 'subtitle',
        description: 'description',
        cta_text: 'ctaText',
        price: 'price',
        compare_at_price: 'compareAtPrice',
        destination_url: 'externalUrl',
        file_url: 'fileUrl',
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
      };
      if (this.draftProductUuid) {
        payload.product_uuid = this.draftProductUuid;
      }

      payload.builder_config = {
        ui_type: this.uiType,
        card_style: this.cardStyle,
        preview_emoji: this.emoji,
        preview_background: this.emojiBackground,
        headline: this.form.headline.trim(),
        file_delivery_type: this.form.fileDeliveryType,
        file_url: this.form.fileUrl.trim() || null,
        file_label: this.form.fileName.trim() || null,
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
    async saveDraftToApi({ notifySuccess = false, force = false } = {}) {
      if (this.isSubmitting || this.isHydratingDraft) {
        return;
      }
      if (!force && this.autosaveState !== 'dirty' && this.autosaveState !== 'error') {
        return;
      }
      if (this.isAutosaveInFlight) {
        this.pendingAutosave = true;
        return;
      }
      if (!this.validateDraftForm()) {
        this.autosaveState = 'error';
        this.autosaveErrorMessage = 'Please fix URL formatting before saving draft.';
        if (notifySuccess) {
          this.showToast('error', this.autosaveErrorMessage);
        }
        return;
      }

      this.isAutosaveInFlight = true;
      this.autosaveState = 'saving';
      this.autosaveErrorMessage = '';
      const requestId = ++this.autosaveRequestCounter;

      try {
        const payload = this.buildPayload('draft');
        const endpoint = this.getProductEndpoint();
        const response = await webService.post(endpoint, payload);
        if (requestId < this.latestHandledAutosaveRequest) {
          return;
        }
        this.latestHandledAutosaveRequest = requestId;

        if (response.data.code === 200) {
          const responseProductUuid = this.resolveProductUuidFromResponse(response.data);
          const savedAt = response?.data?.data?.saved_at || null;
          if (responseProductUuid) {
            this.draftProductUuid = responseProductUuid;
          }
          this.persistLocalDraft();
          this.draftSavedAt = savedAt ? Date.parse(savedAt) || Date.now() : Date.now();
          this.autosaveState = this.pendingAutosave ? 'dirty' : 'saved';
          if (notifySuccess) {
            this.showToast('success', response.data.message || 'Draft saved.');
          }
          return;
        }

        if (response.data.code === 600) {
          this.handleValidationErrors(response.data.errors);
          this.autosaveState = 'error';
          this.autosaveErrorMessage = response.data.message || 'Validation errors in draft.';
          if (notifySuccess) {
            this.showToast('error', this.autosaveErrorMessage);
          }
          return;
        }

        this.autosaveState = 'error';
        this.autosaveErrorMessage = response.data.message || 'Failed to save draft.';
        if (notifySuccess) {
          this.showToast('error', this.autosaveErrorMessage);
        }
      } catch (error) {
        const apiErrors = error?.response?.data?.errors || null;
        if (apiErrors) {
          this.handleValidationErrors(apiErrors);
        }
        this.autosaveState = 'error';
        this.autosaveErrorMessage = error?.response?.data?.message || 'Request failed while saving draft.';
        if (notifySuccess) {
          this.showToast('error', this.autosaveErrorMessage);
        }
      } finally {
        this.isAutosaveInFlight = false;
        if (this.pendingAutosave && !this.isSubmitting) {
          this.pendingAutosave = false;
          this.autosaveState = 'dirty';
          this.saveDraftToApi({ notifySuccess: false, force: true });
        }
      }
    },
    async saveDraft() {
      this.persistLocalDraft();
      this.autosaveState = 'dirty';
      await this.triggerImmediateAutosave({ notifySuccess: true, force: true });
    },
    retryAutosave() {
      this.triggerImmediateAutosave({ notifySuccess: true, force: true });
    },
    async waitForAutosaveToFinish(timeoutMs = 4000) {
      if (!this.isAutosaveInFlight) {
        return;
      }
      const start = Date.now();
      while (this.isAutosaveInFlight && Date.now() - start < timeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    },
    async submitProduct() {
      this.clearAutosaveTimer();
      this.resetValidationState();
      if (!this.validateForm()) {
        this.showToast('error', 'Please fix the highlighted fields.');
        return;
      }

      await this.waitForAutosaveToFinish();
      this.isSubmitting = true;
      try {
        const payload = this.buildPayload('publish');
        const endpoint = this.getProductEndpoint();
        const response = await webService.post(endpoint, payload);

        if (response.data.code === 200) {
          const productUuid = this.resolveProductUuidFromResponse(response.data) || this.draftProductUuid;
          this.clearDraft();
          this.autosaveState = 'idle';
          this.autosaveErrorMessage = '';
          this.pendingAutosave = false;
          this.showToast('success', response.data.message || 'Product created successfully.');
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

        this.showToast('error', response.data.message || 'Failed to create product. Please try again.');
      } catch (error) {
        const apiErrors = error?.response?.data?.errors || null;
        if (apiErrors) {
          this.handleValidationErrors(apiErrors);
        }
        this.showToast('error', error?.response?.data?.message || 'Request failed while creating product.');
      } finally {
        this.isSubmitting = false;
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
              <button type="button" class="ap2-tab-btn" :class="activeTab === 'checkout' ? 'active' : ''" @click="switchTab('checkout')">2. Checkout Page</button>
              <button type="button" class="ap2-tab-btn" :class="activeTab === 'options' ? 'active' : ''" @click="switchTab('options')">3. Options</button>
              <span class="ap2-fixed-type">{{ selectedType.emoji }} {{ selectedType.name }}</span>
            </div>
            <button
              type="button"
              class="ap2-btn-primary ap2-publish-btn"
              :class="(!isTypeSupported || isSubmitting) ? 'ap2-btn-disabled' : ''"
              :disabled="!isTypeSupported || isSubmitting"
              @click="submitProduct"
            >
              {{ isSubmitting ? 'Publishing...' : 'Publish Product' }}
            </button>
          </div>

          <div class="ap2-tab-content">
            <div v-show="activeTab === 'thumb'" class="ap2-section-stack">
              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Card Style</h3>
                  <p class="ap2-card-subtitle">How the product card looks in your store</p>
                </div>
                <div class="ap2-card-body">
                  <div class="ap2-style-grid">
                    <button type="button" class="ap2-style-option" :class="cardStyle === 'button' ? 'active' : ''" @click="selectCardStyle('button')">
                      <span class="ap2-style-preview ap2-style-preview-button">
                        <span class="ap2-style-demo">{{ emoji }}</span>
                        <span class="ap2-style-line"></span>
                        <span class="ap2-style-cta">Buy Now</span>
                      </span>
                      <span class="ap2-style-label">Button</span>
                    </button>
                    <button type="button" class="ap2-style-option" :class="cardStyle === 'callout' ? 'active' : ''" @click="selectCardStyle('callout')">
                      <span class="ap2-style-preview ap2-style-preview-callout">
                        <span class="ap2-style-callout-emoji">{{ emoji }}</span>
                        <span class="ap2-style-callout-type">{{ selectedType.name }}</span>
                      </span>
                      <span class="ap2-style-label">Callout</span>
                    </button>
                    <button type="button" class="ap2-style-option" :class="cardStyle === 'preview' ? 'active' : ''" @click="selectCardStyle('preview')">
                      <span class="ap2-style-preview ap2-style-preview-classic">
                        <span class="ap2-style-classic-top">{{ emoji }}</span>
                        <span class="ap2-style-classic-line"></span>
                        <span class="ap2-style-classic-btn"></span>
                      </span>
                      <span class="ap2-style-label">Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Thumbnail</h3>
                  <p class="ap2-card-subtitle">400 x 400 px recommended</p>
                </div>
                <div class="ap2-card-body">
                  <button type="button" class="ap2-upload-zone" @click="showToast('info', 'File picker would open here.')">
                    <div class="ap2-upload-icon">🖼️</div>
                    <p class="ap2-upload-title">Click to upload or drag & drop</p>
                    <p class="ap2-upload-hint">JPG, PNG, GIF, WebP · Max 5 MB</p>
                  </button>

                  <div class="ap2-emoji-divider">
                    <div class="ap2-emoji-divider-line"></div>
                    <span class="ap2-emoji-divider-label">OR PICK AN EMOJI STYLE</span>
                    <div class="ap2-emoji-divider-line"></div>
                  </div>

                  <div class="ap2-emoji-grid">
                    <button
                      v-for="option in emojiOptions"
                      :key="option.emoji"
                      type="button"
                      class="ap2-emoji-option"
                      :class="emoji === option.emoji ? 'active' : ''"
                      :style="{ background: option.bg }"
                      @click="selectEmoji(option)"
                    >
                      {{ option.emoji }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Card Text</h3>
                </div>
                <div class="ap2-card-body ap2-stack-lg">
                  <div>
                    <label class="ap2-label">Product Title <span class="text-error-500">*</span></label>
                    <input v-model="form.title" type="text" placeholder="e.g. The Ultimate Creator Course" :class="inputClasses('title')" @input="onTitleInput" />
                    <p class="ap2-hint">Keep it short and punchy - max 80 chars</p>
                    <p v-if="validation.title.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.title.message }}</p>
                  </div>

                  <div>
                    <div class="ap2-label-row">
                      <label class="ap2-label ap2-label-no-margin">Subtitle / Tagline <span class="text-error-500">*</span></label>
                      <span class="text-xs text-gray-500">{{ shortDescriptionLength }}/100</span>
                    </div>
                    <input v-model="form.subtitle" type="text" placeholder="e.g. 40 lessons - For beginners" :class="inputClasses('subtitle')" @input="onShortDescriptionInput" />
                    <p v-if="validation.subtitle.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.subtitle.message }}</p>
                  </div>

                  <div>
                    <label class="ap2-label">Button Text <span class="text-error-500">*</span></label>
                    <input v-model="form.ctaText" type="text" placeholder="Get Instant Access" :class="inputClasses('ctaText')" @input="validateCtaText" />
                    <p v-if="validation.ctaText.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.ctaText.message }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'checkout'" class="ap2-section-stack">
              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Checkout Banner</h3>
                </div>
                <div class="ap2-card-body">
                  <button type="button" class="ap2-upload-zone" @click="showToast('info', 'Banner upload would open here.')">
                    <div class="ap2-upload-icon">🖼️</div>
                    <p class="ap2-upload-title">Upload checkout page banner</p>
                    <p class="ap2-upload-hint">Shown at top of checkout · Max 10 MB</p>
                  </button>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Description</h3>
                </div>
                <div class="ap2-card-body ap2-stack-lg">
                  <div>
                    <label class="ap2-label">Headline</label>
                    <input v-model="form.headline" type="text" placeholder="What will your buyers get?" :class="inputClasses('description')" />
                  </div>
                  <div>
                    <label class="ap2-label">Description Body <span class="text-error-500">*</span></label>
                    <textarea v-model="form.description" rows="5" placeholder="Describe what's included, who it's for, and why they need it now..." :class="textareaClasses('description')" @input="validateDescription"></textarea>
                    <p v-if="validation.description.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.description.message }}</p>
                  </div>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Pricing</h3>
                </div>
                <div class="ap2-card-body ap2-stack-md">
                  <label class="ap2-toggle-row" :class="form.isFree ? 'active' : ''">
                    <div>
                      <p class="ap2-toggle-title">Free Product</p>
                      <p class="ap2-toggle-subtitle">No payment required - just email capture</p>
                    </div>
                    <input v-model="form.isFree" type="checkbox" class="sr-only" @change="toggleFreeProduct" />
                    <span class="ap2-switch" :class="form.isFree ? 'on' : ''"><span></span></span>
                  </label>

                  <div class="ap2-price-grid" :class="form.isFree ? 'is-disabled' : ''">
                    <div>
                      <label class="ap2-label">Price <span class="text-error-500">*</span></label>
                      <div class="relative">
                        <span class="ap2-dollar">$</span>
                        <input
                          v-model="form.price"
                          type="number"
                          step="0.01"
                          min="0"
                          :disabled="form.isFree"
                          :class="[inputClasses('price'), 'pl-9']"
                          placeholder="0.00"
                          @input="validatePrice"
                        />
                      </div>
                      <p v-if="validation.price.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.price.message }}</p>
                    </div>
                    <div>
                      <label class="ap2-label">Compare-at Price <span class="text-error-500">*</span></label>
                      <div class="relative">
                        <span class="ap2-dollar">$</span>
                        <input
                          v-model="form.compareAtPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          :disabled="form.isFree"
                          :class="[inputClasses('compareAtPrice'), 'pl-9']"
                          placeholder="0.00"
                          @input="validateCompareAtPrice"
                        />
                      </div>
                      <p v-if="validation.compareAtPrice.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.compareAtPrice.message }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showFileCard" class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Product File</h3>
                </div>
                <div class="ap2-card-body ap2-stack-sm">
                  <button type="button" class="ap2-file-type" :class="form.fileDeliveryType === 'upload' ? 'active' : ''" @click="selectFileType('upload')">
                    <span class="ap2-file-title">Upload a File</span>
                    <span class="ap2-file-subtitle">Direct upload - customers download immediately</span>
                  </button>
                  <div v-if="form.fileDeliveryType === 'upload'" class="ap2-upload-zone">
                    <div class="ap2-upload-icon">📎</div>
                    <p class="ap2-upload-title">Drag & drop your file here</p>
                    <p class="ap2-upload-hint">PDF, MP4, ZIP, PNG, PSD, XLS, SVG · Up to 5 GB</p>
                  </div>

                  <button type="button" class="ap2-file-type" :class="form.fileDeliveryType === 'url' ? 'active' : ''" @click="selectFileType('url')">
                    <span class="ap2-file-title">Redirect to URL</span>
                    <span class="ap2-file-subtitle">Google Drive, Dropbox, Notion, etc.</span>
                  </button>

                  <div v-if="form.fileDeliveryType === 'url'" class="ap2-stack-md">
                    <div>
                      <label class="ap2-label">Destination URL <span class="text-error-500">*</span></label>
                      <input v-model="form.fileUrl" type="url" placeholder="https://drive.google.com/file/d/..." :class="inputClasses('fileUrl')" @input="validateFileUrl" />
                      <p v-if="validation.fileUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.fileUrl.message }}</p>
                    </div>
                    <div>
                      <label class="ap2-label">File / Product Name</label>
                      <input v-model="form.fileName" type="text" placeholder="e.g. Ultimate Creator Playbook.pdf" :class="inputClasses('fileUrl')" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Collect Info from Buyers</h3>
                </div>
                <div class="ap2-card-body">
                  <div class="ap2-stack-xs">
                    <div v-for="(field, index) in collectFields" :key="field.id" class="ap2-collect-row">
                      <span class="text-gray-400">⠿</span>
                      <span class="ap2-collect-name">{{ field.name }}</span>
                      <span class="ap2-collect-type">{{ field.type }}</span>
                      <span v-if="field.locked" class="ap2-collect-lock">Always</span>
                      <button v-else type="button" class="ap2-del-btn" @click="removeCollectField(index)">✕</button>
                    </div>
                  </div>

                  <div class="ap2-chip-list">
                    <button
                      v-for="option in addFieldOptions"
                      :key="option.label"
                      type="button"
                      class="ap2-chip-btn"
                      @click="addCollectField(option)"
                    >
                      + {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'options'" class="ap2-section-stack">
              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Social Proof</h3>
                </div>
                <div class="ap2-card-body ap2-stack-sm">
                  <label class="ap2-toggle-row" :class="form.enableReviews ? 'active' : ''">
                    <div>
                      <p class="ap2-toggle-title">Enable Reviews</p>
                      <p class="ap2-toggle-subtitle">Let buyers leave star ratings and written reviews</p>
                    </div>
                    <input v-model="form.enableReviews" type="checkbox" class="sr-only" />
                    <span class="ap2-switch" :class="form.enableReviews ? 'on' : ''"><span></span></span>
                  </label>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Marketing & Automation</h3>
                </div>
                <div class="ap2-card-body ap2-stack-sm">
                  <label class="ap2-toggle-row" :class="form.emailFlows ? 'active' : ''">
                    <div>
                      <p class="ap2-toggle-title">Email Flows</p>
                      <p class="ap2-toggle-subtitle">Send automated emails after purchase or sign-up</p>
                    </div>
                    <input v-model="form.emailFlows" type="checkbox" class="sr-only" />
                    <span class="ap2-switch" :class="form.emailFlows ? 'on' : ''"><span></span></span>
                  </label>

                  <label class="ap2-toggle-row ap2-toggle-row-disabled">
                    <div>
                      <p class="ap2-toggle-title">Order Bumps <span class="ap2-pro-badge">PRO</span></p>
                      <p class="ap2-toggle-subtitle">Suggest an add-on product at checkout</p>
                    </div>
                    <input v-model="form.orderBumps" type="checkbox" class="sr-only" disabled />
                    <span class="ap2-switch"><span></span></span>
                  </label>

                  <label class="ap2-toggle-row ap2-toggle-row-disabled">
                    <div>
                      <p class="ap2-toggle-title">Affiliate Share <span class="ap2-pro-badge">PRO</span></p>
                      <p class="ap2-toggle-subtitle">Let fans earn a percentage by promoting this product</p>
                    </div>
                    <input v-model="form.affiliateShare" type="checkbox" class="sr-only" disabled />
                    <span class="ap2-switch"><span></span></span>
                  </label>

                  <label class="ap2-toggle-row" :class="form.upsellAfterPurchase ? 'active' : ''">
                    <div>
                      <p class="ap2-toggle-title">Upsell After Purchase</p>
                      <p class="ap2-toggle-subtitle">Redirect to another product after checkout</p>
                    </div>
                    <input v-model="form.upsellAfterPurchase" type="checkbox" class="sr-only" />
                    <span class="ap2-switch" :class="form.upsellAfterPurchase ? 'on' : ''"><span></span></span>
                  </label>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Confirmation Email</h3>
                  <p class="ap2-card-subtitle">Sent to buyer immediately after purchase</p>
                </div>
                <div class="ap2-card-body ap2-stack-md">
                  <div>
                    <label class="ap2-label">Subject Line</label>
                    <input v-model="form.emailSubject" type="text" placeholder="🎉 You're in! Here's your access" :class="inputClasses('emailSubject')" />
                  </div>

                  <div>
                    <label class="ap2-label">Email Body</label>
                    <textarea v-model="form.emailBody" rows="4" class="ap2-input ap2-textarea"></textarea>
                  </div>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">SEO</h3>
                </div>
                <div class="ap2-card-body ap2-stack-md">
                  <div>
                    <label class="ap2-label">Product Slug <span class="text-error-500">*</span></label>
                    <div class="flex">
                      <span class="ap2-slug-prefix">creatoros.io/store/</span>
                      <input v-model="form.slug" type="text" placeholder="product-slug" class="ap2-slug-input" :class="inputClasses('slug')" @input="onSlugInput" />
                    </div>
                    <p v-if="validation.slug.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.slug.message }}</p>
                  </div>

                  <div>
                    <label class="ap2-label">Meta Title</label>
                    <input v-model="form.metaTitle" type="text" placeholder="SEO title (max 60 chars)" :class="inputClasses('metaTitle')" />
                  </div>

                  <div>
                    <label class="ap2-label">Meta Description</label>
                    <textarea v-model="form.metaDescription" rows="2" placeholder="SEO description (max 160 chars)" class="ap2-input ap2-textarea"></textarea>
                  </div>
                </div>
              </div>

              <div class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">Publish Settings</h3>
                </div>
                <div class="ap2-card-body ap2-stack-md">
                  <label class="ap2-toggle-row" :class="form.isFeatured ? 'active' : ''">
                    <div>
                      <p class="ap2-toggle-title">Featured Product</p>
                      <p class="ap2-toggle-subtitle">Pin to the top of your store page</p>
                    </div>
                    <input v-model="form.isFeatured" type="checkbox" class="sr-only" />
                    <span class="ap2-switch" :class="form.isFeatured ? 'on' : ''"><span></span></span>
                  </label>

                  <label class="ap2-toggle-row" :class="form.publishImmediately ? 'active' : ''">
                    <div>
                      <p class="ap2-toggle-title">Publish Immediately</p>
                      <p class="ap2-toggle-subtitle">Make live as soon as you hit publish</p>
                    </div>
                    <input v-model="form.publishImmediately" type="checkbox" class="sr-only" @change="onPublishImmediatelyChange" />
                    <span class="ap2-switch" :class="form.publishImmediately ? 'on' : ''"><span></span></span>
                  </label>

                  <div>
                    <label class="ap2-label">Scheduled Publish Date</label>
                    <input v-model="form.scheduledPublishAt" type="datetime-local" :disabled="form.publishImmediately" :class="inputClasses('scheduledPublishAt')" />
                    <p class="ap2-hint">Leave blank to publish immediately</p>
                  </div>
                </div>
              </div>

              <div v-if="showTypeSettings" class="ap2-card">
                <div class="ap2-card-header">
                  <h3 class="ap2-card-title">{{ typeSettingsTitle }}</h3>
                </div>
                <div class="ap2-card-body ap2-stack-md">
                  <template v-if="uiType === 'custom_service'">
                    <div class="ap2-grid-2">
                      <div>
                        <label class="ap2-label">Session Duration (mins)</label>
                        <input v-model="form.serviceSessionDuration" type="number" min="0" :class="inputClasses('serviceSessionDuration')" />
                      </div>
                      <div>
                        <label class="ap2-label">Platform</label>
                        <select v-model="form.servicePlatform" class="ap2-input">
                          <option>Zoom</option>
                          <option>Google Meet</option>
                          <option>Microsoft Teams</option>
                          <option>Phone</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div>
                        <label class="ap2-label">Buffer Before (mins)</label>
                        <input v-model="form.serviceBufferBefore" type="number" min="0" :class="inputClasses('serviceBufferBefore')" />
                      </div>
                      <div>
                        <label class="ap2-label">Buffer After (mins)</label>
                        <input v-model="form.serviceBufferAfter" type="number" min="0" :class="inputClasses('serviceBufferAfter')" />
                      </div>
                      <div>
                        <label class="ap2-label">Max Bookings/Day</label>
                        <input v-model="form.serviceMaxBookingsPerDay" type="number" min="0" placeholder="Unlimited" :class="inputClasses('serviceMaxBookingsPerDay')" />
                      </div>
                      <div>
                        <label class="ap2-label">Advance Booking Days</label>
                        <input v-model="form.serviceAdvanceBookingDays" type="number" min="0" :class="inputClasses('serviceAdvanceBookingDays')" />
                      </div>
                    </div>

                    <div>
                      <label class="ap2-label">Custom Meeting URL</label>
                      <input v-model="form.serviceMeetingUrl" type="url" placeholder="https://zoom.us/my/yourroom" :class="inputClasses('serviceMeetingUrl')" @input="validateServiceMeetingUrl" />
                      <p v-if="validation.serviceMeetingUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.serviceMeetingUrl.message }}</p>
                    </div>
                  </template>

                  <template v-else-if="uiType === 'lead_magnet'">
                    <div>
                      <label class="ap2-label">CTA Button Label</label>
                      <input v-model="form.leadMagnetCtaLabel" type="text" placeholder="Get Free Access" :class="inputClasses('leadMagnetCtaLabel')" />
                    </div>
                    <div>
                      <label class="ap2-label">Success Message</label>
                      <textarea v-model="form.leadMagnetSuccessMessage" rows="3" placeholder="Shown after email is submitted..." class="ap2-input ap2-textarea"></textarea>
                    </div>
                    <div>
                      <label class="ap2-label">Redirect URL</label>
                      <input v-model="form.leadMagnetRedirectUrl" type="url" placeholder="https://your-redirect-page.com" :class="inputClasses('leadMagnetRedirectUrl')" @input="validateLeadMagnetRedirectUrl" />
                      <p v-if="validation.leadMagnetRedirectUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.leadMagnetRedirectUrl.message }}</p>
                    </div>
                  </template>

                  <template v-else-if="uiType === 'external_link'">
                    <div>
                      <label class="ap2-label">Destination URL <span class="text-error-500">*</span></label>
                      <input v-model="form.externalUrl" type="url" placeholder="https://youtube.com/watch?v=..." :class="inputClasses('externalUrl')" @input="validateExternalUrl" />
                      <p v-if="validation.externalUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.externalUrl.message }}</p>
                    </div>
                    <div>
                      <label class="ap2-label">Link Label</label>
                      <input v-model="form.externalLabel" type="text" placeholder="e.g. Watch the Free Masterclass" :class="inputClasses('externalLabel')" />
                    </div>
                    <label class="ap2-toggle-row" :class="form.externalShowAfterPurchase ? 'active' : ''">
                      <div>
                        <p class="ap2-toggle-title">Show Link After Purchase</p>
                        <p class="ap2-toggle-subtitle">Display URL on the order confirmation page</p>
                      </div>
                      <input v-model="form.externalShowAfterPurchase" type="checkbox" class="sr-only" />
                      <span class="ap2-switch" :class="form.externalShowAfterPurchase ? 'on' : ''"><span></span></span>
                    </label>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="ap2-bottom-bar">
            <div class="ap2-draft-note">
              <span class="ap2-draft-dot"></span>
              {{ autosaveStatusText }}
            </div>
            <div class="ap2-bottom-actions">
              <button
                v-if="autosaveState === 'error'"
                type="button"
                class="ap2-btn-secondary"
                :disabled="isSubmitting"
                @click="retryAutosave"
              >
                Retry Save
              </button>
              <button type="button" class="ap2-btn-secondary" :disabled="isSubmitting" @click="saveDraft">{{ saveDraftButtonLabel }}</button>
              <button type="button" class="ap2-btn-primary" :class="isSubmitting ? 'ap2-btn-disabled' : ''" :disabled="isSubmitting" @click="handleNextAction">{{ nextButtonLabel }}</button>
            </div>
          </div>
        </section>

        <aside class="ap2-preview-col">
          <div class="ap2-preview-label">PRODUCT PREVIEW</div>

          <div v-show="previewMode === 'card'" class="ap2-preview-wrap">
            <div v-if="cardStyle === 'callout'" :class="previewCardClasses" :style="previewCalloutCardStyle">
              <div class="ap2-pcard-image" :style="previewCalloutImageStyle">
                {{ emoji }}
                <div
                  style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font-size:9px;font-weight:800;letter-spacing:.08em;color:rgba(255,255,255,.9);"
                >
                  {{ previewTypeLabel }}
                </div>
              </div>
              <div class="ap2-pcard-body">
                <div class="ap2-pcard-title" style="color:#fff;">{{ previewTitle }}</div>
                <div class="ap2-pcard-subtitle" style="color:rgba(255,255,255,.9);">{{ previewSubtitle }}</div>
                <div class="ap2-pcard-price-row">
                  <div class="ap2-pcard-price" :class="form.isFree ? 'free' : ''" style="color:#fff;">{{ previewPrice }}</div>
                  <div v-if="previewCompareAtPrice" class="ap2-pcard-compare" style="color:rgba(255,255,255,.85);">{{ previewCompareAtPrice }}</div>
                </div>
              </div>
              <div class="ap2-pcard-btn" style="background:rgba(255,255,255,.18);color:#fff;">{{ form.ctaText || 'Get Instant Access' }}</div>
            </div>

            <div v-else-if="cardStyle === 'preview'" :class="previewCardClasses">
              <div class="ap2-pcard-image" :style="previewClassicImageStyle">{{ emoji }}</div>
              <div class="ap2-pcard-body" style="padding:10px 12px 6px;">
                <div class="ap2-pcard-title" style="font-size:12.5px;">{{ previewTitle }}</div>
                <div class="ap2-pcard-subtitle" style="font-size:10.5px;">{{ previewSubtitle }}</div>
                <div class="ap2-pcard-price-row">
                  <div class="ap2-pcard-price" :class="form.isFree ? 'free' : ''" style="font-size:15px;">{{ previewPrice }}</div>
                  <div v-if="previewCompareAtPrice" class="ap2-pcard-compare">{{ previewCompareAtPrice }}</div>
                </div>
              </div>
              <div class="ap2-pcard-btn" style="margin:0 12px 12px;border-radius:6px;padding:8px;font-size:11px;">{{ form.ctaText || 'Get Instant Access' }}</div>
            </div>

            <div v-else :class="previewCardClasses" style="padding:14px;">
              <div class="ap2-pcard-image" :style="previewButtonImageStyle">{{ emoji }}</div>
              <div class="ap2-pcard-body" style="padding:0 0 8px;">
                <div class="ap2-pcard-title">{{ previewTitle }}</div>
                <div class="ap2-pcard-subtitle">{{ previewSubtitle }}</div>
                <div class="ap2-pcard-price-row" style="margin-bottom:8px;">
                  <div class="ap2-pcard-price" :class="form.isFree ? 'free' : ''">{{ previewPrice }}</div>
                  <div v-if="previewCompareAtPrice" class="ap2-pcard-compare">{{ previewCompareAtPrice }}</div>
                </div>
              </div>
              <div class="ap2-pcard-btn" style="margin:0;border-radius:10px;">{{ form.ctaText || 'Get Instant Access' }}</div>
            </div>
          </div>

          <div v-show="previewMode === 'checkout'" class="ap2-preview-wrap">
            <div class="ap2-checkout-preview">
              <div class="ap2-checkout-banner" :style="{ background: emojiBackground }">{{ emoji }}</div>
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
