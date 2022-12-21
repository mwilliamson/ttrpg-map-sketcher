const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const util = require("util");

const args = util.parseArgs({
  options: {
    watch: {
      type: "boolean",
    }
  },
  strict: true,
});

esbuild.build({
  entryPoints: ["src/client.tsx"],
  bundle: true,
  outfile: "public/bundle.js",
  mainFields: ["module", "browser", "main"],
  plugins: [sassPlugin()],
  watch: args.values.watch ? {
    onRebuild(error) {
      if (error) {
        console.error("watch build failed");
      } else {
        console.log("watch build succeeded");
      }
    }
  } : null,
}).catch(() => process.exit(1))
