
import { useSidebarProvider } from '../../composables/useSidebar.js';

export default {
    name: 'SidebarProvider',
    template: '<slot></slot>',
    setup() {
        useSidebarProvider();
        return {};
    }
}
