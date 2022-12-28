import Loading from './v-loading'

const DirectiveMap = {
  loading: Loading
}

const installDirectives = (app) => {
  Object.keys(DirectiveMap).forEach(key => {
    app.directive(key, DirectiveMap[key])
  })
}

export {
  installDirectives
}
