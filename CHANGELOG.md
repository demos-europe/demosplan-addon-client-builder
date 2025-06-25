# Changelog

## UNRELEASED

## v0.0.11 - 04-06-2025
- 
- Add a new rule to config builder for custom "license" blocks ([#249](https://github.com/demos-europe/demosplan-js-addon/pull/249))
- Use DevDependencies instead of dependencies ([#247](https://github.com/demos-europe/demosplan-js-addon/pull/247))

## v0.0.10 - 21-03-2025

- Bump vue-loader to v16.8.3; add compatConfig to vue-loader  ([#246](https://github.com/demos-europe/demosplan-js-addon/pull/246))
- There have been a couple other of dependency updates:
  - autoprefixer from 10.4.19 to 10.4.20 (#205) 
  - postcss from 8.4.39 to 8.4.41 (#206) 
  - postcss from 8.4.38 to 8.4.39 (#191)
  - @babel/preset-env from 7.24.5 to 7.24.7 (#186)
  - @babel/core from 7.24.5 to 7.24.7 (#185)
  - css-loader from 7.1.1 to 7.1.2 (#180)
  - @babel/core from 7.24.4 to 7.24.5 (#175)
  - @babel/preset-env from 7.24.4 to 7.24.5 (#174)
  - mini-css-extract-plugin from 2.8.1 to 2.9.0 (#172)
  - sass-loader from 14.2.0 to 14.2.1 (#173)
  - sass from 1.74.1 to 1.75.0 (#170)
  - sass-loader from 14.1.1 to 14.2.0 (#169)
- adapt README to new module name (#171)

## v0.0.9 - 12-03-2024

> [!IMPORTANT]
> THIS PACKAGE HAS BEEN RENAMED TO `@demos-europe/demosplan-addon-client-builder`

This is a re-issue of the v0.0.8 release of
`@demos-europe/demosplan-addon`.

## v0.0.8 - 12-03-2024

**Changed**

- Bump webpack from 5.89 to 5.90, @babel/* from 7.23 to 7.24, bump all deps to their latest versions ([#139](https://github.com/demos-europe/demosplan-js-addon/pull/139))
- Set node >= 18.12.0 as required engine  

## v0.0.7 - 21-09-2023

**Fixed**

- Ordering of scss token paths in demosplan-ui matters ([#87](https://github.com/demos-europe/demosplan-js-addon/pull/87))

## v0.0.6 - 21-09-2023

**Fixed**

- Adapt paths to scss tokens in demosplan-ui ([#86](https://github.com/demos-europe/demosplan-js-addon/pull/86))

## v0.0.5 - 19-05-2023

**Fixed**

- improve Support for SCSS in Vue

## v0.0.4 - 23-03-2023

- SCSS scoped style support

## v0.0.3 - 07-02-2023

- Transform entry points to enable a simple usage in the webpack config to create a browser digestible output 

## v0.0.2 - 16-12-2022

- Replaced `webpack-manifest-plugin` with `webpack-assets-manifest`
  to simplify access to frontend assets.

## v0.0.1 - 12-12-2022

- Initial release
