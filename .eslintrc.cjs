module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    ignorePatterns: ['dist', 'build', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-refresh', 'prettier'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react/jsx-sort-props': [
            'error',
            {
                callbacksLast: true,
                multiline: 'last',
                shorthandFirst: true,
            },
        ],
    },
};
