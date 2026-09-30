/**
 * Copied from next-sanity 6.1.4:
 * https://github.com/sanity-io/next-sanity/blob/v6.1.4/src/studio/NextStudioNoScript.tsx
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

const style = {
  __html: `
.sanity-app-no-js__root {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  z-index: 1;
}

.sanity-app-no-js__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: helvetica, arial, sans-serif;
}
`,
} as const

export const NextStudioNoScript = () => (
  <noscript>
    <div className="sanity-app-no-js__root">
      <div className="sanity-app-no-js__content">
        <style type="text/css" dangerouslySetInnerHTML={style} />
        <h1>JavaScript disabled</h1>
        <p>
          Please <a href="https://www.enable-javascript.com/">enable JavaScript</a> in your browser
          and reload the page to proceed.
        </p>
      </div>
    </div>
  </noscript>
)
