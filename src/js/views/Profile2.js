import AdminLayout from '/src/js/components/layout/AdminLayout.js'
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js'

export default {
  name: 'Profile2',
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  data() {
    return {
      currentPageTitle: 'Store Profile',
      currentStep: 1,
      steps: [
        {
          id: 1,
          label: 'Identity',
          subtitle: 'Set up your public identity — name, photo, bio and location.',
        },
        {
          id: 2,
          label: 'Social',
          subtitle: 'Add your social media links to connect with your audience.',
        },
        {
          id: 3,
          label: 'SEO',
          subtitle: 'Optimize your store for search engines and social sharing.',
        },
      ],
      form: {
        displayName: 'Alex Johnson',
        storeHandle: 'alexjohnson/',
        bio: 'Helping creators build 6-figure online businesses 🚀 Coach • Speaker • Course Creator',
        language: 'English (en)',
        timezone: 'Asia/Kolkata (IST)',
        seoTitle: 'Alex Johnson – Creator Coach & Course Builder',
        seoDescription: 'Helping creators build profitable online businesses. Coaching, courses & digital downloads.',
      },
      socialLinks: [
        {
          id: 1,
          type: 'instagram',
          label: 'Instagram',
          value: '@alexjohnson',
          placeholder: 'Instagram username',
        },
        {
          id: 2,
          type: 'twitter',
          label: 'Twitter / X',
          value: '@alex_creates',
          placeholder: 'Twitter / X username',
        },
        {
          id: 3,
          type: 'youtube',
          label: 'YouTube',
          value: '',
          placeholder: 'YouTube channel URL',
        },
        {
          id: 4,
          type: 'linkedin',
          label: 'LinkedIn',
          value: '',
          placeholder: 'LinkedIn profile URL',
        },
      ],
      nextSocialId: 5,
    }
  },
  computed: {
    activeStep() {
      return this.steps.find((step) => step.id === this.currentStep)
    },
    isFirstStep() {
      return this.currentStep === 1
    },
    isLastStep() {
      return this.currentStep === this.steps.length
    },
  },
  methods: {
    setStep(stepId) {
      this.currentStep = stepId
    },
    nextStep() {
      if (!this.isLastStep) {
        this.currentStep += 1
      }
    },
    prevStep() {
      if (!this.isFirstStep) {
        this.currentStep -= 1
      }
    },
    addSocialLink() {
      this.socialLinks.push({
        id: this.nextSocialId,
        type: 'custom',
        label: 'Custom',
        value: '',
        placeholder: 'https://your-social-link.com',
      })
      this.nextSocialId += 1
    },
    removeSocialLink(id) {
      this.socialLinks = this.socialLinks.filter((item) => item.id !== id)
    },
    socialIconClasses(type) {
      if (type === 'instagram') return 'border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/30 dark:bg-pink-500/15 dark:text-pink-300'
      if (type === 'twitter') return 'border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300'
      if (type === 'youtube') return 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300'
      if (type === 'linkedin') return 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300'
      return 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
    },
    socialAbbr(type) {
      if (type === 'instagram') return 'IG'
      if (type === 'twitter') return 'X'
      if (type === 'youtube') return 'YT'
      if (type === 'linkedin') return 'in'
      return '•'
    },
    saveProfile() {
      console.log('Store profile saved', {
        step: this.currentStep,
        form: this.form,
        socialLinks: this.socialLinks,
      })
    },
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="step in steps"
            :key="step.id"
            @click="setStep(step.id)"
            class="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition"
            :class="step.id === currentStep
              ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-500/15 dark:text-brand-400'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50'"
          >
            {{ step.id }}. {{ step.label }}
          </button>
        </div>

        <h2 class="mt-5 text-xl font-semibold text-gray-800 dark:text-white/90">Store Profile</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ activeStep.subtitle }}</p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div v-if="currentStep === 1" class="p-4 sm:p-6">
          <div class="space-y-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Profile Photo</label>
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-xl font-semibold text-white shadow-theme-xs">
                  AJ
                </div>

                <div>
                  <div class="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      class="inline-flex h-10 items-center rounded-lg border border-brand-300 bg-brand-50 px-4 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/20"
                    >
                      Upload Photo
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    >
                      Remove
                    </button>
                  </div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Recommended: 400 x 400 px JPG or PNG</p>
                </div>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Display Name <span class="text-error-500">*</span></label>
              <input
                type="text"
                v-model="form.displayName"
                placeholder="Alex Johnson"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Shown at the top of your store page</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Store Handle</label>
              <input
                type="text"
                v-model="form.storeHandle"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Your unique store URL — lowercase, no spaces</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Bio</label>
              <textarea
                v-model="form.bio"
                rows="3"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              ></textarea>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Max 200 characters. Tell your audience what you do.</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Locale & Region</label>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="form.language"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option>English (en)</option>
                    <option>Hindi (hi)</option>
                    <option>Spanish (es)</option>
                    <option>French (fr)</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">▾</span>
                </div>

                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="form.timezone"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">▾</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="p-4 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">Social Links</h3>
            <button
              type="button"
              @click="addSocialLink"
              class="inline-flex h-10 items-center rounded-lg border border-brand-300 bg-brand-50 px-4 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/20"
            >
              + Add Link
            </button>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="item in socialLinks"
              :key="item.id"
              class="flex items-end gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold" :class="socialIconClasses(item.type)">
                {{ socialAbbr(item.type) }}
              </div>
              <div class="w-full">
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{ item.label }}</label>
                <input
                  type="text"
                  v-model="item.value"
                  :placeholder="item.placeholder"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <button
                type="button"
                @click="removeSocialLink(item.id)"
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition hover:border-error-300 hover:text-error-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-error-800 dark:hover:text-error-500"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="p-4 sm:p-6">
          <h3 class="text-base font-medium text-gray-800 dark:text-white/90">SEO & Metadata</h3>

          <div class="mt-5 space-y-6">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">SEO Title</label>
              <input
                type="text"
                v-model="form.seoTitle"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Shown in Google search results and browser tabs</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">SEO Description</label>
              <textarea
                v-model="form.seoDescription"
                rows="3"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              ></textarea>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Max 160 characters recommended</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 border-t border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="h-2 w-2 rounded-full bg-warning-500"></span>
            Changes not yet saved
          </p>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="prevStep"
              :disabled="isFirstStep"
              class="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              Previous
            </button>

            <button
              v-if="!isLastStep"
              type="button"
              @click="nextStep"
              class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Next
            </button>

            <button
              v-else
              type="button"
              @click="saveProfile"
              class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
  `,
}
