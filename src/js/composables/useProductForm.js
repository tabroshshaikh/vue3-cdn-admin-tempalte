const { env } = await import(`/src/js/config/env.js?v=${v}`);

const defaultEmojiBackground = 'linear-gradient(135deg,#5B4FE9,#A78BFA)';
const defaultBadgeColor = '#10B981';
const legacyBadgeColors = {
  red: '#EF4444',
  green: defaultBadgeColor,
  blue: '#3B82F6',
  orange: '#F97316',
};

export function normalizeBadgeColor(value) {
  const color = String(value || '').trim();
  const legacyColor = legacyBadgeColors[color.toLowerCase()];

  if (legacyColor) {
    return legacyColor;
  }

  return /^#[0-9a-f]{6}$/i.test(color) ? color.toUpperCase() : defaultBadgeColor;
}

function normalizeBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }

  return Boolean(value);
}

function normalizeDateTimeLocal(value) {
  const dateTime = String(value || '').trim();
  if (!dateTime) {
    return '';
  }

  return dateTime.replace(' ', 'T').slice(0, 16);
}

function normalizeServicePlatform(value) {
  const platform = String(value || '').trim().toLowerCase();
  const platforms = {
    zoom: 'Zoom',
    'google meet': 'Google Meet',
    google_meet: 'Google Meet',
    'microsoft teams': 'Microsoft Teams',
    microsoft_teams: 'Microsoft Teams',
    phone: 'Phone',
    custom: 'Custom',
  };

  return platforms[platform] || value || 'Zoom';
}

export function normalizeCollectFields(value) {
  let fields = value;

  if (typeof fields === 'string') {
    try {
      fields = JSON.parse(fields);
    } catch (error) {
      console.warn('Unable to parse product collect fields', error);
      fields = [];
    }
  }

  if (!Array.isArray(fields)) {
    return [];
  }

  return fields.map((field) => {
    const name = String(field?.name || '');
    const type = String(field?.type || 'text');
    const isRequiredField = type === 'email' || name.toLowerCase() === 'name';

    return {
      name,
      type,
      locked: field?.locked ?? isRequiredField,
    };
  });
}

