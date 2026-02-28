// RegisterComponent.js - CDN-based Vue 3 Component
const { webService } = await import(`/src/js/utils/webService.js?v=${v}`);
const { default: auth } = await import(`/src/js/auth.js?v=${v}`);

export default {
  template: `
  <div v-if="!isCheckingAuth" class="min-h-screen">
    <main>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div class="mb-5 sm:mb-8">
              <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign Up</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign up!</p>
            </div>
            <div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                <button class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                    <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                    <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                    <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
                  </svg>
                  Sign up with Google
                </button>
                <button class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                  <svg width="21" class="fill-current" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z"/>
                  </svg>
                  Sign up with X
                </button>
              </div>
              <div class="relative py-3 sm:py-5">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">Or</span>
                </div>
              </div>
              <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                  <div class="">
                      <label for="name" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Full Name<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input 
                          v-model="name" 
                          @input="validateName"
                          type="text" 
                          id="name" 
                          placeholder="Enter your full name" 
                          :class="[
                            'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                            validation.name.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                            validation.name.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                            'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus-border-brand-800'
                          ]"
                        />
                        <span v-if="validation.name.status" class="absolute top-1/2 right-3.5 -translate-y-1/2">
                          <svg v-if="validation.name.status === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.61792 8.00034C2.61792 5.02784 5.0276 2.61816 8.00009 2.61816C10.9726 2.61816 13.3823 5.02784 13.3823 8.00034C13.3823 10.9728 10.9726 13.3825 8.00009 13.3825C5.0276 13.3825 2.61792 10.9728 2.61792 8.00034ZM8.00009 1.11816C4.19917 1.11816 1.11792 4.19942 1.11792 8.00034C1.11792 11.8013 4.19917 14.8825 8.00009 14.8825C11.801 14.8825 14.8823 11.8013 14.8823 8.00034C14.8823 4.19942 11.801 1.11816 8.00009 1.11816ZM10.5192 7.266C10.8121 6.97311 10.8121 6.49823 10.5192 6.20534C10.2264 5.91245 9.75148 5.91245 9.45858 6.20534L7.45958 8.20434L6.54162 7.28638C6.24873 6.99349 5.77385 6.99349 5.48096 7.28638C5.18807 7.57927 5.18807 8.05415 5.48096 8.34704L6.92925 9.79533C7.0699 9.93599 7.26067 10.015 7.45958 10.015C7.6585 10.015 7.84926 9.93599 7.98991 9.79533L10.5192 7.266Z" fill="#12B76A"></path>
                          </svg>
                          <svg v-if="validation.name.status === 'error'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58325 7.99967C2.58325 5.00813 5.00838 2.58301 7.99992 2.58301C10.9915 2.58301 13.4166 5.00813 13.4166 7.99967C13.4166 10.9912 10.9915 13.4163 7.99992 13.4163C5.00838 13.4163 2.58325 10.9912 2.58325 7.99967ZM7.99992 1.08301C4.17995 1.08301 1.08325 4.17971 1.08325 7.99967C1.08325 11.8196 4.17995 14.9163 7.99992 14.9163C11.8199 14.9163 14.9166 11.8196 14.9166 7.99967C14.9166 4.17971 11.8199 1.08301 7.99992 1.08301ZM7.09932 5.01639C7.09932 5.51345 7.50227 5.91639 7.99932 5.91639H7.99999C8.49705 5.91639 8.89999 5.51345 8.89999 5.01639C8.89999 4.51933 8.49705 4.11639 7.99999 4.11639H7.99932C7.50227 4.11639 7.09932 4.51933 7.09932 5.01639ZM7.99998 11.8306C7.58576 11.8306 7.24998 11.4948 7.24998 11.0806V7.29627C7.24998 6.88206 7.58576 6.54627 7.99998 6.54627C8.41419 6.54627 8.74998 6.88206 8.74998 7.29627V11.0806C8.74998 11.4948 8.41419 11.8306 7.99998 11.8306Z" fill="#F04438"></path>
                          </svg>
                        </span>
                      </div>
                      <p v-if="validation.name.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                        {{ validation.name.message }}
                      </p>
                  </div>
                  <div>
                    <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email<span class="text-error-500">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        v-model="email" 
                        @input="validateEmail"
                        type="email" 
                        id="email" 
                        placeholder="Enter your email" 
                        :class="[
                          'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                          validation.email.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                          validation.email.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                          'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                        ]"
                      />
                      <span v-if="validation.email.status" class="absolute top-1/2 right-3.5 -translate-y-1/2">
                        <svg v-if="validation.email.status === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.61792 8.00034C2.61792 5.02784 5.0276 2.61816 8.00009 2.61816C10.9726 2.61816 13.3823 5.02784 13.3823 8.00034C13.3823 10.9728 10.9726 13.3825 8.00009 13.3825C5.0276 13.3825 2.61792 10.9728 2.61792 8.00034ZM8.00009 1.11816C4.19917 1.11816 1.11792 4.19942 1.11792 8.00034C1.11792 11.8013 4.19917 14.8825 8.00009 14.8825C11.801 14.8825 14.8823 11.8013 14.8823 8.00034C14.8823 4.19942 11.801 1.11816 8.00009 1.11816ZM10.5192 7.266C10.8121 6.97311 10.8121 6.49823 10.5192 6.20534C10.2264 5.91245 9.75148 5.91245 9.45858 6.20534L7.45958 8.20434L6.54162 7.28638C6.24873 6.99349 5.77385 6.99349 5.48096 7.28638C5.18807 7.57927 5.18807 8.05415 5.48096 8.34704L6.92925 9.79533C7.0699 9.93599 7.26067 10.015 7.45958 10.015C7.6585 10.015 7.84926 9.93599 7.98991 9.79533L10.5192 7.266Z" fill="#12B76A"></path>
                        </svg>
                        <svg v-if="validation.email.status === 'error'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58325 7.99967C2.58325 5.00813 5.00838 2.58301 7.99992 2.58301C10.9915 2.58301 13.4166 5.00813 13.4166 7.99967C13.4166 10.9912 10.9915 13.4163 7.99992 13.4163C5.00838 13.4163 2.58325 10.9912 2.58325 7.99967ZM7.99992 1.08301C4.17995 1.08301 1.08325 4.17971 1.08325 7.99967C1.08325 11.8196 4.17995 14.9163 7.99992 14.9163C11.8199 14.9163 14.9166 11.8196 14.9166 7.99967C14.9166 4.17971 11.8199 1.08301 7.99992 1.08301ZM7.09932 5.01639C7.09932 5.51345 7.50227 5.91639 7.99932 5.91639H7.99999C8.49705 5.91639 8.89999 5.51345 8.89999 5.01639C8.89999 4.51933 8.49705 4.11639 7.99999 4.11639H7.99932C7.50227 4.11639 7.09932 4.51933 7.09932 5.01639ZM7.99998 11.8306C7.58576 11.8306 7.24998 11.4948 7.24998 11.0806V7.29627C7.24998 6.88206 7.58576 6.54627 7.99998 6.54627C8.41419 6.54627 8.74998 6.88206 8.74998 7.29627V11.0806C8.74998 11.4948 8.41419 11.8306 7.99998 11.8306Z" fill="#F04438"></path>
                        </svg>
                      </span>
                    </div>
                    <p v-if="validation.email.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                      {{ validation.email.message }}
                    </p>
                  </div>
                  <div>
                    <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Password<span class="text-error-500">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        v-model="password" 
                        @input="validatePassword"
                        :type="showPassword ? 'text' : 'password'" 
                        id="password" 
                        placeholder="Enter your password" 
                        :class="[
                          'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                          validation.password.status === 'error' ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800' : 
                          validation.password.status === 'success' ? 'border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:focus:border-success-800' : 
                          'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                        ]"
                      />
                      <span @click="togglePasswordVisibility" class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400">
                        <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" fill="#98A2B3"/>
                        </svg>
                        <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z" fill="#98A2B3"/>
                        </svg>
                      </span>
                    </div>
                    <p v-if="validation.password.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                      {{ validation.password.message }}
                    </p>
                  </div>
                  <div>
                    <label for="checkboxLabelOne" class="flex items-start text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400">
                      <div class="relative">
                        <input v-model="agreeToTerms" @change="validateTerms" type="checkbox" id="checkboxLabelOne" class="sr-only"/>
                        <div :class="agreeToTerms ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'" class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]">
                          <span :class="agreeToTerms ? '' : 'opacity-0'">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                      <p class="inline-block font-normal text-gray-500 dark:text-gray-400">
                        By creating an account means you agree to the
                        <span class="text-gray-800 dark:text-white/90">Terms and Conditions,</span>
                        and our
                        <span class="text-gray-800 dark:text-white">Privacy Policy</span>
                      </p>
                    </label>
                    <p v-if="validation.terms.status === 'error'" class="mt-1.5 text-theme-xs text-error-500">
                      {{ validation.terms.message }}
                    </p>
                  </div>
                  <div>
                    <button 
                      type="submit" 
                      :disabled="isSubmitting"
                      :class="[
                        'flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600',
                        isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                      ]"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </form>
              <div class="mt-5">
                <p class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Already have an account? <router-link to="/login" class="text-brand-500 hover:text-brand-600 dark:text-brand-400">Sign In</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     </main>
  </div>
  `,
  data() {
    return {
      isCheckingAuth: true,
      name: '',
      email: '',
      password: '',
      showPassword: false,
      agreeToTerms: false,
      isSubmitting: false,
      validation: {
        name: { status: null, message: "" },
        email: { status: null, message: "" },
        password: { status: null, message: "" },
        terms: { status: null, message: "" }
      }
    }
  },
  created() {
    if (auth.isAuthenticated()) {
      window.location.href = '/dashboard';
    } else {
      this.isCheckingAuth = false;
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleSubmit() {
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      this.validateTerms();

      if (
        this.validation.name.status === 'error' ||
        this.validation.email.status === 'error' ||
        this.validation.password.status === 'error' ||
        this.validation.terms.status === 'error'
      ) {
        return;
      }

      this.isSubmitting = true;

      webService.post('/api/auth/register', {
        name: this.name,
        email: this.email,
        password: this.password
      }).then(response => {
        if (response.data.code == 200) {
          toast({
            type: 'success',
            message: response.data.message || 'Registration successful! Redirecting to dashboard...',
            duration: 5000
          });
          auth.login(response.data.data);
          window.location.href = '/dashboard';
        } else {
          toast({
            type: 'error',
            message: response.data.message || 'Registration failed. Please check your details and try again.',
            duration: 5000
          });
        }
      }).catch(error => {
        console.error("Registration failed", error);
      }).finally(() => {
        this.isSubmitting = false;
      });
    },
    validateName() {
      if (!this.name) {
        this.validation.name = { status: 'error', message: "Full name is required" };
      } else {
        this.validation.name = { status: 'success', message: "" };
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.validation.email = { status: 'error', message: "Email is required" };
      } else if (!emailRegex.test(this.email)) {
        this.validation.email = { status: 'error', message: "Please enter a valid email address" };
      } else {
        this.validation.email = { status: 'success', message: "" };
      }
    },
    validatePassword() {
      const password = this.password;
      const hasLetter = /[A-Za-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);

      if (!password) {
        this.validation.password = { status: 'error', message: "Password is required" };
      } else if (password.length < 8) {
        this.validation.password = { status: 'error', message: "Password must be at least 8 characters" };
      } else if (password.length > 50) {
        this.validation.password = { status: 'error', message: "Password must not exceed 50 characters" };
      } else if (!hasLetter || !hasNumber || !hasSpecial) {
        this.validation.password = { 
          status: 'error', 
          message: "Password must be alphanumeric and include at least one special symbol" 
        };
      } else {
        this.validation.password = { status: 'success', message: "" };
      }
    },
    validateTerms() {
      if (!this.agreeToTerms) {
        this.validation.terms = { status: 'error', message: "You must agree to the Terms and Conditions" };
      } else {
        this.validation.terms = { status: 'success', message: "" };
      }
    }
  }
};
