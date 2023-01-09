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
  entryPoints: ["src/client.tsx", "src/demo.tsx"],
  bundle: true,
  outdir: "public/",
  mainFields: ["module", "browser", "main"],
  plugins: [
    {
      name: "woff2",
      setup(build) {
        build.onResolve({filter: /fonts\/.*woff2$/}, ({path}) => {
          return {path, external: true, namespace: "provided"};
        });
      }
    },
    sassPlugin(),
  ],
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
