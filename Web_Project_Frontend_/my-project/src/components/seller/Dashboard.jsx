import React, { useEffect, useState } from 'react';
import { getSellerDashboard } from '../../services/seller/SellerManagement';
import { useNavigate } from 'react-router-dom';

function SellerDashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalMovies : 0,
        approvedMovies : 0,
        notApprovedMovies: 0,
        totalViews: 0,
        totalEarning: 0,
        totalPaid: 0,
        movies: []
    });
    
    const nav = useNavigate();

    useEffect(() => {
        const getSellerDashboardForS = async () => {
            const rsp = await getSellerDashboard();
            setDashboardData(rsp);
        };

        getSellerDashboardForS();
    }, []);

    const watchMovie = async (movieId) => {
        nav('/watchMovie', { state: { id: movieId } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-900 to-black text-white py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Seller Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8 mb-8">
                <StatCard title="Total Movies" value={dashboardData.totalMovies} />
                <StatCard title="Approved Movies" value={dashboardData.approvedMovies} />
                <StatCard title="Not Approved Movies" value={dashboardData.notApprovedMovies} />
                <StatCard title="Total Views Across all Movies" value={dashboardData.totalViews} />
                <StatCard title="Total Earnings" value={`$${dashboardData.totalEarning}`} />
                <StatCard title="Total Paid" value={`$${dashboardData.totalPaid}`} />
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-8">
                {dashboardData.movies && dashboardData.movies.length > 0 ? (
                    dashboardData.movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} onWatch={watchMovie} />
                    ))
                ) : (
                    <p className="text-gray-400 text-center">No movies available.</p>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="p-4 bg-black shadow-md rounded-lg text-center">
            <h2 className="text-xl font-semibold text-violet-200">{title}</h2>
            <p className="text-3xl">{value}</p>
        </div>
    );
}

export function MovieCard({ movie, onWatch }) {
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
            onClick={() => onWatch(movie._id)}
            className="relative bg-black rounded-lg shadow-lg overflow-hidden min-h-[300px] max-h-[300px] transition duration-300 transform hover:scale-105 cursor-pointer"
            style={{
                backgroundImage: movie.photo ? `url(${movie.photo})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px',
                maxHeight: '300px',
            }}
        >   
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"></div>
            <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                <h2 className="text-lg font-bold text-white">{movie.title}</h2>
                <p className="text-sm text-gray-300">Views: {movie.views}</p>
                <p className="text-sm text-gray-300">Earnings: ${(movie.views / 10).toFixed(2)}</p>
            </div>
        </div>
    );
}

export default SellerDashboard;
