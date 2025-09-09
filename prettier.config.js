/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  useTabs: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  
  // Plugin configurations
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  
  // Tailwind CSS class sorting
  tailwindConfig: './apps/frontend/tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'classNames'],
  
  // File-specific overrides
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
      },
    },
  ],
}