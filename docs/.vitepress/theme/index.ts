import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import EffectDemo from './EffectDemo.vue';
import './custom.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('EffectDemo', EffectDemo);
    }
} satisfies Theme;
