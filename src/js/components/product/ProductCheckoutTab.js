export default {
  name: 'ProductCheckoutTab',
  props: {
    form: Object,
    validation: Object,
    showFileCard: Boolean,
    collectFields: Array,
    addFieldOptions: Array,
    inputClasses: Function,
    textareaClasses: Function,
    checkoutBannerUrl: {
      type: String,
      default: '',
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'input:headline',
    'input:description',
    'toggle:isFree',
    'input:price',
    'input:compareAtPrice',
    'select:fileType',
    'input:fileUrl',
    'add:collectField',
    'remove:collectField',
    'upload:checkoutBanner',
    'remove:checkoutBanner',
    'toast',
  ],
  data() {
    return {
      showCropper: false,
      cropperImage: '',
      cropperInstance: null,
      isCropping: false,
    };
  },
  beforeUnmount() {
    this.destroyCropper();
  },
  methods: {
    triggerBannerFileInput() {
      this.$refs.bannerFileInput.click();
    },
    onBannerFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.$emit('toast', 'error', 'Please upload a JPG, PNG, GIF, or WebP image.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.$emit('toast', 'error', 'Image must be under 10 MB.');
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
        aspectRatio: 16 / 9,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        responsive: true,
        background: false,
        guides: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        minCropBoxWidth: 200,
        minCropBoxHeight: 113,
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

      this.isCropping = true;
      const canvas = this.cropperInstance.getCroppedCanvas({
        width: 1600,
        height: 900,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          this.$emit('upload:checkoutBanner', blob);
        }
        this.isCropping = false;
        this.closeCropper();
      }, 'image/jpeg', 0.9);
    },
    removeBanner() {
      this.$emit('remove:checkoutBanner');
    },
  },
  template: `
    <div class="ap2-section-stack">
      <div class="ap2-card">
        <div class="ap2-card-header">
          <h3 class="ap2-card-title">Checkout Banner</h3>
        </div>
        <div class="ap2-card-body">
          <div v-if="!checkoutBannerUrl" class="ap2-upload-zone" @click="triggerBannerFileInput">
            <input ref="bannerFileInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" @change="onBannerFileSelect" />
            <div class="ap2-upload-icon">🖼️</div>
            <p class="ap2-upload-title">Upload checkout page banner</p>
            <p class="ap2-upload-hint">Shown at top of checkout · 1600 × 900 px · Max 10 MB</p>
          </div>

          <div v-else class="relative">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div class="relative" style="padding-top: 56.25%;">
                <img :src="checkoutBannerUrl" alt="Checkout banner" class="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">Banner uploaded</p>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">1600 × 900 px</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" @click.stop="triggerBannerFileInput" :disabled="isSubmitting" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    Replace
                  </button>
                  <button type="button" @click.stop="removeBanner" :disabled="isSubmitting" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-500/10">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <input ref="bannerFileInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" @change="onBannerFileSelect" />
          </div>
        </div>
      </div>

      <div class="ap2-card">
        <div class="ap2-card-header">
          <h3 class="ap2-card-title">Description</h3>
        </div>
        <div class="ap2-card-body ap2-stack-lg">
          <div>
            <label class="ap2-label">Headline</label>
            <input v-model="form.headline" type="text" placeholder="What will your buyers get?" :class="inputClasses('description')" @input="$emit('input:headline')" />
          </div>
          <div>
            <label class="ap2-label">Description Body <span class="text-error-500">*</span></label>
            <textarea v-model="form.description" rows="5" placeholder="Describe what's included, who it's for, and why they need it now..." :class="textareaClasses('description')" @input="$emit('input:description')"></textarea>
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
            <input v-model="form.isFree" type="checkbox" class="sr-only" @change="$emit('toggle:isFree')" />
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
                  @input="$emit('input:price')"
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
                  @input="$emit('input:compareAtPrice')"
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
          <button type="button" class="ap2-file-type" :class="form.fileDeliveryType === 'upload' ? 'active' : ''" @click="$emit('select:fileType', 'upload')">
            <span class="ap2-file-title">Upload a File</span>
            <span class="ap2-file-subtitle">Direct upload - customers download immediately</span>
          </button>
          <div v-if="form.fileDeliveryType === 'upload'" class="ap2-upload-zone">
            <div class="ap2-upload-icon">📎</div>
            <p class="ap2-upload-title">Drag & drop your file here</p>
            <p class="ap2-upload-hint">PDF, MP4, ZIP, PNG, PSD, XLS, SVG · Up to 5 GB</p>
          </div>

          <button type="button" class="ap2-file-type" :class="form.fileDeliveryType === 'url' ? 'active' : ''" @click="$emit('select:fileType', 'url')">
            <span class="ap2-file-title">Redirect to URL</span>
            <span class="ap2-file-subtitle">Google Drive, Dropbox, Notion, etc.</span>
          </button>

          <div v-if="form.fileDeliveryType === 'url'" class="ap2-stack-md">
            <div>
              <label class="ap2-label">Destination URL <span class="text-error-500">*</span></label>
              <input v-model="form.fileUrl" type="url" placeholder="https://drive.google.com/file/d/..." :class="inputClasses('fileUrl')" @input="$emit('input:fileUrl')" />
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
              <button v-else type="button" class="ap2-del-btn" @click="$emit('remove:collectField', index)">✕</button>
            </div>
          </div>

          <div class="ap2-chip-list">
            <button
              v-for="option in addFieldOptions"
              :key="option.label"
              type="button"
              class="ap2-chip-btn"
              @click="$emit('add:collectField', option)"
            >
              + {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cropper Modal -->
      <teleport to="body">
        <div v-if="showCropper" class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeCropper">
          <div class="mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900" @click.stop>
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white">Crop Checkout Banner</h3>
              <button type="button" @click="closeCropper" class="rounded-full p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-5">
              <div class="flex justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" style="max-height: 400px;">
                <img ref="cropperImg" :src="cropperImage" alt="Crop preview" style="max-width: 100%; display: block;" />
              </div>
              <p class="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">Image will be cropped to 1600 × 900 px (16:9)</p>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-700">
              <button type="button" @click="closeCropper" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="button" @click="cropImage" :disabled="isCropping" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center gap-2">
                <svg v-if="isCropping" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isCropping ? 'Uploading...' : 'Crop & Upload' }}
              </button>
            </div>
          </div>
        </div>
      </teleport>
    </div>
  `,
};