export function normalizeProductPayload(source) {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const payload = source.data && typeof source.data === 'object' ? source.data : source;
  const builderConfig = payload.builder_config || {};
  const typeRecord = payload.type_record || {};
  const marketingRecord = payload.marketing || {};
  const existingTypeSettings = builderConfig.type_settings || payload.type_settings || {};
  const typeCode = payload.type_code || builderConfig.ui_type || payload.ui_type || 'digital_download';
  const badgeEnabled = payload.card_badge_enabled ?? builderConfig.card_badge_enabled;
  const badgeText = payload.badge_text ?? payload.card_badge_text ?? builderConfig.card_badge_text;
  const badgeColor = payload.badge_color ?? payload.card_badge_color ?? builderConfig.card_badge_color;
  const publishImmediately = normalizeBoolean(
    payload.publish_immediately ?? builderConfig.publish_immediately,
    false
  );

  const typeSettings = { ...existingTypeSettings };
  const normalizedBuilderConfig = {
    ...builderConfig,
    ui_type: typeCode,
    card_style: payload.card_style || builderConfig.card_style || 'button',
    preview_emoji: payload.preview_emoji || builderConfig.preview_emoji || '',
    preview_background: payload.preview_background || builderConfig.preview_background || defaultEmojiBackground,
    headline: payload.headline ?? builderConfig.headline ?? '',
    publish_immediately: publishImmediately,
    scheduled_publish_at: publishImmediately
      ? ''
      : normalizeDateTimeLocal(
          payload.scheduled_publish_at
          || builderConfig.scheduled_publish_at
          || payload.publish_at
        ),
  };

  if (typeCode === 'digital_download') {
    normalizedBuilderConfig.file_delivery_type = typeRecord.file_delivery_type
      || builderConfig.file_delivery_type
      || payload.file_delivery_type
      || 'upload';
    normalizedBuilderConfig.file_url = typeRecord.file_url
      ?? builderConfig.file_url
      ?? payload.file_url
      ?? '';
    normalizedBuilderConfig.file_label = typeRecord.file_name
      ?? builderConfig.file_label
      ?? payload.file_name
      ?? payload.file_label
      ?? '';
  } else if (typeCode === 'lead_magnet') {
    typeSettings.cta_label = typeRecord.cta_label
      ?? existingTypeSettings.cta_label
      ?? payload.cta_label
      ?? 'Get Free Access';
    typeSettings.success_message = typeRecord.success_message
      ?? existingTypeSettings.success_message
      ?? payload.success_message
      ?? '';
    typeSettings.redirect_url = typeRecord.redirect_url
      ?? existingTypeSettings.redirect_url
      ?? payload.redirect_url
      ?? '';
  } else if (typeCode === 'external_link') {
    typeSettings.destination_url = typeRecord.destination_url
      ?? existingTypeSettings.destination_url
      ?? builderConfig.external_url
      ?? payload.external_url
      ?? '';
    typeSettings.link_label = typeRecord.link_label
      ?? existingTypeSettings.link_label
      ?? builderConfig.external_label
      ?? payload.external_label
      ?? '';
    typeSettings.show_after_purchase = normalizeBoolean(
      typeRecord.show_after_purchase
      ?? existingTypeSettings.show_after_purchase
      ?? payload.show_after_purchase,
      true
    );
    normalizedBuilderConfig.external_url = typeSettings.destination_url;
    normalizedBuilderConfig.external_label = typeSettings.link_label;
  } else if (typeCode === 'custom_service') {
    typeSettings.session_duration = typeRecord.duration_minutes
      ?? existingTypeSettings.session_duration
      ?? payload.session_duration
      ?? '60';
    typeSettings.platform = normalizeServicePlatform(
      typeRecord.platform
      ?? existingTypeSettings.platform
      ?? payload.platform
    );
    typeSettings.buffer_before = typeRecord.buffer_before_minutes
      ?? existingTypeSettings.buffer_before
      ?? payload.buffer_before
      ?? '0';
    typeSettings.buffer_after = typeRecord.buffer_after_minutes
      ?? existingTypeSettings.buffer_after
      ?? payload.buffer_after
      ?? '15';
    typeSettings.max_bookings_per_day = typeRecord.max_bookings_per_day
      ?? existingTypeSettings.max_bookings_per_day
      ?? payload.max_bookings_per_day
      ?? '';
    typeSettings.advance_booking_days = typeRecord.advance_booking_days
      ?? existingTypeSettings.advance_booking_days
      ?? payload.advance_booking_days
      ?? '30';
    typeSettings.meeting_url = typeRecord.custom_meeting_url
      ?? existingTypeSettings.meeting_url
      ?? payload.meeting_url
      ?? '';
  }

  const collectFields = normalizeCollectFields(
    marketingRecord.collect_fields
    ?? builderConfig.collect_fields
    ?? payload.collect_fields
  );

  normalizedBuilderConfig.type_settings = typeSettings;
  normalizedBuilderConfig.social_proof = {
    ...(builderConfig.social_proof || {}),
    enable_reviews: normalizeBoolean(
      marketingRecord.enable_reviews
      ?? builderConfig.social_proof?.enable_reviews
      ?? payload.enable_reviews,
      true
    ),
  };
  normalizedBuilderConfig.marketing_automation = {
    ...(builderConfig.marketing_automation || {}),
    email_flows: normalizeBoolean(
      marketingRecord.email_flows
      ?? builderConfig.marketing_automation?.email_flows
      ?? payload.email_flows
    ),
    order_bumps: normalizeBoolean(
      marketingRecord.order_bumps
      ?? builderConfig.marketing_automation?.order_bumps
      ?? payload.order_bumps
    ),
    affiliate_share: normalizeBoolean(
      marketingRecord.affiliate_share
      ?? builderConfig.marketing_automation?.affiliate_share
      ?? payload.affiliate_share
    ),
    upsell_after_purchase: normalizeBoolean(
      marketingRecord.upsell_after_purchase
      ?? builderConfig.marketing_automation?.upsell_after_purchase
      ?? payload.upsell_after_purchase
    ),
  };
  normalizedBuilderConfig.confirmation_email = {
    ...(builderConfig.confirmation_email || {}),
    subject: marketingRecord.confirmation_email_subject
      ?? builderConfig.confirmation_email?.subject
      ?? payload.email_subject
      ?? '',
    body: marketingRecord.confirmation_email_body
      ?? builderConfig.confirmation_email?.body
      ?? payload.email_body
      ?? '',
  };
  normalizedBuilderConfig.seo = {
    ...(builderConfig.seo || {}),
    meta_title: payload.meta_title ?? builderConfig.seo?.meta_title ?? '',
    meta_description: payload.meta_description ?? builderConfig.seo?.meta_description ?? '',
  };
  normalizedBuilderConfig.collect_fields = collectFields;

  return {
    ...payload,
    ui_type: typeCode,
    is_free: normalizeBoolean(payload.is_free),
    is_featured: normalizeBoolean(payload.is_featured),
    card_badge_enabled: badgeEnabled === undefined || badgeEnabled === null
      ? undefined
      : normalizeBoolean(badgeEnabled),
    badge_text: badgeText,
    badge_color: badgeColor ? normalizeBadgeColor(badgeColor) : undefined,
    publish_immediately: publishImmediately,
    scheduled_publish_at: normalizedBuilderConfig.scheduled_publish_at,
    collect_fields: collectFields,
    builder_config: normalizedBuilderConfig,
  };
}

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
    publishImmediately: false,
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
    thumbnail: '',
    thumbnailUrl: '',
    checkoutBanner: '',
    checkoutBannerUrl: '',
    productFileUrl: '',
    cardButtonColor: '#5B4FE9',
    cardBadgeEnabled: true,
    badge_text: 'BESTSELLER',
    badge_color: defaultBadgeColor,
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
    fileName: { status: null, message: '' },
    productFile: { status: null, message: '' },
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

  function hydrateFromPayload(payload) {
    if (!payload || typeof payload !== 'object') return;
    payload = normalizeProductPayload(payload);
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
      emailSubject: confirmationEmail.subject || payload.email_subject || form.emailSubject,
      emailBody: confirmationEmail.body || payload.email_body || form.emailBody,
      isFeatured: payload.is_featured ?? false,
      publishImmediately: builderConfig.publish_immediately ?? payload.publish_immediately ?? false,
      scheduledPublishAt: builderConfig.scheduled_publish_at || payload.scheduled_publish_at || '',
      fileDeliveryType: builderConfig.file_delivery_type || payload.file_delivery_type || 'upload',
      fileUrl: builderConfig.file_url || payload.file_url || '',
      fileName: builderConfig.file_label || payload.file_label || '',
      externalUrl: builderConfig.external_url || payload.external_url || '',
      externalLabel: builderConfig.external_label || payload.external_label || '',
      cardButtonColor: builderConfig.card_button_color || payload.card_button_color || form.cardButtonColor,
      cardBadgeEnabled: payload.card_badge_enabled ?? builderConfig.card_badge_enabled ?? form.cardBadgeEnabled,
      badge_text: payload.badge_text || builderConfig.card_badge_text || payload.card_badge_text || form.badge_text,
      badge_color: normalizeBadgeColor(payload.badge_color || builderConfig.card_badge_color || payload.card_badge_color || form.badge_color),
      externalShowAfterPurchase: typeSettings.show_after_purchase ?? payload.show_after_purchase ?? true,
      leadMagnetCtaLabel: typeSettings.cta_label || payload.cta_label || form.leadMagnetCtaLabel,
      leadMagnetSuccessMessage: typeSettings.success_message || payload.success_message || '',
      leadMagnetRedirectUrl: typeSettings.redirect_url || payload.redirect_url || '',
      serviceSessionDuration: typeSettings.session_duration ?? payload.session_duration ?? form.serviceSessionDuration,
      servicePlatform: typeSettings.platform || payload.platform || form.servicePlatform,
      serviceBufferBefore: typeSettings.buffer_before ?? payload.buffer_before ?? form.serviceBufferBefore,
      serviceBufferAfter: typeSettings.buffer_after ?? payload.buffer_after ?? form.serviceBufferAfter,
      serviceMaxBookingsPerDay: typeSettings.max_bookings_per_day ?? payload.max_bookings_per_day ?? '',
      serviceAdvanceBookingDays: typeSettings.advance_booking_days ?? payload.advance_booking_days ?? form.serviceAdvanceBookingDays,
      serviceMeetingUrl: typeSettings.meeting_url || payload.meeting_url || '',
    });

    state.uiType = builderConfig.ui_type || payload.ui_type || state.uiType;
    state.cardStyle = builderConfig.card_style || payload.card_style || state.cardStyle;
    state.emoji = builderConfig.preview_emoji || payload.preview_emoji || state.emoji;
    state.emojiBackground = builderConfig.preview_background || payload.preview_background || state.emojiBackground;
    const bannerRaw = payload.checkout_banner_url || builderConfig.checkout_banner || payload.checkout_banner || '';
    form.checkoutBanner = bannerRaw;
    form.checkoutBannerUrl = bannerRaw ? `${env.BASE_URL}/${bannerRaw}` : '';
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
      card_badge_enabled: form.cardBadgeEnabled,
      badge_text: form.badge_text.trim() || null,
      badge_color: normalizeBadgeColor(form.badge_color),
    };

    if (state.draftProductUuid) payload.product_uuid = state.draftProductUuid;

    if (form.thumbnail) {
      payload.thumbnail_url = form.thumbnail;
    }

    if (form.checkoutBanner) {
      payload.checkout_banner_url = form.checkoutBanner;
    }

    payload.builder_config = {
      ui_type: state.uiType,
      card_style: state.cardStyle,
      preview_emoji: state.emoji,
      preview_background: state.emojiBackground,
      card_button_color: form.cardButtonColor || '#5B4FE9',
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
