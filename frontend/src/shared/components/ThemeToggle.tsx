import { useTheme } from '../useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" className="button button-ghost" onClick={toggleTheme}>
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </button>
  )
}
