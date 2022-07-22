# Advanced example

Shows how to use `createTheme` and using `_document.tsx` to add a `<link rel="modulepreload">` to speed up the load times for the custom theme.

It loads a custom theme:
<img width="920" alt="Screenshot 2022-07-22 at 14 05 01" src="https://user-images.githubusercontent.com/81981/180437361-07e238d7-3e9a-41ac-8677-85f0ed8170d6.png">

## Live example

https://themer-example-advanced.sanity.build

It only lets you see the login screen in the theme, to see the full studio:

1. Create a new project: https://www.sanity.io/get-started
2. Fork this repo/path.
3. Modify the `projectId` and `dataset` in `sanity.config.ts`.
4. `npm start` and open `http://localhost:3333`.
