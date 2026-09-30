# Themer Storybook

Stories for [`@sanity/themer-legacy`](../../packages/themer-legacy): `theme/` previews the themes its
generator creates (`createTheme`, `buildThemeFromUrl` and the hosted presets), and `tool/` holds
the components of the `themerTool` Studio plugin. The tool's components aren't exported by the
package, so those stories import them from the package source (`packages/themer-legacy/src/tool`),
and `tool/Themer` renders the plugin's layout and navbar around a mock Studio.

## Storybook guidelines

- All stories must export either a named `Default` or `Basic` story.
- Avoid creating custom titles for stories - these should be inferred via folder structure alone.
- Where possible, stories should be kept as simple as possible with minimal custom / presentational props.
- Prefer setting component values via storybook [args](https://storybook.js.org/docs/react/writing-stories/args) instead of passing them manually in props.

## Things to note

- All stories are wrapped with a [common decorator](https://storybook.js.org/docs/react/writing-stories/decorators#story-decorators) which wraps stories in both a `<ThemeProvider>` but also a `<Card>` with padding. Stories that depend on exact viewport dimensions (e.g. stories with interaction tests that assert on responsive behavior) can opt out with the `padding: 0` parameter.
- Interaction tests are written as story `play` functions and run in a real browser with the [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) (`pnpm test:browser`). Take care when renaming stories or ids that `play` functions rely on.
- `@sanity/ui` is installed from npm, whose build doesn't import its own CSS: `.storybook/preview.tsx` imports `@sanity/ui/styles.css`, like Sanity Studio does.
- The `tool/Themer` stories start from an empty draft: they clear the draft the tool keeps in `localStorage` before rendering.
