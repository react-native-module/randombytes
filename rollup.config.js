import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from '@rollup/plugin-typescript';

const inputSrc = [
  ["./src/index.ts", "es"],
  ["./src/index.ts", "cjs"],
]

const extensions = [".mjs", ".json", ".ts", ".native.ts", ".native.js"]

export default inputSrc
  .map(([input, format]) => {
    return {
      input,
      output: {
        dir: `lib/${format}`,
        format,
        exports: "auto"
      },
      preserveModules: true,
      external: [
        '@react-native-module/get-random-values',
        '@react-native-module/utility',
        'buffer',
      ],
      plugins: [
        typescript(),
        nodeResolve({
          preferBuiltins: false
        }),
        // CommonJS 로 작성된 모듈들을 ES6 바꾸어서 rollup이 해석할 수 있게 도와줍니다.
        commonjs({
          extensions: [...extensions, ".js"]
        }),
      ]
    }
  })
