
import ThemeProvider from '/src/js/components/layout/ThemeProvider.js'
import SidebarProvider from '/src/js/components/layout/SidebarProvider.js'

export default {
  name: 'App',
  components: {
    ThemeProvider,
    SidebarProvider
  },
  template: `
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
  `,
  setup() {
    return {}
  }
}
