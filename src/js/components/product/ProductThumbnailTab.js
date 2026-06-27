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
    thumbnailUrl: {
      type: String,
      default: '',
    },
  },
  emits: [
    'input:title',
    'input:subtitle',
    'input:ctaText',
    'select:cardStyle',
    'select:emoji',
    'upload:thumbnail',
    'remove:thumbnail',
    'switch:previewMode',
    'toast',
  ],
  data() {
    return {
      showCropper: false,
      cropperImage: '',
      cropperInstance: null,
      isUploading: false,
    };
  },
  beforeUnmount() {
    this.destroyCropper();
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.$emit('toast', 'error', 'Please upload a JPG, PNG, GIF, or WebP image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.$emit('toast', 'error', 'Image must be under 5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.cropperImage = e.target.result;
        this.showCropper = true;
        this.$nextTick(() => this.initCropper());
      };
      reader.readAsDataURL(file);

      event.target.value = '';
    },
    initCropper() {
      this.destroyCropper();

      const image = this.$refs.cropperImg;
      if (!image) return;

      if (typeof Cropper === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js';
        script.onload = () => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css';
          document.head.appendChild(link);
          this.createCropper();
        };
        script.onerror = () => {
          this.$emit('toast', 'error', 'Failed to load cropper library.');
          this.closeCropper();
        };
        document.head.appendChild(script);
      } else {
        this.createCropper();
      }
    },
    createCropper() {
      const image = this.$refs.cropperImg;
      if (!image) return;

      this.cropperInstance = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        responsive: true,
        background: false,
        guides: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        minCropBoxWidth: 100,
        minCropBoxHeight: 100,
      });
    },
    destroyCropper() {
      if (this.cropperInstance) {
        this.cropperInstance.destroy();
        this.cropperInstance = null;
      }
    },
    closeCropper() {
      this.destroyCropper();
      this.showCropper = false;
      this.cropperImage = '';
    },
    cropImage() {
      if (!this.cropperInstance) return;

      this.isUploading = true;
      const canvas = this.cropperInstance.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          this.$emit('upload:thumbnail', blob);
        }
        this.isUploading = false;
        this.closeCropper();
      }, 'image/jpeg', 0.9);
    },
    removeThumbnail() {
      this.$emit('remove:thumbnail');
    },
  },
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
          <!-- Upload Zone / Thumbnail Preview -->
          <div v-if="!thumbnailUrl" class="ap2-upload-zone" @click="triggerFileInput">
            <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" @change="onFileSelect" />
            <div class="ap2-upload-icon">🖼️</div>
            <p class="ap2-upload-title">Click to upload or drag & drop</p>
            <p class="ap2-upload-hint">JPG, PNG, GIF, WebP · Max 5 MB</p>
          </div>

          <div v-else class="relative">
            <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <img :src="thumbnailUrl" alt="Thumbnail" class="h-full w-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 dark:text-white">Thumbnail uploaded</p>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">400 × 400 px</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" @click.stop="triggerFileInput" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  Replace
                </button>
                <button type="button" @click.stop="removeThumbnail" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 dark:border-gray-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-500/10">
                  Remove
                </button>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" @change="onFileSelect" />
          </div>

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

      <!-- Cropper Modal -->
      <teleport to="body">
        <div v-if="showCropper" class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeCropper">
          <div class="mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900" @click.stop>
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white">Crop Thumbnail</h3>
              <button type="button" @click="closeCropper" class="rounded-full p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-5">
              <div class="flex justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" style="max-height: 360px;">
                <img ref="cropperImg" :src="cropperImage" alt="Crop preview" style="max-width: 100%; display: block;" />
              </div>
              <p class="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">Image will be cropped to 400 × 400 px</p>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-700">
              <button type="button" @click="closeCropper" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="button" @click="cropImage" :disabled="isUploading" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center gap-2">
                <svg v-if="isUploading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isUploading ? 'Uploading...' : 'Crop & Upload' }}
              </button>
            </div>
          </div>
        </div>
      </teleport>
    </div>
  `,
};
