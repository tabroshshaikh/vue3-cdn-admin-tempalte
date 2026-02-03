
import AdminLayout from '../../components/layout/AdminLayout.js'
import PageBreadcrumb from '../../components/common/PageBreadcrumb.js'
const { ref } = Vue;

export default {
    name: 'BlankPage',
    components: {
        AdminLayout,
        PageBreadcrumb
    },
    template: `
    <AdminLayout>
        <PageBreadcrumb :pageTitle="pageTitle" />
        <div class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <h3 class="font-bold text-gray-800 text-theme-xl dark:text-white/90">
                Coming Soon
            </h3>
            <p class="mt-4 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                This page has not been converted yet.
            </p>
        </div>
    </AdminLayout>
    `,
    setup() {
        const pageTitle = ref('Coming Soon')
        return { pageTitle }
    }
}
