/**
 * Copied from next-sanity 6.1.4, without its `favicons` option, since the app
 * links its own favicons:
 * https://github.com/sanity-io/next-sanity/blob/v6.1.4/src/studio/head/NextStudioHead.tsx
 *
 * MIT License
 *
 * Copyright (c) 2023 Sanity.io
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

interface NextStudioHeadProps {
  /**
   * @defaultValue 'utf-8'
   */
  charSet?: false | string
  /**
   * Sets the viewport to `viewport-fit=cover` to integrate with iOS devices with display cutouts (The Notch, Dynamic Island).
   * Also sets `width=device-width, initial-scale=1` to make the studio page responsive.
   * @defaultValue true
   */
  viewport?: boolean
  /**
   * It's common practice to hide the address to your Sanity Studio from search engines by setting `robots` to `noindex`
   * @defaultValue 'noindex'
   */
  robots?: false | string
  /**
   * @defaultValue 'same-origin'
   */
  referrer?: false | string
  /**
   * @defaultValue 'Sanity'
   */
  title?: false | string
}

export function NextStudioHead(props: NextStudioHeadProps) {
  const {
    charSet = 'utf-8',
    viewport = true,
    robots = 'noindex',
    referrer = 'same-origin',
    title = 'Sanity',
  } = props

  return (
    <>
      {charSet && <meta key="charset" charSet={charSet} />}
      {viewport && (
        <meta
          key="viewport"
          name="viewport"
          // Studio implements display cutouts CSS (The iPhone Notch ™ ) and needs `viewport-fit=covered` for it to work correctly
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
      )}
      {robots && <meta key="robots" name="robots" content={robots} />}
      {referrer && <meta key="referrer" name="referrer" content={referrer} />}
      {title && <title>{title}</title>}
    </>
  )
}
