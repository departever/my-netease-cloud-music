import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // 基础 JS 推荐规则
  js.configs.recommended,

  // Vue 基础规则
  ...pluginVue.configs['flat/essential'],

  // Prettier 配置（关闭格式相关规则）
  eslintConfigPrettier,

  // 全局配置
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // 自定义规则
  {
    rules: {
      // ===== 关闭的规则 =====
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/v-slot-style': 'off',
      'vue/no-template-shadow': 'off',
      'no-undef': 'off', // Electron 全局变量

      // ===== 警告的规则（不拦截）=====
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',

      // ===== 弃用 API 改成警告（不拦截）=====
      'vue/no-deprecated-slot-attribute': 'warn',
      'vue/no-deprecated-v-bind-sync': 'warn',
      'vue/no-deprecated-router-link-tag-prop': 'warn',
    },
  },

  // 忽略文件
  {
    ignores: ['dist/**', 'node_modules/**', 'release/**', '*.d.ts'],
  },
];

