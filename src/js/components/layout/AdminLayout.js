
import AppSidebar from '/src/js/components/layout/AppSidebar.js';
import AppHeader from '/src/js/components/layout/AppHeader.js';
import Backdrop from '/src/js/components/layout/Backdrop.js';
import { useSidebar } from '/src/js/composables/useSidebar.js';

export default {
  name: 'AdminLayout',
  components: {
    AppSidebar,
    AppHeader,
    Backdrop
  },
  template: `
  <div class="flex h-screen overflow-hidden">
    <app-sidebar />
    <Backdrop />
    <div
      class="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
  `,
  setup() {
    const { isExpanded, isHovered } = useSidebar()
    return { isExpanded, isHovered }
  }, 
}
