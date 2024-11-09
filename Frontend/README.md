# G8T1 frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
npm install axios
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


On droplet
rm -rf node_modules

npm install @rollup/rollup-linux-x64-gnu   (maybe)

rm package-lock.json
npm install



reinstall:
pm2 delete all
cd /root
rm -rf droplet-recipeapp
git clone https://github.com/bjorntin/droplet-recipeapp.git
