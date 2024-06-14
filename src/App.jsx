import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [animes, setAnimes] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchAnimes();
  }, []);

  async function fetchAnimes() {
    try {
      const response = await fetch('https://api.jikan.moe/v4/anime');
      const data = await response.json();
      setAnimes(data.data || []);
      setSelectedAnime(data.data ? data.data[0] : null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function searchAnimes(query) {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&order_by=title&sort=asc`);
      const data = await response.json();
      setAnimes(data.data || []);
      setSelectedAnime(data.data ? data.data[0] : null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleSelectedAnime(id) {
    const newAnime = animes.find((anime) => anime.mal_id === id);
    setSelectedAnime(newAnime);
  }

  function handleSearchChange(event) {
    setQuery(event.target.value);
    searchAnimes(event.target.value);
  }

  return (
    <>
      <Header>
        <Search query={query} onSearchChange={handleSearchChange}>
          <NumResult animes={animes} />
        </Search>
      </Header>
      <Main>
        <Box>
          <AnimeList animes={animes} onSelectedAnime={handleSelectedAnime} />
        </Box>
        <Box>
          <AnimeDetail selectedAnime={selectedAnime} />
        </Box>
      </Main>
    </>
  );
}

function Header({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="logo">🍥</span>
      <h1>WeeBoo</h1>
      <span role="img" aria-label="logo">🍥</span>
    </div>
  );
}

function Search({ query, onSearchChange, children }) {
  return (
    <div className="search-container">
      <input className="search" type="text" placeholder="Search anime..." value={query} onChange={onSearchChange} />
      {children}
    </div>
  );
}

function NumResult({ animes }) {
  return (
    <p className="search-results">
      Found <strong>{animes.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function AnimeList({ animes, onSelectedAnime }) {
  return (
    <ul className="list list-anime">
      {animes?.map((anime) => (
        <Anime key={anime.mal_id} anime={anime} onSelectedAnime={onSelectedAnime} />
      ))}
    </ul>
  );
}

function Anime({ anime, onSelectedAnime }) {
  return (
    <li onClick={() => onSelectedAnime(anime.mal_id)}>
      <img src={anime.images.jpg.image_url} alt={`${anime.title} cover`} />
      <h3>{anime.title}</h3>
      <div>
        <p>
          <span>{anime.aired?.prop?.from?.year}</span>
        </p>
      </div>
    </li>
  );
}

function AnimeDetail({ selectedAnime }) {
  return (
    <div className="details">
      <header>
        <img src={selectedAnime?.images.jpg.image_url} alt={`${selectedAnime?.title} cover`} />
        <div className="details-overview">
          <h2>{selectedAnime?.title}</h2>
          <p>
            {selectedAnime?.aired?.prop?.from?.year} &bull; {selectedAnime?.score}
          </p>
        </div>
      </header>
      <section>
        <p>
          <em>{selectedAnime?.synopsis}</em>
        </p>
      </section>
    </div>
  );
}
