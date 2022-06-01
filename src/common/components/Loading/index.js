export default {
  show: function () {
    let imgSrc = new URL('./imgs/loading.png', import.meta.url)
    let loadingHtml = `<div class="loading-img-box"><img class='loading-img' src=${imgSrc}></img></div>`
    let divTemp = document.createElement('div')
    divTemp.setAttribute('id', 'ele-loading-box')
    divTemp.innerHTML = loadingHtml
    document.body.appendChild(divTemp)
  },
  hide: function () {
    let loading = document.getElementById('ele-loading-box')
    document.body.removeChild(loading)
  }
}
