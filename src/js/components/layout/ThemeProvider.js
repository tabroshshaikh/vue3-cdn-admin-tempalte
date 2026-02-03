
const { ref, provide, onMounted, watch, computed, inject } = Vue;

export function useTheme() {
    const theme = inject('theme')
    if (!theme) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return theme
}

export default {
    name: 'ThemeProvider',
    template: '<slot></slot>',
    setup() {
        const theme = ref('light')
        const isInitialized = ref(false)

        const isDarkMode = computed(() => theme.value === 'dark')

        const toggleTheme = () => {
            theme.value = theme.value === 'light' ? 'dark' : 'light'
        }

        onMounted(() => {
            const savedTheme = localStorage.getItem('theme')
            const initialTheme = savedTheme || 'light' // Default to light theme

            theme.value = initialTheme
            isInitialized.value = true
        })

        watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
            if (newIsInitialized) {
                localStorage.setItem('theme', newTheme)
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            }
        })

        provide('theme', {
            isDarkMode,
            toggleTheme,
        })

        return {}
    }
}
