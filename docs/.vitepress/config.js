const path = require('path')

module.exports = {
  title: 'Vue Contextual Transition',
  description: 'Opinionated simple transitions between common elements across different viws.',
  base: '/vue-contextual-transition',
  themeConfig: {
    repo: 'https://github.com/beepy/vue-contextual-transition',
    sidebar: [
      {
        text: 'Introduction',
        link: '/',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Limitations & Tips', link: '/guide/tips' },
          { text: 'Advanced', link: '/guide/advanced' },
        ],
      }, {
        text: 'Reference',
        link: '/reference/',
        items: [
          { text: 'ContextualTransition Component', link: '/reference/contextual-transition-component' },
          { text: 'Directives', link: '/reference/directives' },
          { text: 'CSS', link: '/reference/css' },
          { text: 'useContextualTransition Function', link: '/reference/use-contextual-transition' }
        ],
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/beepy/vue-contextual-transition' },
    ]
  },
  vite: {
    resolve: {
      alias: {
        'vue-contextual-transition': path.resolve(__dirname, '../../src/index.ts'),
        // 'my-lib': path.resolve(__dirname, '../../src'),

      },
      dedupe: [
        'vue',
        // /primevue\/.+/
      ], // avoid error when using dependencies that also use Vue
    }
  }
}
