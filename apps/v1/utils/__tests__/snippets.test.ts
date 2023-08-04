import JSON5 from 'json5'
import { snippet, snippets } from 'utils/snippets'

// @TODO generate tests with inline snapshots instead, to workaround CI failing
describe.skip('snippets', () => {
  for (const id of snippets) {
    test(id, () => {
      expect(
        JSON.stringify(
          (snippet(id as any) as any)(JSON5.stringify('${first}}')),
        ),
      ).toMatchSnapshot(id)
    })
  }
})
