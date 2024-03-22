import type { Config } from 'tailwindcss'
import { isolateOutsideOfContainer, scopedPreflightStyles } from 'tailwindcss-scoped-preflight'

export default <Partial<Config>> {
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateOutsideOfContainer('[data-tailwind=false]'),
    }),
  ],
}
