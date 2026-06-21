const defaultEmojiBackground = 'linear-gradient(135deg,#5B4FE9,#A78BFA)';

export function createProductForm() {
  const form = {
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
    emailBody: `Hey {{first_name}},\n\nThank you so much for your purchase! Here's how to access your product:\n\n{{product_access_link}}\n\nLet me know if you have any questions 🙌`,
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
  };

  const collectFields = [
    { id: 'name', name: 'Name', type: 'text', locked: true },
    { id: 'email', name: 'Email Address', type: 'email', locked: true },
  ];

  const validation = {
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
  };

  const productTypes = [
    { id: 'digital_download', apiType: 'digital_download', emoji: '📁', name: 'Digital Download' },
    { id: 'lead_magnet', apiType: 'lead_magnet', emoji: '📧', name: 'Lead Magnet' },
    { id: 'external_link', apiType: 'external_link', emoji: '🔗', name: 'External Link' },
    { id: 'custom_service', apiType: 'custom_service', emoji: '📅', name: 'Custom Service' },
  ];

  const emojiOptions = [
        { emoji: '📁', bg: defaultEmojiBackground },
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
      ];

  const state = {
    uiType: 'digital_download',
    cardStyle: 'button',
    emoji: '📁',
    emojiBackground: defaultEmojiBackground,
    draftProductUuid: '',
  };

  function draftStorageKey() {
    return 'creator_add_product_draft';
  }

  function persistLocalDraft() {
    try {
      const payload = buildPayload('draft');
      payload._local_saved_at = Date.now();
      localStorage.setItem(draftStorageKey(), JSON.stringify(payload));
      return true;
    } catch (err) {
      console.warn('Unable to save local draft', err);
      return false;
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(draftStorageKey());
      state.draftProductUuid = '';
      return true;
    } catch (err) {
      console.warn('Unable to clear draft', err);
      return false;
    }
  }

  function hydrateFromPayload(payload) {
    if (!payload || typeof payload !== 'object') return;
    const builderConfig = payload.builder_config || {};
    const seo = builderConfig.seo || {};
    const socialProof = builderConfig.social_proof || {};
    const marketing = builderConfig.marketing_automation || {};
    const confirmationEmail = builderConfig.confirmation_email || {};
    const typeSettings = builderConfig.type_settings || {};

    Object.assign(form, {
      title: payload.title || '',
      subtitle: payload.short_description || payload.subtitle || '',
      slug: payload.slug || '',
      metaTitle: seo.meta_title || payload.meta_title || '',
      metaDescription: seo.meta_description || payload.meta_description || '',
      description: payload.description || '',
      ctaText: payload.cta_text || '',
      price: payload.price ?? '',
      compareAtPrice: payload.compare_at_price ?? '',
      enableReviews: socialProof.enable_reviews ?? payload.enable_reviews ?? true,
      emailFlows: marketing.email_flows ?? payload.email_flows ?? false,
      orderBumps: marketing.order_bumps ?? payload.order_bumps ?? false,
      affiliateShare: marketing.affiliate_share ?? payload.affiliate_share ?? false,
      upsellAfterPurchase: marketing.upsell_after_purchase ?? payload.upsell_after_purchase ?? false,
      emailSubject: confirmationEmail.subject || payload.email_subject || form.emailSubject,
      emailBody: confirmationEmail.body || payload.email_body || form.emailBody,
      isFeatured: payload.is_featured ?? false,
      publishImmediately: builderConfig.publish_immediately ?? payload.publish_immediately ?? true,
      scheduledPublishAt: builderConfig.scheduled_publish_at || payload.scheduled_publish_at || '',
      fileDeliveryType: builderConfig.file_delivery_type || payload.file_delivery_type || 'upload',
      fileUrl: builderConfig.file_url || payload.file_url || '',
      fileName: builderConfig.file_label || payload.file_label || '',
      externalUrl: builderConfig.external_url || payload.external_url || '',
      externalLabel: builderConfig.external_label || payload.external_label || '',
    });

    state.uiType = builderConfig.ui_type || payload.ui_type || state.uiType;
    state.cardStyle = builderConfig.card_style || payload.card_style || state.cardStyle;
    state.emoji = builderConfig.preview_emoji || payload.preview_emoji || state.emoji;
    state.emojiBackground = builderConfig.preview_background || payload.preview_background || state.emojiBackground;
    state.draftProductUuid = payload.product_uuid || state.draftProductUuid;
  }

  function buildTypeSettings() {
    const typeSettings = {};
    if (state.uiType === 'custom_service') {
      typeSettings.session_duration = form.serviceSessionDuration || null;
      typeSettings.platform = form.servicePlatform || null;
      typeSettings.buffer_before = form.serviceBufferBefore || null;
      typeSettings.buffer_after = form.serviceBufferAfter || null;
      typeSettings.max_bookings_per_day = form.serviceMaxBookingsPerDay || null;
      typeSettings.advance_booking_days = form.serviceAdvanceBookingDays || null;
      typeSettings.meeting_url = form.serviceMeetingUrl.trim() || null;
    } else if (state.uiType === 'lead_magnet') {
      typeSettings.cta_label = form.leadMagnetCtaLabel.trim() || null;
      typeSettings.success_message = form.leadMagnetSuccessMessage.trim() || null;
      typeSettings.redirect_url = form.leadMagnetRedirectUrl.trim() || null;
    } else if (state.uiType === 'external_link') {
      typeSettings.destination_url = form.externalUrl.trim() || null;
      typeSettings.link_label = form.externalLabel.trim() || null;
      typeSettings.show_after_purchase = form.externalShowAfterPurchase;
    }
    return typeSettings;
  }

  function buildPayload(saveMode = 'publish') {
    const numericPrice = Number(form.price);
    const numericCompareAtPrice = Number(form.compareAtPrice);
    const isDraftMode = saveMode === 'draft';
    const payload = {
      save_mode: saveMode,
      type_code: (productTypes.find((t) => t.id === state.uiType) || productTypes[0]).apiType,
      title: form.title.trim(),
      slug: form.slug.trim(),
      short_description: form.subtitle.trim(),
      description: form.description.trim(),
      cta_text: form.ctaText.trim(),
      price: form.isFree ? 0 : (isDraftMode && form.price === '' ? null : (Number.isNaN(numericPrice) ? null : numericPrice)),
      compare_at_price: form.isFree ? 0 : (isDraftMode && form.compareAtPrice === '' ? null : (Number.isNaN(numericCompareAtPrice) ? null : numericCompareAtPrice)),
      is_free: form.isFree,
      is_featured: form.isFeatured,
    };

    if (state.draftProductUuid) payload.product_uuid = state.draftProductUuid;

    payload.builder_config = {
      ui_type: state.uiType,
      card_style: state.cardStyle,
      preview_emoji: state.emoji,
      preview_background: state.emojiBackground,
      headline: form.headline.trim(),
      file_delivery_type: form.fileDeliveryType,
      file_url: form.fileUrl.trim() || null,
      file_label: form.fileName.trim() || null,
      external_url: form.externalUrl.trim() || null,
      external_label: form.externalLabel.trim() || null,
      publish_immediately: form.publishImmediately,
      scheduled_publish_at: form.publishImmediately ? null : (form.scheduledPublishAt || null),
      social_proof: { enable_reviews: form.enableReviews },
      marketing_automation: {
        email_flows: form.emailFlows,
        order_bumps: form.orderBumps,
        affiliate_share: form.affiliateShare,
        upsell_after_purchase: form.upsellAfterPurchase,
      },
      confirmation_email: { subject: form.emailSubject.trim() || null, body: form.emailBody.trim() || null },
      seo: { meta_title: form.metaTitle.trim() || null, meta_description: form.metaDescription.trim() || null },
      type_settings: buildTypeSettings(),
      collect_fields: collectFields.map((field) => ({ name: field.name, type: field.type })),
    };

    return payload;
  }

  return Object.assign(state, {
    form,
    collectFields,
    validation,
    productTypes,
    emojiOptions,
  });
}

export default { createProductForm };
