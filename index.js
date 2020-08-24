const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const movies = []
const MOVIES_PER_PAGE = 12
let filteredMovies = []
let listMode = 1 //1 is 卡片模式, 2 is 清單模式
let nowpage = 1 //儲存data-page
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const iconPanel = document.querySelector('#icon-panel')


function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
      POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}



function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}


function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 0; page < numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">${page + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


function getMoviesByPage(page) {
  //計算起始 index 
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// New function 改成清單模式的HTML的function
function ListIconClicked(data) {
  let rawHTML = '<ul class="list-group col-12">'
  data.forEach((item) => {
    // title
    rawHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${item.title}<span class="badge">
    <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
    </span></li>`
  })
  rawHTML += '</ul>'
  dataPanel.innerHTML = rawHTML
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  //把data-page存入變數，以便外部功能乎叫
  nowpage = Number(event.target.dataset.page)
  if (listMod === 1) {
    renderMovieList(getMoviesByPage(nowpage))
  } else if (listMod === 2) {
    ListIconClicked(getMoviesByPage(nowpage))
  }

})

//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // if (!keyword.length) {
  //   return alert('Please enter a valid string')
  // }
  // filter 陣列操作
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    return alert('Cannot find movie with keyword: ' + keyword)
  }
  // 迴圈填入陣列
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }
  renderPaginator(filteredMovies.length)

  if (listMode === 1) {
    renderMovieList(getMoviesByPage(1))
  } else if (listMode === 2) {
    ListIconClicked(getMoviesByPage(1))
  }
})




paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  if (listMode === 1) {
    renderMovieList(getMoviesByPage(Number(event.target.dataset.page)))
  } else if (listMode === 2) {
    ListIconClicked(getMoviesByPage(Number(event.target.dataset.page)))
  }

})

// New Listener 切換卡片及清單模式
iconPanel.addEventListener('click', function onIconClicked(event) {
  event.preventDefault()
  if (event.target.matches('.fa-th')) {
    listMode = 1 //把模式鎖定在卡片模式
    renderMovieList(getMoviesByPage(nowpage))
  } else if (event.target.matches('.fa-bars')) {
    listMode = 2 //把模式鎖定在清單模式
    ListIconClicked(getMoviesByPage(nowpage))
  }
})

axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1)) //新增這裡
})
  .catch((err) => console.log(err))
