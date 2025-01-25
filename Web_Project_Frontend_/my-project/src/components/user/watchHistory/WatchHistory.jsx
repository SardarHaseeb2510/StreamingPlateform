import React, { useEffect, useState } from 'react';
import { loggedInId } from '../../../services/GetCookieValues';
import { deleteFromWatchHistory, getWatchHistory } from '../../../services/watchHistory/WatchHistory';

function WatchHistory() {
    const userId = loggedInId;
    const [watchHistory, setWatchHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            try {
                const data = await getWatchHistory(userId, currentPage);
                setWatchHistory(data.watchHistory.movies); // Assuming movies are populated
                setTotalPages(data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching watch history:", error);
            }
        };

        fetchWatchHistory();
    }, [userId, currentPage]);

    const handleDelete = async (movieId) => {
        try {
            await deleteFromWatchHistory(userId, movieId);
            setWatchHistory((prev) => prev.filter((movie) => movie._id !== movieId)); // Update state
        } catch (error) {
            console.error("Error deleting movie from watch history:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const MovieGrid = ({ movies }) => {
        return movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} onDelete={handleDelete} />
                ))}
            </div>
        ) : (
            <p className="text-gray-400 text-center">No movies available</p>
        );
    };

    const MovieCard = ({ movie, onDelete }) => {
        const [imageUrl, setImageUrl] = useState(null);

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
                className="relative bg-black rounded-lg shadow-lg overflow-hidden min-h-[200px] md:min-h-[300px] max-h-[300px] transition duration-300 transform hover:scale-105 cursor-pointer"
                style={{
                    backgroundImage: movie.photo ? `url(${movie.photo})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"></div>
                <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                    <h3 className="text-lg md:text-xl font-bold text-white">{movie.title}</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            onDelete(movie._id);
                        }}
                        className="mt-2 md:mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-violet-900 text-white py-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">Watch History</h1>
            <MovieGrid movies={watchHistory} />
            <div className="flex justify-center mt-4 md:mt-8 space-x-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-2 md:px-4 md:py-2 rounded-lg ${
                            currentPage === index + 1
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default WatchHistory;
