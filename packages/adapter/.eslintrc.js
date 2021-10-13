module.exports = {
  extends: ['../../.eslintrc.fp.js', '../../.eslintrc.js'],
  overrides: [
    {
      env: {
        browser: false,
        jest: false,
        mocha: true,
        node: true,
      },
      files: ['test/**/*.ts'],
      rules: {
        'jest/consistent-test-it': 'off',
        'jest/expect-expect': 'off',
        'jest/lowercase-name': 'off',
        'jest/max-nested-describe': 'off',
        'jest/no-alias-methods': 'off',
        'jest/no-commented-out-tests': 'off',
        'jest/no-conditional-expect': 'off',
        'jest/no-deprecated-functions': 'off',
        'jest/no-disabled-tests': 'off',
        'jest/no-done-callback': 'off',
        'jest/no-duplicate-hooks': 'off',
        'jest/no-export': 'off',
        'jest/no-focused-tests': 'off',
        'jest/no-hooks': 'off',
        'jest/no-identical-title': 'off',
        'jest/no-if': 'off',
        'jest/no-interpolation-in-snapshots': 'off',
        'jest/no-jasmine-globals': 'off',
        'jest/no-jest-import': 'off',
        'jest/no-large-snapshots': 'off',
        'jest/no-mocks-import': 'off',
        'jest/no-restricted-matchers': 'off',
        'jest/no-standalone-expect': 'off',
        'jest/no-test-prefixes': 'off',
        'jest/no-test-return-statement': 'off',
        'jest/prefer-called-with': 'off',
        'jest/prefer-expect-assertions': 'off',
        'jest/prefer-hooks-on-top': 'off',
        'jest/prefer-spy-on': 'off',
        'jest/prefer-strict-equal': 'off',
        'jest/prefer-to-be-null': 'off',
        'jest/prefer-to-be-undefined': 'off',
        'jest/prefer-to-contain': 'off',
        'jest/prefer-to-have-length': 'off',
        'jest/prefer-todo': 'off',
        'jest/require-to-throw-message': 'off',
        'jest/require-top-level-describe': 'off',
        'jest/valid-describe': 'off',
        'jest/valid-expect': 'off',
        'jest/valid-expect-in-promise': 'off',
        'jest/valid-title': 'off',
      },
    },
  ],
};
