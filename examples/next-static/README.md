# Next static import example

Shows how to make Next.js download and cache URL ESM imports, letting you import your custom themes with the ease of URLs but at the performance of local bundling.

It loads a pinker version of Pink Synth:
<img width="920" alt="image" src="https://user-images.githubusercontent.com/81981/180381906-c477532e-74f4-4178-9032-e752142911ee.png">

## Live example

https://themer-example-next-static.sanity.build

It only lets you see the login screen in the theme, to see the full studio:

1. Create a new project: https://www.sanity.io/get-started
2. Fork this repo/path.
3. Modify the `projectId` and `dataset` in `sanity.config.ts`.
4. `npm run dev` and open `http://localhost:3000`.
