import JSON5 from 'json5'
import { snippet, snippets } from 'utils/snippets'

for (const id of snippets) {
  test(id, () => {
    expect(
      (snippet(id as any) as any)(JSON5.stringify('${first}}'))
    ).toMatchSnapshot()
  })
}
