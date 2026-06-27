import { normalizeBadgeColor } from '../../composables/useProductForm.js';

export default {
  name: 'ProductStorePreview',
  props: {
    cardStyle: {
      type: String,
      default: 'button',
    },
    form: {
      type: Object,
      required: true,
    },
    emoji: {
      type: String,
      default: '📁',
    },
    emojiBackground: {
      type: String,
      default: 'linear-gradient(135deg,#5B4FE9,#A78BFA)',
    },
    previewTitle: {
      type: String,
      default: '',
    },
    previewSubtitle: {
      type: String,
      default: '',
    },
    previewPrice: {
      type: String,
      default: '$0.00',
    },
    previewCompareAtPrice: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
    ctaText() {
      return this.form.ctaText || 'Get Instant Access';
    },
    badgeText() {
      return String(this.form.badge_text || '').trim();
    },
    showBadge() {
      return Boolean(this.form.cardBadgeEnabled && this.badgeText);
    },
    previewVars() {
      return {
        '--ap2-card-accent': this.form.cardButtonColor || '#5B4FE9',
        '--ap2-emoji-bg': this.emojiBackground,
        '--ap2-badge-color': normalizeBadgeColor(this.form.badge_color),
      };
    },
  },
  template: `
    <div class="ap2-store-preview-shell" :style="previewVars">
      <div class="ap2-store-frame">
        <div class="ap2-store-frame-body">
          <article v-if="cardStyle === 'callout'" class="ap2-store-card ap2-store-card-callout" :class="showBadge ? 'has-badge' : ''">
            <span v-if="showBadge" class="ap2-store-badge">{{ badgeText }}</span>
            <div v-if="thumbnailUrl" class="ap2-store-emoji"><img :src="thumbnailUrl" alt="Thumbnail" class="h-full w-full object-cover" /></div>
            <div v-else class="ap2-store-emoji">{{ emoji }}</div>
            <div class="ap2-store-callout-content">
              <h4 class="ap2-store-title">{{ previewTitle }}</h4>
              <p class="ap2-store-subtitle">{{ previewSubtitle }}</p>
              <div class="ap2-store-callout-bottom">
                <div class="ap2-store-prices">
                  <span class="ap2-store-price" :class="form.isFree ? 'free' : ''">{{ previewPrice }}</span>
                  <span v-if="previewCompareAtPrice" class="ap2-store-compare">{{ previewCompareAtPrice }}</span>
                </div>
                <button type="button" class="ap2-store-cta compact">{{ ctaText }}</button>
              </div>
            </div>
          </article>

          <article v-else-if="cardStyle === 'preview'" class="ap2-store-card ap2-store-card-preview" :class="showBadge ? 'has-badge' : ''">
            <span v-if="showBadge" class="ap2-store-badge">{{ badgeText }}</span>
            <div v-if="thumbnailUrl" class="ap2-store-emoji large"><img :src="thumbnailUrl" alt="Thumbnail" class="h-full w-full object-cover" /></div>
            <div v-else class="ap2-store-emoji large">{{ emoji }}</div>
            <h4 class="ap2-store-title">{{ previewTitle }}</h4>
            <p class="ap2-store-subtitle">{{ previewSubtitle }}</p>
            <div class="ap2-store-prices centered">
              <span class="ap2-store-price" :class="form.isFree ? 'free' : ''">{{ previewPrice }}</span>
              <span v-if="previewCompareAtPrice" class="ap2-store-compare">{{ previewCompareAtPrice }}</span>
            </div>
            <button type="button" class="ap2-store-cta">{{ ctaText }}</button>
          </article>

          <article v-else class="ap2-store-card ap2-store-card-button" :class="showBadge ? 'has-badge' : ''">
            <span v-if="showBadge" class="ap2-store-badge">{{ badgeText }}</span>
            <h4 class="ap2-store-title">{{ previewTitle }}</h4>
            <div class="ap2-store-prices">
              <span class="ap2-store-price" :class="form.isFree ? 'free' : ''">{{ previewPrice }}</span>
              <span v-if="previewCompareAtPrice" class="ap2-store-compare">{{ previewCompareAtPrice }}</span>
            </div>
            <button type="button" class="ap2-store-cta">{{ ctaText }}</button>
          </article>
        </div>
      </div>
    </div>
  `,
};
