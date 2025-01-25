import React, { useState } from "react";
import { getSimilarGenreMovies, searchMovieByTitle } from '../../services/movies/MoviesManagement';
import { loggedInId } from '../../services/GetCookieValues';
import { addToWatchHistory } from '../../services/watchHistory/WatchHistory';
import { useNavigate } from 'react-router-dom';

function SearchMovie() {
    const [searchValue, setSearchValue] = useState('');
    const [foundMovies, setFoundMovies] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
   
    const nav = useNavigate();

    const handleSearch = async () => {
        const response = await searchMovieByTitle(searchValue);
        setFoundMovies(response);
        if (response.length > 0) {
            const rsp = await getSimilarGenreMovies(response[0]._id);
            setSimilarMovies(rsp);
        }
    };

    const watchMovie = async (movieId) => {
        const userId = loggedInId; 
        await addToWatchHistory(userId, movieId);
        nav('/watchMovie', { state: { id: movieId } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-violet-900 flex flex-col items-center py-8 px-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 text-center">
                Search for Movies
            </h1>
            <div className="w-full max-w-md mb-6">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    className="border border-violet-600 rounded-lg p-4 w-full bg-violet-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 ease-in-out"
                    placeholder="Enter movie title..."
                />
            </div>
            <button
                onClick={handleSearch}
                className="bg-violet-700 text-white py-3 px-6 rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 ease-in-out"
            >
                Search
            </button>

            <div className="mt-12 w-full max-w-4xl">
                {foundMovies.length > 0 ? (
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-violet-200 mb-6 border-b-2 border-violet-700 pb-2">
                            Found Movie(s):
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {foundMovies.map((movie) => (
                                <MovieCard key={movie._id} movie={movie} onWatch={watchMovie} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-400 text-lg mt-6 text-center">
                        No movies found
                    </div>
                )}
            </div>

            <div className="mt-12 w-full max-w-4xl">
                {similarMovies.length > 0 ? (
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-violet-200 mb-6 border-b-2 border-violet-700 pb-2">
                            Similar Genre Movies:
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {similarMovies.map((movie) => (
                                <MovieCard key={movie._id} movie={movie} onWatch={watchMovie} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-400 text-lg mt-6 text-center">
                        No similar movies found
                    </div>
                )}
            </div>
        </div>
    );
}

function MovieCard({ movie, onWatch }) {
    const [imageUrl, setImageUrl] = useState(null);

    React.useEffect(() => {
        if (movie.movieCoverPhoto && movie.movieCoverPhoto.data) {
            const blob = new Blob([new Uint8Array(movie.movieCoverPhoto.data)], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [movie.movieCoverPhoto]);

    return (
        <div
            onClick={() => onWatch(movie._id)}
            className="relative bg-black rounded-lg shadow-lg overflow-hidden min-h-[250px] sm:min-h-[300px] max-h-[300px] transition duration-300 transform hover:scale-105 cursor-pointer"
            style={{
                backgroundImage: movie.photo ? `url(${movie.photo})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '250px',
                maxHeight: '300px',
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"></div>
            <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                <h3 className="text-lg sm:text-xl font-bold text-violet-200">
                    {movie.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                    Views: {movie.views}
                </p>
                <p className="text-sm sm:text-base text-gray-300">
                    Earnings: ${(movie.views / 10).toFixed(2)}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {movie.releaseDate}
                </p>
            </div>
        </div>
    );
}

export default SearchMovie;
