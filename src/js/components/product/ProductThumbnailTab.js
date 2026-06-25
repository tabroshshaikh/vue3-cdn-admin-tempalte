export default {
  name: 'ProductThumbnailTab',
  props: {
    form: Object,
    validation: Object,
    cardStyle: String,
    emoji: String,
    emojiOptions: Array,
    selectedType: Object,
    emojiBackground: String,
    previewTitle: String,
    previewSubtitle: String,
    previewPrice: String,
    previewCompareAtPrice: String,
    previewDescription: String,
    previewCardClasses: Array,
    previewTypeLabel: String,
    previewCalloutCardStyle: Object,
    previewCalloutImageStyle: Object,
    previewClassicImageStyle: Object,
    previewButtonImageStyle: Object,
    previewMode: String,
    previewHeadline: String,
    inputClasses: Function,
    shortDescriptionLength: Number,
  },
  emits: [
    'input:title',
    'input:subtitle',
    'input:ctaText',
    'select:cardStyle',
    'select:emoji',
    'switch:previewMode',
    'toast',
  ],
  template: `
    <div class="ap2-section-stack">
      <div class="ap2-card">
        <div class="ap2-card-header">
          <h3 class="ap2-card-title">Card Style</h3>
          <p class="ap2-card-subtitle">How the product card looks in your store</p>
        </div>
        <div class="ap2-card-body">
          <div class="ap2-style-grid">
            <button type="button" class="ap2-style-option" :class="cardStyle === 'button' ? 'active' : ''" @click="$emit('select:cardStyle', 'button')">
              <span class="ap2-style-preview ap2-style-preview-button">
                <span class="ap2-style-mini-title"></span>
                <span class="ap2-style-mini-price"></span>
                <span class="ap2-style-cta">CTA</span>
              </span>
              <span class="ap2-style-label">Button</span>
              <span class="ap2-style-desc">Title, price & CTA</span>
            </button>
            <button type="button" class="ap2-style-option" :class="cardStyle === 'callout' ? 'active' : ''" @click="$emit('select:cardStyle', 'callout')">
              <span class="ap2-style-preview ap2-style-preview-callout">
                <span class="ap2-style-callout-icon">{{ emoji }}</span>
                <span class="ap2-style-callout-lines">
                  <span></span>
                  <span></span>
                </span>
              </span>
              <span class="ap2-style-label">Callout</span>
              <span class="ap2-style-desc">Horizontal layout</span>
            </button>
            <button type="button" class="ap2-style-option" :class="cardStyle === 'preview' ? 'active' : ''" @click="$emit('select:cardStyle', 'preview')">
              <span class="ap2-style-preview ap2-style-preview-classic">
                <span class="ap2-style-classic-icon">{{ emoji }}</span>
                <span class="ap2-style-classic-line"></span>
                <span class="ap2-style-classic-btn"></span>
              </span>
              <span class="ap2-style-label">Preview</span>
              <span class="ap2-style-desc">Centered vertical</span>
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
          <button type="button" class="ap2-upload-zone" @click="$emit('toast', 'info', 'File picker would open here.')">
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
              @click="$emit('select:emoji', option)"
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
            <input v-model="form.title" type="text" placeholder="e.g. The Ultimate Creator Course" :class="inputClasses('title')" @input="$emit('input:title')" />
            <p class="ap2-hint">Keep it short and punchy - max 80 chars</p>
            <p v-if="validation.title.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.title.message }}</p>
          </div>

          <div>
            <div class="ap2-label-row">
              <label class="ap2-label ap2-label-no-margin">Subtitle / Tagline <span class="text-error-500">*</span></label>
              <span class="text-xs text-gray-500">{{ form.subtitle.length }}/100</span>
            </div>
            <input v-model="form.subtitle" type="text" placeholder="e.g. 40 lessons - For beginners" :class="inputClasses('subtitle')" @input="$emit('input:subtitle')" />
            <p v-if="validation.subtitle.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.subtitle.message }}</p>
          </div>

          <div>
            <label class="ap2-label">Button Text <span class="text-error-500">*</span></label>
            <input v-model="form.ctaText" type="text" placeholder="Get Instant Access" :class="inputClasses('ctaText')" @input="$emit('input:ctaText')" />
            <p v-if="validation.ctaText.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.ctaText.message }}</p>
          </div>
        </div>
      </div>

      <div class="ap2-card">
        <div class="ap2-card-header">
          <h3 class="ap2-card-title">Card Appearance</h3>
          <p class="ap2-card-subtitle">Fine tune the store card preview</p>
        </div>
        <div class="ap2-card-body ap2-stack-md">
          <!--<div>
            <label class="ap2-label">Button Color</label>
            <div class="ap2-color-row">
              <input v-model="form.cardButtonColor" type="color" class="ap2-color-input" />
              <span class="ap2-color-value">{{ form.cardButtonColor || '#5B4FE9' }}</span>
            </div>
          </div>-->

          <label class="ap2-toggle-row" :class="form.cardBadgeEnabled ? 'active' : ''">
            <div>
              <p class="ap2-toggle-title">Show Badge</p>
              <p class="ap2-toggle-subtitle">Display a small label on the product card</p>
            </div>
            <input v-model="form.cardBadgeEnabled" type="checkbox" class="sr-only" />
            <span class="ap2-switch" :class="form.cardBadgeEnabled ? 'on' : ''"><span></span></span>
          </label>

          <div v-if="form.cardBadgeEnabled" class="ap2-badge-fields">
            <div>
              <label class="ap2-label">Badge Text</label>
              <input v-model="form.badge_text" type="text" maxlength="18" placeholder="BESTSELLER" class="ap2-input" />
            </div>
            <div>
              <label class="ap2-label">Badge Color</label>
              <input v-model="form.badge_color" type="color" class="ap2-color-input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
