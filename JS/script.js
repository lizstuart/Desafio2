let movies = [];
let movie = [];
let seeInfoMovie = [];
let seeVideo = [];
let seeModal = [];

const movies_list = document.querySelector('.movies');
const playMovieOfTheDay = document.querySelector('.highlight__video')
const imageMoviePlay = document.querySelector('.movie-play');
const infoMovie = document.querySelector('.highlight__info');
const titleMovie = document.querySelector('.highlight__title');
const ratingMovie = document.querySelector('.highlight__rating');
const genresOfMovie = document.querySelector('.highlight__genres');
const launchOfMovie = document.querySelector('.highlight__launch');
const descriptionMovie = document.querySelector('.highlight__description');
const playTrailer = document.querySelector('.highlight__video-link')
const btnPlayVideo = document.querySelector('.btn-play')

const openModal = document.querySelector('.hidden');
const btnCloseModal = document.querySelector('.modal__close');
const closeModal = document.querySelector('.modal');

const modalTitle = document.querySelector('.modal__title');
const modalImage = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenreAverage = document.querySelector('.modal__genre-average')
const modalAverage = document.querySelector('.modal__average')
const modalBody = document.querySelector('.modal__body')
const modalGenres = document.querySelector('.modal__genres')

const buttonTheme = document.querySelector('.btn-theme');
const root = document.querySelector(':root');

const searchInput = document.querySelector('input');

const leftArrow = document.querySelector('.btn-prev');
const rightArrow = document.querySelector('.btn-next');
let moviesPage = 1;
let countPage = 0;

let allMovies = [];

const createMovies = (films) => {

    for (let item = 0; item < 6; item++) {

        const film = films[item];
        const id = film.id;

        const movie = document.createElement('div');
        movie.classList.add('movie');
        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');
        const movieTitle = document.createElement('span');
        movieTitle.classList.add('movie__title');
        const movieRating = document.createElement('span');
        movieRating.classList.add('movie__rating');
        const movieImage = document.createElement('img');

        movieTitle.textContent = film.title;
        movieRating.textContent = film.vote_average;
        movie.style.backgroundImage = `url(${film.poster_path})`
        movieImage.src = './assets/estrela.svg';
        movieImage.alt = 'Estrela';

        movies_list.appendChild(movie);
        movie.appendChild(movieInfo);
        movieInfo.append(movieTitle, movieRating);
        movieRating.appendChild(movieImage);

        movie.addEventListener('click', (event) => {
            event.stopPropagation();

            openModal.classList.remove('hidden')

            seeInfoOfMovie(id)
        })

    }

}

const darkMode = () => {
    root.style.setProperty('--background', '#000000');
    root.style.setProperty('--input-color', '#3E434D');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--bg-secondary', '#2D3440');

    leftArrow.src = './assets/arrow-left-light.svg';
    rightArrow.src = './assets/arrow-right-light.svg';

    buttonTheme.src = './assets/dark-mode.svg';
    btnCloseModal.src = './assets/close.svg';
}

const lightMode = () => {
    root.style.setProperty('--background', '#fff');
    root.style.setProperty('--input-color', '#979797');
    root.style.setProperty('--text-color', '#1b2028');
    root.style.setProperty('--bg-secondary', '#ededed');

    leftArrow.src = './assets/arrow-left-dark.svg';
    rightArrow.src = './assets/arrow-right-dark.svg';

    buttonTheme.src = './assets/light-mode.svg';
}


async function getMovies() {
    try {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false', {});

        movies = response.data.results;

        let pag1 = [];
        let pag2 = [];
        let pag3 = [];

        for (const film of movies) {

            if (pag1.length < 6) {
                pag1.push(film);
            }
            else if (pag2.length < 6) {
                pag2.push(film);
            }
            else if (pag3.length < 6) {
                pag3.push(film);
            }
        }

        allMovies.push(pag1);
        allMovies.push(pag2);
        allMovies.push(pag3);

        createMovies(allMovies[countPage]);

    } catch (error) {
    }

}

getMovies();

async function movieOfTheDay() {
    try {
        const response = await api.get('movie/436969?language=pt-BR', {});

        movie = response.data;

        playMovieOfTheDay.style.backgroundImage = `url(${movie.backdrop_path})`;
        playMovieOfTheDay.style.backgroundSize = 'cover';


        titleMovie.textContent = movie.title;
        ratingMovie.textContent = movie.vote_average.toFixed(1);
        launchOfMovie.textContent = new Date(movie.release_date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });

        const trailer = await api.get('movie/436969/videos?language=pt-BR', {});
        seeVideo = trailer.data.results[1];

        playTrailer.href = `https://www.youtube.com/watch?v=${seeVideo.key}`;

        descriptionMovie.textContent = movie.overview;

        genresOfMovie.textContent = movie.genres.map((genres) => genres.name).join(', ');

    } catch (error) {
        console.log(error);
    }
}

movieOfTheDay();

async function seeInfoOfMovie(id) {
    try {
        const response = await api.get(`/movie/${id}?language=pt-BR`);

        movie = response.data;

        modalTitle.textContent = movie.title;
        modalImage.style.backgroundImage = `url(${movie.backdrop_path})`;
        modalImage.style.backgroundSize = 'cover';
        modalImage.alt = 'modal__image';
        modalDescription.textContent = movie.overview;
        modalAverage.textContent = movie.vote_average.toFixed(1);

        const genresModal = response.data.genres;

        genresModal.forEach(genre => {
            const genre_1 = document.createElement('span');
            genre_1.classList.add('modal__genre');
            genre_1.textContent = genre.name;
            modalGenres.appendChild(genre_1);
        });

    } catch (error) {
        console.log(error);
    }

    modalBody.addEventListener('click', (event) => {
        event.stopPropagation();

        closeModal.classList.add('hidden');
        modalGenres.innerHTML = '';
    })
}

async function searchMovie(input) {
    try {
        const response = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${input}`);
        movies = response.data.results;

        movies_list.innerHTML = "";

        createMovies(movies);

    } catch (error) {
        console.log(error);
    }

}

searchInput.addEventListener('keyup', (event) => {
    event.stopPropagation();

    if (!searchInput.value && event.key === 'Enter') {
        movies_list.innerHTML = "";
        return getMovies();
    }

    if (event.key === 'Enter') {

        searchMovie(searchInput.value);
        searchInput.value = "";
    }
})

leftArrow.addEventListener('click', () => {
    movies_list.innerHTML = '';
    if (countPage === 0) {
        countPage = 2;
    } else {
        countPage--;
    }
    createMovies(allMovies[countPage]);

})

rightArrow.addEventListener('click', () => {
    movies_list.innerHTML = '';
    if (countPage === 2) {
        countPage = 0;
    } else {
        countPage++;
    }
    createMovies(allMovies[countPage]);
})

buttonTheme.addEventListener('click', () => {
    if (localStorage.theme === 'dark') {
        darkMode();
        localStorage.setItem('theme', 'light');

    } else if (!localStorage || localStorage.theme === 'light') {
        lightMode();
        localStorage.setItem('theme', 'dark');

    }
})

