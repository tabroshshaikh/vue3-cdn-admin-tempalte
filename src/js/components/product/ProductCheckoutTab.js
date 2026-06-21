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
  ],
  template: `
    <div class="ap2-section-stack">
      <div class="ap2-card">
        <div class="ap2-card-header">
          <h3 class="ap2-card-title">Checkout Banner</h3>
        </div>
        <div class="ap2-card-body">
          <button type="button" class="ap2-upload-zone" @click="$emit('toast', 'info', 'Banner upload would open here.')">
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
    </div>
  `,
};
