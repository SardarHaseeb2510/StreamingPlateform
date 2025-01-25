import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../services/admin/AdminDashboard';
import { Pie } from 'react-chartjs-2';
import { addToWatchHistory } from '../../services/watchHistory/WatchHistory';
import { loggedInId } from '../../services/GetCookieValues';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const rsp = await getAdminDashboard();
        setDashboardData(rsp);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const pieData = {
    labels: ['Approved Movies', 'Not Approved Movies'],
    datasets: [
      {
        label: '# of Movies',
        data: [dashboardData.approvedMovies, dashboardData.notApprovedMovies],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const watchMovie = async (movieId) => {
    const userId = loggedInId;
    await addToWatchHistory(userId, movieId);
    nav('/watchMovie', { state: { id: movieId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-black text-white py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-8 mb-8">
        <StatCard title="Total Users" value={dashboardData.totalUsers} />
        <StatCard title="Total Sellers" value={dashboardData.totalSellers} />
        <StatCard title="Total Movies" value={dashboardData.totalMovies} />
      </div>

      {/* Pie Chart */}
      {/* Uncomment if you want to display the pie chart */}
      {/* <div className="bg-white shadow-md rounded-lg p-8 mx-8 mb-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Approved vs Not Approved Movies</h2>
        <Pie data={pieData} />
      </div> */}

      {/* Top 5 Popular Movies */}
      <div className="mx-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Top 5 Popular Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardData.popularMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} onWatch={watchMovie} />
          ))}
        </div>
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
      className="relative bg-black rounded-lg shadow-lg overflow-hidden min-h-[300px] max-h-[300px] transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      style={{
        backgroundImage: movie.photo ? `url(${movie.photo})` : 'none',
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

export default AdminDashboard;
