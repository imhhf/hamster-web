import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [VantResolver()],
        }),
    ],
    define: {
        '__APP_NAME__': JSON.stringify(process.env.npm_package_name),
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src',
                import.meta.url))
        }
    },
    css: {
        // 配置 CSS modules 的行为。选项将被传递给 postcss-modules
        modules: {},
        // 内联的 PostCSS 配置（格式同 postcss.config.js）
        postcss: {
            plugins: [
                postCssPxToRem({
                    rootValue: 37.5, // 1rem 的大小
                    propList: ['*'], // 需要转换的属性，*(全部转换)
                    unitPrecision: 6 // 转换精度，保留的小数位数
                })
            ]
        }
    }
})