import type { Config } from 'tailwindcss'
import { scopedPreflightStyles } from 'tailwindcss-scoped-preflight'

export default <Partial<Config>> {
  plugins: [
    scopedPreflightStyles({
      cssSelector: '[data-tailwind=false]',
      mode: 'except matched',
    }),
  ],
}
