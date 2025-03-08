// eslint.config.js
// code taken from https://eslint.org/docs/latest/use/configure/configuration-files
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
]);
