# demosplan-addon js tooling

> Base dependency for frontend configuration in demosplan-core addons.

`yarn add -D @demos-europe/demosplan-addon-client-builder`

This repo contains the webpack configuration builder for demosplan-core addons.
It can and should be used when creating addons for demosplan-core that contain
a web user interface.

After installation, only the addon's name and entry points have to be defined
in `config.webpack.js`:

```js
const DemosplanAddon = require('@demos-europe/demosplan-addon-client-builder')
  
module.exports = DemosplanAddon.build(
    'my-addon-name', 
    { 
        'MyAddon': DemosplanAddon.resolve('src/index.js') 
    }
)
```

## Zero-config builds from `demosplan-addon.yml`

Addons that follow the standard hook-component layout don't need a webpack
config at all. Entry points are derived from the `ui.hooks` section of
`demosplan-addon.yml`:

```yaml
demosplan_addon:
  ui:
    hooks:
      import.tabs:
        entry: EmailImport
      administration.edit.extra.fields:
        entry: AllowedSenderEmailList
```

Each hook key is expected to have a matching PascalCase directory under
`client/hooks/`, so the above resolves to
`client/hooks/ImportTabs/EmailImport.vue` and
`client/hooks/AdministrationEditExtraFields/AllowedSenderEmailList.vue`.
A hook's `entry` may list several component names separated by commas.

Point webpack straight at this package's own config file, run from the
addon's directory:

```
webpack --config node_modules/@demos-europe/demosplan-addon-client-builder/webpack.config.js
```

This also folds in the `@vue/compat` alias resolution that addons previously
had to duplicate in their own webpack config.

## Testing

`yarn test` runs a real webpack build against the fixture addon in `test/fixtures/addon`
(a Vue SFC with a scoped SCSS block and a `<license>` custom block) and asserts that the
resulting ESM bundle and `assets-manifest.json` look as expected. This is a regression
check for the config builder itself, not a substitute for testing addons that consume it.
