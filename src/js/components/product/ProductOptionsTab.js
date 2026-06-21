export default {
  name: 'ProductOptionsTab',
  props: {
    form: Object,
    validation: Object,
    uiType: String,
    showTypeSettings: Boolean,
    typeSettingsTitle: String,
    inputClasses: Function,
    textareaClasses: Function,
  },
  emits: [
    'input:emailSubject',
    'input:emailBody',
    'toggle:isFeatured',
    'toggle:publishImmediately',
    'input:scheduledPublishAt',
    'input:slug',
    'input:metaTitle',
    'input:metaDescription',
    'toggle:enableReviews',
    'toggle:emailFlows',
    'toggle:orderBumps',
    'toggle:affiliateShare',
    'toggle:upsellAfterPurchase',
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
  ],
  template: `
    <div class="ap2-section-stack">
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
            <input v-model="form.enableReviews" type="checkbox" class="sr-only" @change="$emit('toggle:enableReviews')" />
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
            <input v-model="form.emailFlows" type="checkbox" class="sr-only" @change="$emit('toggle:emailFlows')" />
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
            <input v-model="form.upsellAfterPurchase" type="checkbox" class="sr-only" @change="$emit('toggle:upsellAfterPurchase')" />
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
            <input v-model="form.emailSubject" type="text" placeholder="🎉 You're in! Here's your access" :class="inputClasses('emailSubject')" @input="$emit('input:emailSubject')" />
          </div>

          <div>
            <label class="ap2-label">Email Body</label>
            <textarea v-model="form.emailBody" rows="4" class="ap2-input ap2-textarea" @input="$emit('input:emailBody')"></textarea>
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
              <input v-model="form.slug" type="text" placeholder="product-slug" class="ap2-slug-input" :class="inputClasses('slug')" @input="$emit('input:slug')" />
            </div>
            <p v-if="validation.slug.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.slug.message }}</p>
          </div>

          <div>
            <label class="ap2-label">Meta Title</label>
            <input v-model="form.metaTitle" type="text" placeholder="SEO title (max 60 chars)" :class="inputClasses('metaTitle')" @input="$emit('input:metaTitle')" />
          </div>

          <div>
            <label class="ap2-label">Meta Description</label>
            <textarea v-model="form.metaDescription" rows="2" placeholder="SEO description (max 160 chars)" class="ap2-input ap2-textarea" @input="$emit('input:metaDescription')"></textarea>
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
            <input v-model="form.isFeatured" type="checkbox" class="sr-only" @change="$emit('toggle:isFeatured')" />
            <span class="ap2-switch" :class="form.isFeatured ? 'on' : ''"><span></span></span>
          </label>

          <label class="ap2-toggle-row" :class="form.publishImmediately ? 'active' : ''">
            <div>
              <p class="ap2-toggle-title">Publish Immediately</p>
              <p class="ap2-toggle-subtitle">Make live as soon as you hit publish</p>
            </div>
            <input v-model="form.publishImmediately" type="checkbox" class="sr-only" @change="$emit('toggle:publishImmediately')" />
            <span class="ap2-switch" :class="form.publishImmediately ? 'on' : ''"><span></span></span>
          </label>

          <div>
            <label class="ap2-label">Scheduled Publish Date</label>
            <input v-model="form.scheduledPublishAt" type="datetime-local" :disabled="form.publishImmediately" :class="inputClasses('scheduledPublishAt')" @input="$emit('input:scheduledPublishAt')" />
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
                <input v-model="form.serviceSessionDuration" type="number" min="0" :class="inputClasses('serviceSessionDuration')" @input="$emit('input:serviceSessionDuration')" />
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
              </div>
              <div>
                <label class="ap2-label">Buffer Before (mins)</label>
                <input v-model="form.serviceBufferBefore" type="number" min="0" :class="inputClasses('serviceBufferBefore')" @input="$emit('input:serviceBufferBefore')" />
              </div>
              <div>
                <label class="ap2-label">Buffer After (mins)</label>
                <input v-model="form.serviceBufferAfter" type="number" min="0" :class="inputClasses('serviceBufferAfter')" @input="$emit('input:serviceBufferAfter')" />
              </div>
              <div>
                <label class="ap2-label">Max Bookings/Day</label>
                <input v-model="form.serviceMaxBookingsPerDay" type="number" min="0" placeholder="Unlimited" :class="inputClasses('serviceMaxBookingsPerDay')" @input="$emit('input:serviceMaxBookingsPerDay')" />
              </div>
              <div>
                <label class="ap2-label">Advance Booking Days</label>
                <input v-model="form.serviceAdvanceBookingDays" type="number" min="0" :class="inputClasses('serviceAdvanceBookingDays')" @input="$emit('input:serviceAdvanceBookingDays')" />
              </div>
            </div>

            <div>
              <label class="ap2-label">Custom Meeting URL</label>
              <input v-model="form.serviceMeetingUrl" type="url" placeholder="https://zoom.us/my/yourroom" :class="inputClasses('serviceMeetingUrl')" @input="$emit('input:serviceMeetingUrl')" />
              <p v-if="validation.serviceMeetingUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.serviceMeetingUrl.message }}</p>
            </div>
          </template>

          <template v-else-if="uiType === 'lead_magnet'">
            <div>
              <label class="ap2-label">CTA Button Label</label>
              <input v-model="form.leadMagnetCtaLabel" type="text" placeholder="Get Free Access" :class="inputClasses('leadMagnetCtaLabel')" @input="$emit('input:leadMagnetCtaLabel')" />
            </div>
            <div>
              <label class="ap2-label">Success Message</label>
              <textarea v-model="form.leadMagnetSuccessMessage" rows="3" placeholder="Shown after email is submitted..." class="ap2-input ap2-textarea" @input="$emit('input:leadMagnetSuccessMessage')"></textarea>
            </div>
            <div>
              <label class="ap2-label">Redirect URL</label>
              <input v-model="form.leadMagnetRedirectUrl" type="url" placeholder="https://your-redirect-page.com" :class="inputClasses('leadMagnetRedirectUrl')" @input="$emit('input:leadMagnetRedirectUrl')" />
              <p v-if="validation.leadMagnetRedirectUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.leadMagnetRedirectUrl.message }}</p>
            </div>
          </template>

          <template v-else-if="uiType === 'external_link'">
            <div>
              <label class="ap2-label">Destination URL <span class="text-error-500">*</span></label>
              <input v-model="form.externalUrl" type="url" placeholder="https://youtube.com/watch?v=..." :class="inputClasses('externalUrl')" @input="$emit('input:externalUrl')" />
              <p v-if="validation.externalUrl.status === 'error'" class="mt-1 text-xs text-error-500">{{ validation.externalUrl.message }}</p>
            </div>
            <div>
              <label class="ap2-label">Link Label</label>
              <input v-model="form.externalLabel" type="text" placeholder="e.g. Watch the Free Masterclass" :class="inputClasses('externalLabel')" @input="$emit('input:externalLabel')" />
            </div>
            <label class="ap2-toggle-row" :class="form.externalShowAfterPurchase ? 'active' : ''">
              <div>
                <p class="ap2-toggle-title">Show Link After Purchase</p>
                <p class="ap2-toggle-subtitle">Display URL on the order confirmation page</p>
              </div>
              <input v-model="form.externalShowAfterPurchase" type="checkbox" class="sr-only" @change="$emit('toggle:externalShowAfterPurchase')" />
              <span class="ap2-switch" :class="form.externalShowAfterPurchase ? 'on' : ''"><span></span></span>
            </label>
          </template>
        </div>
      </div>
    </div>
  `,
};
