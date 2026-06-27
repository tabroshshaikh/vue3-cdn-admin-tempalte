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
    uiType: {
      type: String,
      default: 'digital_download',
    },
    showTypeSettings: {
      type: Boolean,
      default: false,
    },
    typeSettingsTitle: {
      type: String,
      default: '',
    },
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
    'input:fileName',
    'add:collectField',
    'remove:collectField',
    'input:externalUrl',
    'input:externalLabel',
    'toggle:externalShowAfterPurchase',
    'input:leadMagnetCtaLabel',
    'input:leadMagnetSuccessMessage',
    'input:leadMagnetRedirectUrl',
    'input:serviceSessionDuration',
    'input:servicePlatform',
    'input:serviceBufferBefore',
    'input:serviceBufferAfter',
    'input:serviceMaxBookingsPerDay',
    'input:serviceAdvanceBookingDays',
    'input:serviceMeetingUrl',
    'upload:checkoutBanner',
    'remove:checkoutBanner',
    'upload:productFile',
    'remove:productFile',
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
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        this.$emit('toast', 'error', 'File must be under 50 MB.');
        return;
      }

      this.$emit('upload:productFile', file);
      event.target.value = '';
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
        <div class="ap2-card-body ap2-stack-md">
          <div class="ap2-stack-xs">
            <label class="ap2-radio-row" :class="form.fileDeliveryType === 'upload' ? 'active' : ''">
              <input v-model="form.fileDeliveryType" value="upload" type="radio" class="sr-only" @change="$emit('select:fileType', 'upload')" />
              <span class="ap2-radio-dot" :class="form.fileDeliveryType === 'upload' ? 'checked' : ''"></span>
              <div>
                <span class="ap2-radio-text font-semibold">Upload a File</span>
                <span class="ap2-radio-sub">Direct upload - customers download immediately</span>
              </div>
            </label>
            <label class="ap2-radio-row" :class="form.fileDeliveryType === 'url' ? 'active' : ''">
              <input v-model="form.fileDeliveryType" value="url" type="radio" class="sr-only" @change="$emit('select:fileType', 'url')" />
              <span class="ap2-radio-dot" :class="form.fileDeliveryType === 'url' ? 'checked' : ''"></span>
              <div>
                <span class="ap2-radio-text font-semibold">Redirect to URL</span>
                <span class="ap2-radio-sub">Google Drive, Dropbox, Notion, etc.</span>
              </div>
            </label>
          </div>

          <div v-if="form.fileDeliveryType === 'upload'" class="ap2-stack-sm">
            <input ref="fileInput" type="file" class="hidden" @change="onFileSelect" />
            <div v-if="!form.productFileUrl" class="ap2-upload-zone" @click="triggerFileInput">
              <div class="ap2-upload-icon">📎</div>
              <p class="ap2-upload-title">Click to upload your file</p>
              <p class="ap2-upload-hint">Any format · Up to 50 MB</p>
            </div>
            <div v-else class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-2xl flex-shrink-0">📄</span>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">{{ form.fileName || 'Uploaded file' }}</p>
                    <a :href="form.productFileUrl" target="_blank" rel="noopener" class="text-xs text-brand-500 hover:underline">Download / Preview</a>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <button type="button" @click.stop="triggerFileInput" :disabled="isSubmitting" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    Replace
                  </button>
                  <button type="button" @click.stop="$emit('remove:productFile')" :disabled="isSubmitting" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-500/10">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <p v-if="validation.fileUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.fileUrl.message }}</p>
          </div>

          <div v-if="form.fileDeliveryType === 'url'" class="ap2-stack-md">
            <div>
              <label class="ap2-label">Destination URL <span class="text-error-500">*</span></label>
              <input v-model="form.fileUrl" type="url" placeholder="https://drive.google.com/file/d/..." :class="inputClasses('fileUrl')" @input="$emit('input:fileUrl')" />
              <p v-if="validation.fileUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.fileUrl.message }}</p>
            </div>
            <div>
              <label class="ap2-label">File / Product Name <span class="text-error-500">*</span></label>
              <input v-model="form.fileName" type="text" placeholder="e.g. Ultimate Creator Playbook.pdf" :class="inputClasses('fileName')" @input="$emit('input:fileName')" />
              <p v-if="validation.fileName.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.fileName.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showTypeSettings" class="ap2-card">
        <div class="ap2-card-header">
          <h3 class="ap2-card-title">{{ typeSettingsTitle }}</h3>
        </div>
        <div class="ap2-card-body ap2-stack-md">
          <template v-if="uiType === 'external_link'">
            <div>
              <label class="ap2-label">Destination URL <span class="text-error-500">*</span></label>
              <input v-model="form.externalUrl" type="url" placeholder="https://example.com/your-link" :class="inputClasses('externalUrl')" @input="$emit('input:externalUrl')" />
              <p class="ap2-hint">Where buyers will be sent after clicking. This is the main link you're sharing or selling access to.</p>
              <p v-if="validation.externalUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.externalUrl.message }}</p>
            </div>
            <div>
              <label class="ap2-label">Link Label</label>
              <input v-model="form.externalLabel" type="text" placeholder="e.g. Visit Website" class="ap2-input" @input="$emit('input:externalLabel')" />
              <p class="ap2-hint">Short text shown on the button or confirmation page (e.g. "Watch Now", "Visit Website"). Leave blank to use the URL itself.</p>
            </div>
            <div>
              <label class="ap2-label">After Purchase</label>
              <div class="ap2-stack-xs mt-1">
                <label class="ap2-radio-row" :class="form.externalShowAfterPurchase ? 'active' : ''">
                  <input v-model="form.externalShowAfterPurchase" :value="true" type="radio" class="sr-only" @change="$emit('toggle:externalShowAfterPurchase')" />
                  <span class="ap2-radio-dot" :class="form.externalShowAfterPurchase ? 'checked' : ''"></span>
                  <span class="ap2-radio-text">Show on-screen after purchase</span>
                </label>
                <label class="ap2-radio-row" :class="!form.externalShowAfterPurchase ? 'active' : ''">
                  <input v-model="form.externalShowAfterPurchase" :value="false" type="radio" class="sr-only" @change="$emit('toggle:externalShowAfterPurchase')" />
                  <span class="ap2-radio-dot" :class="!form.externalShowAfterPurchase ? 'checked' : ''"></span>
                  <span class="ap2-radio-text">Send over email</span>
                </label>
              </div>
              <p class="ap2-hint">Choose whether the link appears immediately on the thank-you screen or is sent via email.</p>
            </div>
          </template>

          <template v-else-if="uiType === 'lead_magnet'">
            <div>
              <label class="ap2-label">CTA Button Label</label>
              <input v-model="form.leadMagnetCtaLabel" type="text" placeholder="Get Free Access" :class="inputClasses('leadMagnetCtaLabel')" @input="$emit('input:leadMagnetCtaLabel')" />
              <p class="ap2-hint">Text shown on the submit button. Common choices: "Get Free Access", "Download Now", "Send Me the Guide".</p>
            </div>
            <div>
              <label class="ap2-label">Success Message</label>
              <textarea v-model="form.leadMagnetSuccessMessage" rows="3" placeholder="Shown after email is submitted..." class="ap2-input ap2-textarea" @input="$emit('input:leadMagnetSuccessMessage')"></textarea>
              <p class="ap2-hint">Message displayed to the user right after they submit their email. Thank them or explain what happens next.</p>
            </div>
            <div>
              <label class="ap2-label">Redirect URL</label>
              <input v-model="form.leadMagnetRedirectUrl" type="url" placeholder="https://your-redirect-page.com" :class="inputClasses('leadMagnetRedirectUrl')" @input="$emit('input:leadMagnetRedirectUrl')" />
              <p class="ap2-hint">Optional. If set, buyers will be sent here after submitting their email instead of seeing the success message.</p>
              <p v-if="validation.leadMagnetRedirectUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.leadMagnetRedirectUrl.message }}</p>
            </div>
          </template>

          <template v-else-if="uiType === 'custom_service'">
            <div class="ap2-grid-2">
              <div>
                <label class="ap2-label">Session Duration (mins)</label>
                <input v-model="form.serviceSessionDuration" type="number" min="0" :class="inputClasses('serviceSessionDuration')" @input="$emit('input:serviceSessionDuration')" />
                <p class="ap2-hint">How long each meeting or session lasts, in minutes.</p>
              </div>
              <div>
                <label class="ap2-label">Platform</label>
                <select v-model="form.servicePlatform" class="ap2-input" @change="$emit('input:servicePlatform')">
                  <option>Zoom</option>
                  <option>Google Meet</option>
                  <option>Microsoft Teams</option>
                  <option>Phone</option>
                  <option>Custom</option>
                </select>
                <p class="ap2-hint">Where the session will take place. Shown to buyers after purchase.</p>
              </div>
              <div>
                <label class="ap2-label">Buffer Before (mins)</label>
                <input v-model="form.serviceBufferBefore" type="number" min="0" :class="inputClasses('serviceBufferBefore')" @input="$emit('input:serviceBufferBefore')" />
                <p class="ap2-hint">Free time before each session for preparation. Set to 0 for no buffer.</p>
              </div>
              <div>
                <label class="ap2-label">Buffer After (mins)</label>
                <input v-model="form.serviceBufferAfter" type="number" min="0" :class="inputClasses('serviceBufferAfter')" @input="$emit('input:serviceBufferAfter')" />
                <p class="ap2-hint">Free time after each session for notes or breaks.</p>
              </div>
              <div>
                <label class="ap2-label">Max Bookings/Day</label>
                <input v-model="form.serviceMaxBookingsPerDay" type="number" min="0" placeholder="Unlimited" :class="inputClasses('serviceMaxBookingsPerDay')" @input="$emit('input:serviceMaxBookingsPerDay')" />
                <p class="ap2-hint">Cap the number of sessions per day. Leave blank for unlimited availability.</p>
              </div>
              <div>
                <label class="ap2-label">Advance Booking Days</label>
                <input v-model="form.serviceAdvanceBookingDays" type="number" min="0" :class="inputClasses('serviceAdvanceBookingDays')" @input="$emit('input:serviceAdvanceBookingDays')" />
                <p class="ap2-hint">How far in advance buyers can book (e.g. 30 = up to 30 days ahead).</p>
              </div>
            </div>
            <div>
              <label class="ap2-label">Custom Meeting URL</label>
              <input v-model="form.serviceMeetingUrl" type="url" placeholder="https://zoom.us/my/yourroom" :class="inputClasses('serviceMeetingUrl')" @input="$emit('input:serviceMeetingUrl')" />
              <p class="ap2-hint">Optional. Provide your own meeting link instead of generating one. Buyers receive this after purchase.</p>
              <p v-if="validation.serviceMeetingUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.serviceMeetingUrl.message }}</p>
            </div>
          </template>
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
