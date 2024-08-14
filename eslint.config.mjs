import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...eslintPluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    ignores: ['node_modules/', '.git/', '**/dist/*', '**/build/*'],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      }
    },
  },
  {
    files: ['**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
)