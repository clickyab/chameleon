# Chameleon `Console Web Pannel`

![alt text](./chameleon.png "Chameleon Console")

### Chameleon Project with React, Redux & TypeScript

New `Console Web Pannel` for [Clickyab](http://clickyab.com) corporate. 

Note that this project use `tslint` with default config and all contributors must keep this standard.


## project structure

    .
    ├── dist                                 # Compiled files (index.html & assets)
    ├── src                                  # Source files (alternatively `lib` or `app`)
    │   ├── components                       # Global Components           
    │   │   ├── Avatar                       # Avatar component
    │   │   │   ├── style                    # component styles
    │   │   │   └── index.tsx                # source of `dashboard` component 
    │   │   .         
    │   │   .         
    │   │   └── index.tsx                    # export components          
    │   ├── constants                        # Global application constants                     
    │   ├── containers                       # Main containers (react components that has route)
    │   │   ├── Private                      # Private routes components
    │   │   │    ├── Dashboard               # Dashboard component
    │   │   │    │   ├── style               # component styles
    │   │   │    │   └── index.tsx           # source of `dashboard` component 
    │   │   │    .         
    │   │   │    .         
    │   │   │    └── index.tsx               # export private components
    │   │   ├── Public                       # Public routes components
    │   │   │    ├── Sigin-in                # Sign in component
    │   │   │    │   ├── style               # component styles
    │   │   │    │   └── index.tsx           # source of `sign in` component 
    │   │   │    .         
    │   │   │    .         
    │   │   │    └── index.tsx               # export private components
    │   │   └── index.tsx                    # Source files (alternatively `lib` or `app`)                
    │   └── README.md                        # Source files (alternatively `lib` or `app`)
    ├── types                                # Global types (typescript types)
    ├── tsconfig.json
    ├── webpack.config.js
    └── README.md
 

## Contains

- [x] [Typescript](https://www.typescriptlang.org/) 2.4
- [x] [React](https://facebook.github.io/react/) 15.6
- [x] [Redux](https://github.com/reactjs/redux) 3.7
- [x] [React Router](https://github.com/ReactTraining/react-router) 4.1
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [x] [TodoMVC example](http://todomvc.com)

### Build tools

- [x] [Webpack](https://webpack.github.io) 3
  - [x] [Tree Shaking](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
  - [x] [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- [x] [Awesome Typescript Loader](https://github.com/s-panferov/awesome-typescript-loader)
- [x] [PostCSS Loader](https://github.com/postcss/postcss-loader)
  - [x] [CSS next](https://github.com/MoOx/postcss-cssnext)
  - [x] [CSS modules](https://github.com/css-modules/css-modules)
- [x] [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [x] [ExtractText Plugin](https://github.com/webpack/extract-text-webpack-plugin)
- [x] [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin)


## Setup

```
$ npm install
```

## Running

```
$ npm start
```

## Build

```
$ npm run build
```
