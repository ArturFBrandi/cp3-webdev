export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'setup',
        'harness',
        'layout',
        'theme',
        'i18n',
        'routing',
        'github',
        'contact',
        'auth',
        'dashboard',
        'perf',
        'deps',
        'docs',
        'ci',
      ],
    ],
  },
}
