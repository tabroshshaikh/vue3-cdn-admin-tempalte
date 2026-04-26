import AdminLayout from '/src/js/components/layout/AdminLayout.js'
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js'
const { webService } = await import(`/src/js/utils/webService.js?v=${v}`);
import { env } from '../config/env.js';

export default {
  name: 'Profile',
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
        displayName: '',
        storeHandle: '',
        bio: '',
        // language: 'English (en)', // commented out as per requirement
        timezone: 'UTC',
        country: 'INDIA',
        seoTitle: '',
        seoDescription: '',
      },
      socialLinks: [
        {
          id: 1,
          type: 'instagram',
          label: 'Instagram',
          value: '',
          placeholder: 'https://instagram.com/yourusername',
        },
        {
          id: 2,
          type: 'twitter',
          label: 'Twitter / X',
          value: '',
          placeholder: 'https://twitter.com/yourusername',
        },
        {
          id: 3,
          type: 'youtube',
          label: 'YouTube',
          value: '',
          placeholder: 'https://youtube.com/@yourchannel',
        },
        {
          id: 4,
          type: 'linkedin',
          label: 'LinkedIn',
          value: '',
          placeholder: 'https://linkedin.com/in/yourprofile',
        },
      ],
      nextSocialId: 5,
      avatar: null,
      avatarPreview: '',
      avatarValidation: { status: null, message: '' },
      isSubmitting: false,
      isLoading: true,
      countries: [],
      timezones: [],
      originalData: {}, // Store original values to track changes
      originalSocialLinks: [], // Store original social links to track changes
      validation: {
        displayName: { status: null, message: "" },
        storeHandle: { status: null, message: "" },
        bio: { status: null, message: "" },
        country: { status: null, message: "" },
        timezone: { status: null, message: "" },
        seoTitle: { status: null, message: "" },
        seoDescription: { status: null, message: "" },
      },
    }
  },
  mounted() {
    this.loadProfile();
    this.loadCountries();
    this.loadTimezones();
    this.loadSocialLinks();
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
    hasFormChanges() {
      const formChanged = (
        this.form.displayName !== this.originalData.displayName ||
        this.form.storeHandle !== this.originalData.storeHandle ||
        this.form.bio !== this.originalData.bio ||
        this.form.timezone !== this.originalData.timezone ||
        this.form.country !== this.originalData.country ||
        this.form.seoTitle !== this.originalData.seoTitle ||
        this.form.seoDescription !== this.originalData.seoDescription ||
        this.avatar !== null // If avatar is selected, consider it a change
      );
      const socialChanged = JSON.stringify(this.socialLinks) !== JSON.stringify(this.originalSocialLinks);
      return formChanged || socialChanged;
    },
  },
  methods: {
    async loadProfile() {
      try {
        const response = await webService.get('/api/platform/get-profile');
        
        if (response.data.code === 200) {
          const profileData = response.data.data;
          
          // Store original data for change tracking
          this.originalData = {
            displayName: profileData.profile_name || profileData.name || '',
            storeHandle: profileData.handle || '',
            bio: (profileData.bio || '').trim(),
            timezone: profileData.timezone || 'UTC',
            country: profileData.county || '',
            seoTitle: profileData.seo_title || '',
            seoDescription: profileData.seo_description || '',
          };
          
          this.form.displayName = this.originalData.displayName;
          this.form.storeHandle = this.originalData.storeHandle;
          this.form.bio = this.originalData.bio;
          this.form.timezone = this.originalData.timezone;
          this.form.country = this.originalData.country;
          this.form.seoTitle = this.originalData.seoTitle;
          this.form.seoDescription = this.originalData.seoDescription;
          this.avatarPreview = profileData.avatar_url ? env.BASE_URL+'/'+profileData.avatar_url: '';
          this.avatarValidation = this.avatarPreview ? { status: 'success', message: '' } : { status: 'error', message: 'Profile photo is required.' };
        }
      } catch (error) {
        console.error('Failed to load profile', error);
        toast({
          type: 'error',
          message: 'Failed to load profile data.',
          duration: 3000
        });
      } finally {
        this.isLoading = false;
        // Initialize original data if not set by API
        if (Object.keys(this.originalData).length === 0) {
          this.originalData = {
            displayName: this.form.displayName,
            storeHandle: this.form.storeHandle,
            bio: this.form.bio,
            timezone: this.form.timezone,
            country: this.form.country,
            seoTitle: this.form.seoTitle,
            seoDescription: this.form.seoDescription,
          };
        }
      }
    },
    async loadCountries() {
      try {
        const response = await webService.get('/api/platform/get-countries');
        if (response.data.code === 200) {
          this.countries = response.data.data;
        }
      } catch (error) {
        console.error('Failed to load countries', error);
        // Set default countries if API fails
        this.countries = [
          { id: 1, name: 'INDIA' },
          { id: 2, name: 'USA' },
          { id: 3, name: 'UK' }
        ];
      }
    },
    async loadTimezones() {
      try {
        const response = await webService.get('/api/platform/get-timezones');
        if (response.data.code === 200) {
          this.timezones = response.data.data;
        }
      } catch (error) {
        console.error('Failed to load timezones', error);
        // Set default timezones if API fails
        this.timezones = [
          { id: 1, tz_name: 'UTC', utc_offset: '+00:00' },
          { id: 2, tz_name: 'Asia/Kolkata', utc_offset: '+05:30' },
          { id: 3, tz_name: 'America/New_York', utc_offset: '-05:00' }
        ];
      }
    },
    async loadSocialLinks() {
      try {
        const response = await webService.get('/api/platform/get-social-links');
        if (response.data.code === 200) {
          // Update existing social links
          response.data.data.forEach(item => {
            const existing = this.socialLinks.find(link => link.type === item.platform);
            if (existing) {
              existing.value = item.url;
            } else if (item.platform === 'custom') {
              // Add custom link
              this.socialLinks.push({
                id: this.nextSocialId++,
                type: 'custom',
                label: 'Custom',
                value: item.url,
                placeholder: 'https://your-social-link.com',
              });
            }
          });
          // Store original social links
          this.originalSocialLinks = JSON.parse(JSON.stringify(this.socialLinks));
        } else if (response.data.code === 600) {
          // No data, store original with defaults
          this.originalSocialLinks = JSON.parse(JSON.stringify(this.socialLinks));
        } else {
          // toast({
          //   type: 'error',
          //   message: response.data.message || 'Failed to load social links.',
          //   duration: 5000
          // });
          this.originalSocialLinks = JSON.parse(JSON.stringify(this.socialLinks));
        }
      } catch (error) {
        // console.error('Failed to load social links', error);
        // toast({
        //   type: 'error',
        //   message: 'Failed to load social links.',
        //   duration: 5000
        // });
        this.originalSocialLinks = JSON.parse(JSON.stringify(this.socialLinks));
      }
    },
    validateDisplayName() {
      if (!this.form.displayName.trim()) {
        this.validation.displayName = { status: 'error', message: "Display name is required" };
        return false;
      } else if (this.form.displayName.length > 100) {
        this.validation.displayName = { status: 'error', message: "Display name must be less than 100 characters" };
        return false;
      } else {
        this.validation.displayName = { status: 'success', message: "" };
        return true;
      }
    },
    validateStoreHandle() {
      const handleRegex = /^[a-zA-Z0-9_-]+$/;
      if (!this.form.storeHandle.trim()) {
        this.validation.storeHandle = { status: 'error', message: "Store handle is required" };
        return false;
      } else if (!handleRegex.test(this.form.storeHandle)) {
        this.validation.storeHandle = { status: 'error', message: "Store handle can only contain letters, numbers, hyphens, and underscores" };
        return false;
      } else if (this.form.storeHandle.length > 50) {
        this.validation.storeHandle = { status: 'error', message: "Store handle must be less than 50 characters" };
        return false;
      } else {
        this.validation.storeHandle = { status: 'success', message: "" };
        return true;
      }
    },
    validateBio() {
      if (!this.form.bio || !this.form.bio.trim()) {
        this.validation.bio = { status: 'error', message: "Bio is required" };
        return false;
      } else if (this.form.bio.length > 200) {
        this.validation.bio = { status: 'error', message: "Bio must be less than 200 characters" };
        return false;
      } else {
        this.validation.bio = { status: 'success', message: "" };
        return true;
      }
    },
    validateCountry() {
      if (!this.form.country) {
        this.validation.country = { status: 'error', message: "Country is required" };
        return false;
      } else {
        this.validation.country = { status: 'success', message: "" };
        return true;
      }
    },
    validateTimezone() {
      if (!this.form.timezone) {
        this.validation.timezone = { status: 'error', message: "Timezone is required" };
        return false;
      } else {
        this.validation.timezone = { status: 'success', message: "" };
        return true;
      }
    },
    validateAvatar() {
      if (this.avatar) {
        if (!this.avatar.type.startsWith('image/')) {
          this.avatarValidation = { status: 'error', message: 'Only image files are allowed.' };
          this.avatar = null;
          return false;
        }
        if (this.avatar.size > 6 * 1024 * 1024) {
          this.avatarValidation = { status: 'error', message: 'Image must be 6MB or smaller.' };
          this.avatar = null;
          return false;
        }
        this.avatarValidation = { status: 'success', message: '' };
        return true;
      }
      if (!this.avatarPreview) {
        this.avatarValidation = { status: 'error', message: 'Profile photo is required.' };
        return false;
      }
      this.avatarValidation = { status: 'success', message: '' };
      return true;
    },
    validateSeoTitle() {
      if (this.form.seoTitle && this.form.seoTitle.length > 60) {
        this.validation.seoTitle = { status: 'error', message: "SEO title must be less than 60 characters" };
        return false;
      } else {
        this.validation.seoTitle = { status: 'success', message: "" };
        return true;
      }
    },
    validateSeoDescription() {
      if (this.form.seoDescription && this.form.seoDescription.length > 160) {
        this.validation.seoDescription = { status: 'error', message: "SEO description must be less than 160 characters" };
        return false;
      } else {
        this.validation.seoDescription = { status: 'success', message: "" };
        return true;
      }
    },
    validateStep1() {
      const isDisplayNameValid = this.validateDisplayName();
      const isStoreHandleValid = this.validateStoreHandle();
      const isBioValid = this.validateBio();
      const isCountryValid = this.validateCountry();
      const isTimezoneValid = this.validateTimezone();
      const isAvatarValid = this.validateAvatar();

      return isDisplayNameValid && isStoreHandleValid && isBioValid && isCountryValid && isTimezoneValid && isAvatarValid;
    },
    validateStep3() {
      const isSeoTitleValid = this.validateSeoTitle();
      const isSeoDescriptionValid = this.validateSeoDescription();

      return isSeoTitleValid && isSeoDescriptionValid;
    },
    validateSocialLinks() {
      let isValid = true;
      this.socialLinks.forEach(link => {
        if (link.value.trim()) {
          try {
            new URL(link.value);
          } catch {
            isValid = false;
          }
        }
      });
      return isValid;
    },
    handleValidationErrors(errors) {
      // Reset all validation states
      Object.keys(this.validation).forEach(key => {
        this.validation[key] = { status: null, message: "" };
      });

      // Map API errors to form validation
      if (errors) {
        Object.keys(errors).forEach(field => {
          const errorMessages = errors[field];
          if (Array.isArray(errorMessages) && errorMessages.length > 0) {
            // Map API field names to form field names
            let formField = field;
            if (field === 'profile_name') formField = 'displayName';
            if (field === 'county') formField = 'country';
            
            if (this.validation[formField]) {
              this.validation[formField] = {
                status: 'error',
                message: errorMessages[0] // Show first error message
              };
            }
          }
        });
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.avatar = null;
        this.avatarPreview = '';
        this.avatarValidation = { status: 'error', message: 'Only image files are allowed.' };
        return;
      }

      if (file.size > 6 * 1024 * 1024) {
        this.avatar = null;
        this.avatarPreview = '';
        this.avatarValidation = { status: 'error', message: 'Image must be 6MB or smaller.' };
        return;
      }

      if (this.avatarPreview && this.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarPreview);
      }

      this.avatar = file;
      this.avatarPreview = URL.createObjectURL(file);
      this.avatarValidation = { status: 'success', message: '' };
    },
    removeAvatar() {
      if (this.avatarPreview && this.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarPreview);
      }
      this.avatar = null;
      this.avatarPreview = '';
      this.avatarValidation = { status: 'error', message: 'Profile photo is required.' };
    },
    onAvatarPreviewError() {
      if (this.avatarPreview && this.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarPreview);
      }
      this.avatarPreview = '';
      this.avatar = null;
      this.avatarValidation = { status: 'error', message: 'Profile photo could not be loaded. Please try to upload an image.' };
    },
    async submitProfile() {
      if (!this.hasFormChanges) {
        // toast({
        //   type: 'info',
        //   message: 'No changes detected. Nothing to save.',
        //   duration: 3000
        // });
        // Still proceed to step 2 if on step 1
        if (this.currentStep === 1) {
          this.currentStep = 2;
        }
        return;
      }

      this.isSubmitting = true;
      
      try {
        const formData = new FormData();
        formData.append('step', 'profile');
        formData.append('profile_name', this.form.displayName);
        formData.append('handle', this.form.storeHandle);
        formData.append('timezone', this.form.timezone);
        formData.append('county', this.form.country);
        formData.append('bio', (this.form.bio || '').trim());
        
        if (this.avatar) {
          formData.append('avatar', this.avatar);
        }

        const response = await webService.post('/api/platform/add-update-profile-by-step', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.code === 200) {
          // Update original data to reflect saved changes
          this.originalData = {
            displayName: this.form.displayName,
            storeHandle: this.form.storeHandle,
            bio: this.form.bio,
            timezone: this.form.timezone,
            country: this.form.country,
            seoTitle: this.form.seoTitle,
            seoDescription: this.form.seoDescription,
          };
          this.avatar = null; // Clear avatar after successful save

          toast({
            type: 'success',
            message: response.data.message || 'Profile updated successfully!',
            duration: 3000
          });
          // Proceed to step 2 only when saving profile from step 1
          if (this.currentStep === 1) {
            this.currentStep = 2;
          }
        } else if (response.data.code === 600) {
          // Handle validation errors
          this.handleValidationErrors(response.data.errors);
          toast({
            type: 'error',
            message: response.data.message || 'Validation failed. Please check the errors below.',
            duration: 3000
          });
        } else {
          toast({
            type: 'error',
            message: response.data.message || 'Failed to update profile.',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Profile update failed', error);
        toast({
          type: 'error',
          message: 'Failed to update profile. Please try again.',
          duration: 3000
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async saveSEO() {
      const formData = new FormData();
      formData.append('step', 'seo');
      formData.append('seo_title', this.form.seoTitle || '');
      formData.append('seo_description', this.form.seoDescription || '');

      try {
        const response = await webService.post('/api/platform/add-update-profile-by-step', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.code === 200) {
          // Update original data to reflect saved changes
          this.originalData.seoTitle = this.form.seoTitle;
          this.originalData.seoDescription = this.form.seoDescription;
          return true;
        } else if (response.data.code === 600) {
          // Handle validation errors
          this.handleValidationErrors(response.data.errors);
          return false;
        } else {
          toast({
            type: 'error',
            message: response.data.message || 'Failed to save SEO data.',
            duration: 3000
          });
          return false;
        }
      } catch (error) {
        console.error('SEO save failed', error);
        // toast({
        //   type: 'error',
        //   message: 'Failed to save SEO data. Please try again.',
        //   duration: 5000
        // });
        return false;
      }
    },
    async saveSocialLinks() {
      // Check if there are any changes
      const hasSocialChanges = JSON.stringify(this.socialLinks) !== JSON.stringify(this.originalSocialLinks);
      
      if (!hasSocialChanges) {
        // No changes, skip saving
        return true;
      }

      // Validate first
      if (!this.validateSocialLinks()) {
        toast({
          type: 'error',
          message: 'Please enter valid URLs for social links.',
          duration: 3000
        });
        return false;
      }

      // Ensure at least one valid link exists
      const validLinks = this.socialLinks.filter(link => link.value.trim());
      if (validLinks.length === 0) {
        toast({
          type: 'error',
          message: 'At least one social link must be provided.',
          duration: 3000
        });
        return false;
      }

      const data = validLinks.map(link => ({
        platform: link.type,
        url: link.value,
        sort_order: link.id
      }));

      try {
        const response = await webService.post('/api/platform/save-social-links', { data });
        if (response.data.code === 200) {
          // Update original
          this.originalSocialLinks = JSON.parse(JSON.stringify(this.socialLinks));
          toast({
            type: 'success',
            message: response.data.message || 'Social links saved successfully!',
            duration: 3000
          });
          return true;
        } else {
          toast({
            type: 'error',
            message: response.data.message || 'Failed to save social links.',
            duration: 3000
          });
          return false;
        }
      } catch (error) {
        console.error('Failed to save social links', error);
        toast({
          type: 'error',
          message: 'Failed to save social links.',
          duration: 3000
        });
        return false;
      }
    },
    async nextStep() {
      if (this.currentStep === 1) {
        if (!this.validateStep1()) {
          return;
        }
        // Don't auto-save here, let submitProfile handle it
        await this.submitProfile();
      } else if (this.currentStep === 2) {
        // Save social links
        this.saveSocialLinks().then(success => {
          if (success) {
            this.currentStep = 3;
          }
        });
      } else if (this.currentStep === 3) {
        if (!this.validateStep3()) {
          return;
        }
      } else {
        if (!this.isLastStep) {
          this.currentStep += 1;
        }
      }
    },
    prevStep() {
      if (!this.isFirstStep) {
        this.currentStep -= 1
      }
    },
    setStep(stepId) {
      // Only validate, don't auto-save when clicking step buttons
      if (this.currentStep === 1 && stepId !== 1) {
        if (!this.validateStep1()) {
          return;
        }
      } else if (this.currentStep === 2 && stepId !== 2) {
        if (!this.validateSocialLinks()) {
          toast({
            type: 'error',
            message: 'Please enter valid URLs for social links.',
            duration: 3000
          });
          return;
        }
      } else if (this.currentStep === 3 && stepId !== 3) {
        if (!this.validateStep3()) {
          return;
        }
      }
      
      this.currentStep = stepId;
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
      const item = this.socialLinks.find((item) => item.id === id)
      if (item && item.type === 'custom') {
        this.socialLinks = this.socialLinks.filter((item) => item.id !== id)
      }
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
    socialEmoji(type) {
      if (type === 'instagram') return '📸'
      if (type === 'twitter') return '🐦'
      if (type === 'youtube') return '▶️'
      if (type === 'linkedin') return '💼'
      return '🔗'
    },
    async saveProfile() {
      // Validate current data before final save
      const isStep3Valid = this.validateStep3();
      const isSocialValid = this.validateSocialLinks();
      
      if (!isStep3Valid || !isSocialValid) {
        toast({
          type: 'error',
          message: 'Please fix the validation errors before saving.',
          duration: 3000
        });
        return;
      }

      // Save social links first, then SEO
      const socialSaved = await this.saveSocialLinks();
      const seoSaved = await this.saveSEO();

      if (socialSaved && seoSaved) {
        toast({
          type: 'success',
          message: 'Profile updates saved successfully!',
          duration: 3000
        });
      }
    },
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />

    <div class="w-full space-y-6 lg:max-w-[70%]" style="width: 70%;">
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
        <div v-if="isLoading" class="p-6 text-center">
          <div class="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
            Loading profile data...
          </div>
        </div>
        <div v-else-if="currentStep === 1" class="p-4 sm:p-6">
          <div class="space-y-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Profile Photo</label>
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-xl text-white shadow-theme-xs overflow-hidden">
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar preview"
                    class="h-full w-full object-cover"
                    @error="onAvatarPreviewError"
                  />
                  <span v-else>AJ</span>
                </div>

                <div>
                  <div class="flex flex-wrap items-center gap-3">
                    <label for="avatar-upload" class="inline-flex h-10 items-center rounded-lg border border-brand-300 bg-brand-50 px-4 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/20 cursor-pointer">
                      Upload Photo
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        @change="handleFileUpload"
                        class="hidden"
                      />
                    </label>
                    
                  </div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Recommended: 400 x 400 px JPG or PNG, max 6MB</p>
                  <p v-if="avatar" class="mt-1 text-xs text-green-600 dark:text-green-400">Selected: {{ avatar.name }}</p>
                  <p v-if="avatarValidation.status === 'error'" class="mt-1 text-theme-xs text-error-500">
                    {{ avatarValidation.message }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Display Name <span class="text-error-500">*</span></label>
              <input
                type="text"
                v-model="form.displayName"
                @input="validateDisplayName"
                placeholder="Alex Johnson"
                :class="[
                  'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                  validation.displayName.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                  validation.displayName.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                  'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                ]"
              />
              <p v-if="validation.displayName.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                {{ validation.displayName.message }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Store Handle</label>
              <div class="relative w-full" style="width: 70%;">
                <span class="absolute left-0 top-1/2 inline-flex h-11 -translate-y-1/2 items-center justify-center border-r border-gray-200 py-3 pl-3.5 pr-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  creator.io/
                </span>
                <input
                  type="text"
                  v-model="form.storeHandle"
                  @input="validateStoreHandle"
                  placeholder="alexjohnson"
                  style="padding-left: 110px;"
                  :class="[
                    'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent py-2.5 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                    validation.storeHandle.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                    validation.storeHandle.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                    'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                  ]"
                />
              </div>
              <p v-if="validation.storeHandle.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                {{ validation.storeHandle.message }}
              </p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Your unique store URL — lowercase, no spaces</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Bio <span class="text-error-500">*</span></label>
              <textarea
                v-model="form.bio"
                @input="validateBio"
                rows="3"
                :class="[
                  'dark:bg-dark-900 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                  validation.bio.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                  validation.bio.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                  'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                ]"
              ></textarea>
              <p v-if="validation.bio.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                {{ validation.bio.message }}
              </p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Max 200 characters. Tell your audience what you do.</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Location & Region</label>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- <div class="relative z-20 bg-transparent">
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
                </div> -->

                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="form.country"
                    @change="validateCountry"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90"
                    :class="validation.country.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                           validation.country.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                           'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'"
                  >
                    <option value="">Select Country</option>
                    <option v-for="country in countries" :key="country.id" :value="country.name">{{ country.name }}</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">▾</span>
                  <p v-if="validation.country.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                    {{ validation.country.message }}
                  </p>
                </div>

                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="form.timezone"
                    @change="validateTimezone"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90"
                    :class="validation.timezone.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                           validation.timezone.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                           'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'"
                  >
                    <option value="">Select Timezone</option>
                    <option v-for="timezone in timezones" :key="timezone.id" :value="timezone.tz_name">{{ timezone.tz_name }} ({{ timezone.utc_offset }})</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">▾</span>
                  <p v-if="validation.timezone.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                    {{ validation.timezone.message }}
                  </p>
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
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-base" :class="socialIconClasses(item.type)">
                {{ socialEmoji(item.type) }}
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
                v-if="item.type === 'custom'"
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
                @input="validateSeoTitle"
                :class="[
                  'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                  validation.seoTitle.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                  validation.seoTitle.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                  'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                ]"
              />
              <p v-if="validation.seoTitle.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                {{ validation.seoTitle.message }}
              </p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Shown in Google search results and browser tabs</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">SEO Description</label>
              <textarea
                v-model="form.seoDescription"
                @input="validateSeoDescription"
                rows="3"
                :class="[
                  'dark:bg-dark-900 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                  validation.seoDescription.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                  validation.seoDescription.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                  'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                ]"
              ></textarea>
              <p v-if="validation.seoDescription.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                {{ validation.seoDescription.message }}
              </p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Max 160 characters recommended</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 border-t border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span :class="hasFormChanges ? 'bg-warning-500' : 'bg-success-500'" class="h-2 w-2 rounded-full"></span>
            {{ hasFormChanges ? 'Changes not yet saved' : 'All changes saved' }}
          </p>

          <div class="flex items-center gap-3">
            <button
              v-if="!isFirstStep"
              type="button"
              @click="prevStep"
              class="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              Previous
            </button>

            <button
              v-if="!isLastStep"
              type="button"
              @click="nextStep"
              :disabled="isSubmitting"
              class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

            <button
              v-else
              type="button"
              @click="saveProfile"
              :disabled="isSubmitting || !hasFormChanges"
              class="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="mr-2">Saving...</span>
              <span v-else>Save Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
  `,
}
