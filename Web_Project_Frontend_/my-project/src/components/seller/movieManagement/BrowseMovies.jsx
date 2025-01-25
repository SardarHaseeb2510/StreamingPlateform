import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMoviesForSeller } from '../../../services/movies/MoviesManagement';

function BrowseMovies() {
    const [movies, setMovies] = useState([]);
    const nav = useNavigate();
  
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const fetchedMovies = await getAllMoviesForSeller();
                setMovies(fetchedMovies);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
  
        fetchMovies();
    }, []);
  
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-900 to-black flex flex-col items-center py-8">
            <h1 className="text-4xl font-bold text-violet-200 mb-8">Browse Movies</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 w-full max-w-7xl">
                {movies.map((movie) => (
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>
        </div>
    );
}

function MovieCard({ movie }) {
    const nav = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
  
    const watchMovie = (id) => {
        nav('/watchMovie', { state: { id: id } });
    }
  
    useEffect(() => {
        if (movie.movieCoverPhoto && movie.movieCoverPhoto.data) {
            const blob = new Blob([new Uint8Array(movie.movieCoverPhoto.data)], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [movie.movieCoverPhoto]);
  
    return (
        <div 
            onClick={() => watchMovie(movie._id)}
            className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden min-h-[300px] max-h-[400px] transition duration-300 ease-in-out transform hover:scale-105"
            style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px',
                maxHeight: '300px',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                <h2 className="text-lg font-bold text-white">{movie.title}</h2>
                <p className="text-sm text-gray-300">{movie.releaseDate}</p>
            </div>
        </div>
    );
}

export default BrowseMovies;
