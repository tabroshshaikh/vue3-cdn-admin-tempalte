
import { useSidebar } from "../../composables/useSidebar.js";

export default {
    name: 'Backdrop',
  //   template: `
  // <div
  //   v-if="isMobileOpen"
  //   class="fixed inset-0 bg-gray-900/50 z-9999 lg:hidden"
  //   @click="toggleMobileSidebar"
  // ></div>
  // `,
    setup() {
        const { toggleMobileSidebar, isMobileOpen } = useSidebar();
        return { toggleMobileSidebar, isMobileOpen };
    }
}
