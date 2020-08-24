const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}


// axios.get(INDEX_URL).then((response) => {
//   movies.push(...response.data.results)
//   renderMovieList(movies) //新增這裡
// })
//   .catch((err) => console.log(err))

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


// function addToFavorite(id) {
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//   const movie = movies.find((movie) => movie.id === id)
//   if (list.some((movie) => movie.id === id)) {
//     return alert('此電影已經在收藏清單中！')
//   }
//   list.push(movie)
//   localStorage.setItem('favoriteMovies', JSON.stringify(list))
// }

function removeFromFavorite(id) {
  if(!movies) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if(movieIndex === -1) return

  movies.splice(movieIndex,1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})



//監聽表單提交事件
// searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
//   event.preventDefault()
//   const keyword = searchInput.value.trim().toLowerCase()
//   let filteredMovies = []

//   // if (!keyword.length) {
//   //   return alert('Please enter a valid string')
//   // }
//   // filter 陣列操作
//   filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

//   if (filteredMovies.length === 0) {
//     return alert('Cannot find movie with keyword: ' + keyword)
//   }

//   // 迴圈填入陣列
//   // for (const movie of movies) {
//   //   if (movie.title.toLowerCase().includes(keyword)) {
//   //     filteredMovies.push(movie)
//   //   }
//   // }


//   renderMovieList(filteredMovies)
// })

//localStorage 用法
// localStorage.setItem('defult_language', 'english')
// localStorage.getItem('defult_language')
// localStorage.removeItem('defult_language')

renderMovieList(movies)
