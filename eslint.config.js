import antfu from '@antfu/eslint-config'

// https://eslint.vuejs.org/rules/
export default await antfu({
  rules: {
    'node/prefer-global/process': 'off',
    'vue/html-self-closing': ['warn', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always',
      },
    }],
  },
})
