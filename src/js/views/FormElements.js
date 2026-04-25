import AdminLayout from '/src/js/components/layout/AdminLayout.js'
import PageBreadcrumb from '/src/js/components/common/PageBreadcrumb.js'

export default {
  name: 'FormElements',
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  data() {
    return {
      currentPageTitle: 'Form Elements',
      showPassword: false,
      formData: {
        input: '',
        inputWithPlaceholder: '',
        selectInput: '',
        password: '',
        cardNumber: '',
      },
      optionss: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'date', label: 'Date' },
        { value: 'elderberry', label: 'Elderberry' },
        { value: 'graphs', label: 'Graphs' },
      ],
      selectedItems: [],
      isMultipleSelectOpen: false,
      singleSelect: '',
      normalDescription: '',
      disabledDescription: 'This textarea is disabled',
      errorDescription: '',
      errorEmail: 'demoemail',
      successEmail: 'demoemail@gmail.com',
      email: '',
      selectedCountry: 'US',
      selectedCountry2: 'US',
      phoneNumber: '',
      phoneNumber2: '',
      url: '',
      website: 'www.tailadmin.com',
      copyText: 'Copy',
      countryCodes: {
        US: '+1',
        GB: '+44',
        CA: '+1',
        AU: '+61',
      },
      checkboxOne: false,
      checkboxTwo: true,
      checkboxThree: true,
    }
  },
  methods: {
    toggleMultipleSelectDropdown() {
      this.isMultipleSelectOpen = !this.isMultipleSelectOpen
    },
    toggleMultipleSelectItem(item) {
      const index = this.selectedItems.findIndex((selected) => selected.value === item.value)
      if (index === -1) {
        this.selectedItems.push(item)
      } else {
        this.selectedItems.splice(index, 1)
      }
    },
    removeMultipleSelectItem(item) {
      const index = this.selectedItems.findIndex((selected) => selected.value === item.value)
      if (index !== -1) {
        this.selectedItems.splice(index, 1)
      }
    },
    isMultipleSelectItemSelected(item) {
      return this.selectedItems.some((selected) => selected.value === item.value)
    },
    handleMultipleSelectClickOutside(event) {
      const multiSelectRef = this.$refs.multiSelectRef
      if (multiSelectRef && !multiSelectRef.contains(event.target)) {
        this.isMultipleSelectOpen = false
      }
    },
    updatePhoneNumber() {
      this.phoneNumber = this.countryCodes[this.selectedCountry]
    },
    updatePhoneNumber2() {
      this.phoneNumber2 = this.countryCodes[this.selectedCountry2]
    },
    copyWebsite() {
      navigator.clipboard.writeText(this.website)
      this.copyText = 'Copied!'
      setTimeout(() => {
        this.copyText = 'Copy'
      }, 2000)
    },
  },
  mounted() {
    document.addEventListener('click', this.handleMultipleSelectClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleMultipleSelectClickOutside)
  },
  template: `
  <admin-layout>
    <page-breadcrumb :page-title="currentPageTitle" />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">

        <!-- ComponentCard -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              Default Inputs
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- DefaultInputs -->
              <div class="space-y-6">
                  <!-- Text Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Input
                    </label>
                    <input
                      type="text"
                      v-model="formData.input"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
              
                  <!-- Input with Placeholder -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Input with Placeholder
                    </label>
                    <input
                      type="text"
                      v-model="formData.inputWithPlaceholder"
                      placeholder="info@gmail.com"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
              
                  <!-- Select Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Select Input
                    </label>
                    <div class="relative z-20 bg-transparent">
                      <select
                        v-model="formData.selectInput"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        :class="{ 'text-gray-800 dark:text-white/90': formData.selectInput }"
                      >
                        <option value="" disabled selected>Select Option</option>
                        <option value="marketing">Marketing</option>
                        <option value="template">Template</option>
                        <option value="development">Development</option>
                      </select>
                      <span
                        class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
                      >
                        <svg
                          class="stroke-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                            stroke=""
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
              
                  <!-- Password Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Password Input
                    </label>
                    <div class="relative">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="formData.password"
                        placeholder="Enter your password"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                      <span
                        @click="showPassword = !showPassword"
                        class="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        <svg
                          v-if="!showPassword"
                          class="fill-gray-500 dark:fill-gray-400"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="fill-gray-500 dark:fill-gray-400"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
              
                  <!-- Input with Payment -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Input with Payment
                    </label>
                    <div class="relative">
                      <input
                        type="text"
                        v-model="formData.cardNumber"
                        placeholder="Card number"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                      <span
                        class="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                          <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                          <path
                            d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                            fill="#FC6020"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- ComponentCard -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              Select Inputs
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- SelectInput -->
              <div class="space-y-6">
                  <!-- Single Select Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Select Input
                    </label>
                    <div class="relative z-20 bg-transparent">
                      <select
                        v-model="singleSelect"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        :class="{ 'text-gray-800 dark:text-white/90': singleSelect }"
                      >
                        <option value="" disabled>Select Option</option>
                        <option value="marketing" class="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                          Marketing
                        </option>
                        <option value="template" class="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                          Template
                        </option>
                        <option value="development" class="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                          Development
                        </option>
                      </select>
                      <span
                        class="absolute z-30 text-gray-700 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
                      >
                        <svg
                          class="stroke-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                            stroke=""
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
              
                  <!-- Multiple Select Input -->
                  <div>
                  <div class="relative w-full" ref="multiSelectRef">
                    <div
                      @click="toggleMultipleSelectDropdown"
                      class="dark:bg-dark-900 h-11 flex items-center w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      :class="{ 'text-gray-800 dark:text-white/90': isMultipleSelectOpen }"
                    >
                      <span v-if="selectedItems.length === 0" class="text-gray-400"> Select items... </span>
                      <div class="flex flex-wrap items-center flex-auto gap-2">
                        <div
                          v-for="item in selectedItems"
                          :key="item.value"
                          class="group flex items-center justify-center h-[30px] rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                        >
                          <span>{{ item.label }}</span>
                          <button
                            @click.stop="removeMultipleSelectItem(item)"
                            class="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
                            aria-label="Remove item"
                          >
                            <svg role="button" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <svg class="ml-auto" :class="{ 'transform rotate-180': isMultipleSelectOpen }" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                      <div v-if="isMultipleSelectOpen" class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-sm dark:bg-gray-900">
                        <ul class="overflow-y-auto divide-y divide-gray-200 custom-scrollbar max-h-60 dark:divide-gray-800" role="listbox" aria-multiselectable="true">
                          <li v-for="item in optionss" :key="item.value" @click="toggleMultipleSelectItem(item)" class="relative flex items-center w-full px-3 py-2 border-transparent cursor-pointer first:rounded-t-lg last:rounded-b-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800" :class="{ 'bg-gray-50 dark:bg-white/[0.03]': isMultipleSelectItemSelected(item) }" role="option" :aria-selected="isMultipleSelectItemSelected(item)">
                            <span class="grow">{{ item.label }}</span>
                            <svg v-if="isMultipleSelectItemSelected(item)" class="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- ComponentCard - TextArea -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              Inputs States
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- TextArea -->
              <div class="space-y-6">
                  <!-- Normal Textarea -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Description
                    </label>
                    <textarea v-model="normalDescription" placeholder="Enter a description..." rows="6" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
                  </div>
              
                  <!-- Disabled Textarea -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-300 dark:text-white/15">
                      Description
                    </label>
                    <textarea v-model="disabledDescription" placeholder="Enter a description..." rows="6" disabled class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:shadow-focus-ring focus:outline-hidden focus:ring-0 disabled:border-gray-100 disabled:bg-gray-50 disabled:placeholder:text-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 dark:disabled:border-gray-800 dark:disabled:bg-white/[0.03] dark:disabled:placeholder:text-white/15"></textarea>
                  </div>
              
                  <!-- Error State Textarea -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Description
                    </label>
                    <textarea v-model="errorDescription" placeholder="Enter a description..." rows="6" class="dark:bg-dark-900 w-full rounded-lg border border-error-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-error-300 focus:outline-hidden focus:ring-3 focus:ring-error-500/10 dark:border-error-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-error-800"></textarea>
                    <p class="mt-1.5 text-theme-xs text-error-500">Please enter a message in the textarea.</p>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- ComponentCard - Input States -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              Inputs States
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- InputState -->
              <div class="space-y-6">
                  <!-- Error State Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email
                    </label>
                    <div class="relative">
                      <input type="text" v-model="errorEmail" class="dark:bg-dark-900 w-full rounded-lg border border-error-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-error-300 focus:outline-hidden focus:ring-3 focus:ring-error-500/10 dark:border-error-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-error-800" />
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58325 7.99967C2.58325 5.00813 5.00838 2.58301 7.99992 2.58301C10.9915 2.58301 13.4166 5.00813 13.4166 7.99967C13.4166 10.9912 10.9915 13.4163 7.99992 13.4163C5.00838 13.4163 2.58325 10.9912 2.58325 7.99967ZM7.99992 1.08301C4.17995 1.08301 1.08325 4.17971 1.08325 7.99967C1.08325 11.8196 4.17995 14.9163 7.99992 14.9163C11.8199 14.9163 14.9166 11.8196 14.9166 7.99967C14.9166 4.17971 11.8199 1.08301 7.99992 1.08301ZM7.09932 5.01639C7.09932 5.51345 7.50227 5.91639 7.99932 5.91639H7.99999C8.49705 5.91639 8.89999 5.51345 8.89999 5.01639C8.89999 4.51933 8.49705 4.11639 7.99999 4.11639H7.99932C7.50227 4.11639 7.09932 4.51933 7.09932 5.01639ZM7.99998 11.8306C7.58576 11.8306 7.24998 11.4948 7.24998 11.0806V7.29627C7.24998 6.88206 7.58576 6.54627 7.99998 6.54627C8.41419 6.54627 8.74998 6.88206 8.74998 7.29627V11.0806C8.74998 11.4948 8.41419 11.8306 7.99998 11.8306Z" fill="#F04438" />
                        </svg>
                      </span>
                    </div>
                    <p class="mt-1.5 text-theme-xs text-error-500">This is an error message.</p>
                  </div>
              
                  <!-- Success State Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email
                    </label>
                    <div class="relative">
                      <input type="text" v-model="successEmail" class="dark:bg-dark-900 w-full rounded-lg border border-success-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-success-300 focus:outline-hidden focus:ring-3 focus:ring-success-500/10 dark:border-success-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-success-800" />
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.61792 8.00034C2.61792 5.02784 5.0276 2.61816 8.00009 2.61816C10.9726 2.61816 13.3823 5.02784 13.3823 8.00034C13.3823 10.9728 10.9726 13.3825 8.00009 13.3825C5.0276 13.3825 2.61792 10.9728 2.61792 8.00034ZM8.00009 1.11816C4.19917 1.11816 1.11792 4.19942 1.11792 8.00034C1.11792 11.8013 4.19917 14.8825 8.00009 14.8825C11.801 14.8825 14.8823 11.8013 14.8823 8.00034C14.8823 4.19942 11.801 1.11816 8.00009 1.11816ZM10.5192 7.266C10.8121 6.97311 10.8121 6.49823 10.5192 6.20534C10.2264 5.91245 9.75148 5.91245 9.45858 6.20534L7.45958 8.20434L6.54162 7.28638C6.24873 6.99349 5.77385 6.99349 5.48096 7.28638C5.18807 7.57927 5.18807 8.05415 5.48096 8.34704L6.92925 9.79533C7.0699 9.93599 7.26067 10.015 7.45958 10.015C7.6585 10.015 7.84926 9.93599 7.98991 9.79533L10.5192 7.266Z" fill="#12B76A" />
                        </svg>
                      </span>
                    </div>
                    <p class="mt-1.5 text-theme-xs text-success-500">This is a success message.</p>
                  </div>
              
                  <!-- Disabled State Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-300 dark:text-white/15">
                      Email
                    </label>
                    <input type="text" placeholder="info@gmail.com" disabled class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:shadow-focus-ring focus:outline-hidden disabled:border-gray-100 disabled:placeholder:text-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-400 dark:focus:border-brand-300 dark:disabled:border-gray-800 dark:disabled:placeholder:text-white/15" />
                  </div>
                </div>
            </div>
          </div>
        </div>

      </div>
      <div class="space-y-6">

        <!-- ComponentCard - Input Groups -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              Inputs Group
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- InputGroup -->
              <div class="space-y-6">
                  <!-- Email Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email
                    </label>
                    <div class="relative">
                      <span class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04175 7.06206V14.375C3.04175 14.6511 3.26561 14.875 3.54175 14.875H16.4584C16.7346 14.875 16.9584 14.6511 16.9584 14.375V7.06245L11.1443 11.1168C10.457 11.5961 9.54373 11.5961 8.85638 11.1168L3.04175 7.06206ZM16.9584 5.19262C16.9584 5.19341 16.9584 5.1942 16.9584 5.19498V5.20026C16.9572 5.22216 16.946 5.24239 16.9279 5.25501L10.2864 9.88638C10.1145 10.0062 9.8862 10.0062 9.71437 9.88638L3.07255 5.25485C3.05342 5.24151 3.04202 5.21967 3.04202 5.19636C3.042 5.15695 3.07394 5.125 3.11335 5.125H16.8871C16.9253 5.125 16.9564 5.15494 16.9584 5.19262ZM18.4584 5.21428V14.375C18.4584 15.4796 17.563 16.375 16.4584 16.375H3.54175C2.43718 16.375 1.54175 15.4796 1.54175 14.375V5.19498C1.54175 5.1852 1.54194 5.17546 1.54231 5.16577C1.55858 4.31209 2.25571 3.625 3.11335 3.625H16.8871C17.7549 3.625 18.4584 4.32843 18.4585 5.19622C18.4585 5.20225 18.4585 5.20826 18.4584 5.21428Z" fill="#667085" />
                        </svg>
                      </span>
                      <input v-model="email" type="text" placeholder="info@gmail.com" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    </div>
                  </div>
              
                  <!-- Phone Input with Prepended Country Code -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Phone
                    </label>
                    <div class="relative">
                      <div class="absolute">
                        <select v-model="selectedCountry" @change="updatePhoneNumber" class="appearance-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400">
                          <option v-for="(code, country) in countryCodes" :key="country" :value="country">
                            {{ country }}
                          </option>
                        </select>
                        <div class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">
                          <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <input v-model="phoneNumber" placeholder="+1 (555) 000-0000" type="tel" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[84px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    </div>
                  </div>
              
                  <!-- Phone Input with Appended Country Code -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Phone
                    </label>
                    <div class="relative">
                      <div class="absolute right-0">
                        <select v-model="selectedCountry2" @change="updatePhoneNumber2" class="appearance-none rounded-r-lg border-0 border-l border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400">
                          <option v-for="(code, country) in countryCodes" :key="country" :value="country">
                            {{ country }}
                          </option>
                        </select>
                        <div class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">
                          <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <input v-model="phoneNumber2" placeholder="+1 (555) 000-0000" type="tel" class="dark:bg-dark-900 h-11 w-full p-3 rounded-lg border border-gray-300 bg-transparent py-3 pr-[84px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    </div>
                  </div>
              
                  <!-- URL Input -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"> URL </label>
                    <div class="relative">
                      <span class="absolute left-0 top-1/2 inline-flex h-11 -translate-y-1/2 items-center justify-center border-r border-gray-200 py-3 pl-3.5 pr-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        http://
                      </span>
                      <input v-model="url" type="url" placeholder="www.tailadmin.com" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[90px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    </div>
                  </div>
              
                  <!-- Website Input with Copy Button -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Website
                    </label>
                    <div class="relative">
                      <button @click="copyWebsite" class="absolute right-0 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 border-l border-gray-200 py-3 pl-3.5 pr-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-400">
                        <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.58822 4.58398C6.58822 4.30784 6.81207 4.08398 7.08822 4.08398H15.4154C15.6915 4.08398 15.9154 4.30784 15.9154 4.58398L15.9154 12.9128C15.9154 13.189 15.6916 13.4128 15.4154 13.4128H7.08821C6.81207 13.4128 6.58822 13.189 6.58822 12.9128V4.58398ZM7.08822 2.58398C5.98365 2.58398 5.08822 3.47942 5.08822 4.58398V5.09416H4.58496C3.48039 5.09416 2.58496 5.98959 2.58496 7.09416V15.4161C2.58496 16.5207 3.48039 17.4161 4.58496 17.4161H12.9069C14.0115 17.4161 14.9069 16.5207 14.9069 15.4161L14.9069 14.9128H15.4154C16.52 14.9128 17.4154 14.0174 17.4154 12.9128L17.4154 4.58398C17.4154 3.47941 16.52 2.58398 15.4154 2.58398H7.08822ZM13.4069 14.9128H7.08821C5.98364 14.9128 5.08822 14.0174 5.08822 12.9128V6.59416H4.58496C4.30882 6.59416 4.08496 6.81801 4.08496 7.09416V15.4161C4.08496 15.6922 4.30882 15.9161 4.58496 15.9161H12.9069C13.183 15.9161 13.4069 15.6922 13.4069 15.4161L13.4069 14.9128Z" fill="" />
                        </svg>
                        <div>{{ copyText }}</div>
                      </button>
                      <input v-model="website" type="url" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-4 pr-[90px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- ComponentCard - File Input -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              File Input
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- FileInput -->
              <div class="space-y-6">
                  <!-- Elements -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Upload file
                    </label>
                    <input type="file" class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400" />
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- ComponentCard - Checkboxes -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Card Header -->
          <div class="px-6 py-5">
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              Checkboxes
            </h3>
          </div>
          <!-- Card Body -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div class="space-y-5">
              <!-- CheckboxInput -->
              <div class="space-y-6">
                  <div class="flex flex-wrap items-center gap-8">
                    <!-- Default Checkbox -->
                    <div>
                      <label for="checkboxLabelOne" class="flex items-center text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
                        <div class="relative">
                          <input type="checkbox" id="checkboxLabelOne" v-model="checkboxOne" class="sr-only" />
                          <div :class="checkboxOne ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'" class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500">
                            <span :class="checkboxOne ? '' : 'opacity-0'">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        Default
                      </label>
                    </div>
              
                    <!-- Checked Checkbox -->
                    <div>
                      <label for="checkboxLabelTwo" class="flex items-center text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
                        <div class="relative">
                          <input type="checkbox" id="checkboxLabelTwo" v-model="checkboxTwo" class="sr-only" />
                          <div :class="checkboxTwo ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'" class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500">
                            <span :class="checkboxTwo ? '' : 'opacity-0'">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        Checked
                      </label>
                    </div>
              
                    <!-- Disabled Checkbox -->
                    <div>
                      <label for="checkboxLabelThree" class="flex items-center text-sm font-medium text-gray-300 cursor-pointer select-none dark:text-gray-700">
                        <div class="relative">
                          <input type="checkbox" id="checkboxLabelThree" v-model="checkboxThree" class="sr-only peer" disabled />
                          <div :class="checkboxThree ? 'bg-transparent border-gray-200 dark:border-gray-800' : 'border-brand-500 bg-brand-500'" class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]">
                            <span :class="checkboxThree ? '' : 'opacity-0'">
                              <svg class="stroke-gray-200 dark:stroke-gray-800" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        Disabled
                      </label>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </admin-layout>
  `,
}
