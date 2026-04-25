
const { ref, computed } = Vue;
const { useRoute } = VueRouter;

import {
    ChevronDownIcon,
    HorizontalDots,
} from "../../icons/index.js";
import SidebarWidget from "./SidebarWidget.js";
import { useSidebar } from "../../composables/useSidebar.js";

export default {
    name: 'AppSidebar',
    components: {
        SidebarWidget,
        HorizontalDots,
        ChevronDownIcon
    },
    template: `
  <aside
    :class="[
      'sidebar fixed left-0 top-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-black lg:static lg:translate-x-0',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex items-center gap-2 pt-8 sidebar-header pb-7',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.section }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.label">
                <router-link
                  :to="item.path"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    {{ item.icon }}
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                  >
                    {{ item.label }}
                  </span>
                  <span
                    v-if="item.badge && (isExpanded || isHovered || isMobileOpen)"
                    :class="[
                      'ml-auto px-2 py-1 text-xs rounded',
                      isActive(item.path)
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                    ]"
                  >
                    {{ item.badge }}
                  </span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
    `,
    setup() {
        const route = useRoute();
        const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

        const menuGroups = [
            // {
            //     section: "OVERVIEW",
            //     items: [
            //         { icon: "⚡", label: "Dashboard", path: "/", badge: null, active: true },
            //         { icon: "📊", label: "Analytics", path: "/analytics", badge: "NEW", active: false },
            //     ],
            // },

            {
                section: "STORE",
                items: [
                    { icon: "👤", label: "Profile", path: "/profile", badge: null, active: false },
                    { icon: "📄", label: "Link in Bio", path: "/Landing-Page", badge: null, active: false },
                    { icon: "🎨", label: "Themes & Design", path: "/Design", badge: null, active: false },

                ],
            },
            {
                section: "Products",
                items: [
                    { icon: "🛍️", label: "Products", path: "/products", badge: "12", active: false },
                    { icon: "🎓", label: "Courses", path: "/courses", badge: null, active: false },
                    { icon: "📦", label: "Digital Downloads", path: "/digital-downloads", badge: null, active: false },
                    { icon: "♾️", label: "Memberships", path: "/memberships", badge: "3", active: false },
                    { icon: "📅", label: "Bookings", path: "/bookings", badge: null, active: false },
                    { icon: "🎟️", label: "Webinars", path: "/webinars", badge: "BETA", active: false },
                ],
            },
            {
                section: "AUDIENCE",
                items: [
                    { icon: "👥", label: "Contacts", path: "/contacts", badge: "1.2k", active: false },
                    { icon: "📧", label: "Email Campaigns", path: "/email-campaigns", badge: null, active: false },
                    { icon: "🏷️", label: "Segments & Tags", path: "/segments-tags", badge: null, active: false },
                    { icon: "💬", label: "Community", path: "/community", badge: "5", active: false },
                ],
            },
            {
                section: "REVENUE",
                items: [
                    { icon: "💰", label: "Payments", path: "/payments", badge: null, active: false },
                    { icon: "🧾", label: "Invoices", path: "/invoices", badge: null, active: false },
                    { icon: "🎁", label: "Coupons & Offers", path: "/coupons-offers", badge: null, active: false },
                    { icon: "🤝", label: "Affiliates", path: "/affiliates", badge: "NEW", active: false },
                ],
            },
            {
                section: "SETTINGS",
                items: [
                    { icon: "⚙️", label: "General", path: "/settings/general", badge: null, active: false },
                    { icon: "🌐", label: "Domain & SEO", path: "/settings/domain-seo", badge: null, active: false },
                    { icon: "🔌", label: "Integrations", path: "/settings/integrations", badge: null, active: false },
                    { icon: "💳", label: "Billing & Plan", path: "/settings/billing-plan", badge: null, active: false },
                ],
            },
        ];

        const isActive = (path) => route.path === path;

    return {
      isExpanded,
      isMobileOpen,
      isHovered,
      openSubmenu,
      menuGroups,
      isActive,
    };
  }
}
