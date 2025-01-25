import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { getMovieById } from '../../services/movies/MoviesManagement';
import { authToken, isSubscribed, loggedInId, role } from '../../services/GetCookieValues';
import axios from 'axios';

function WatchMovie() {
    const location = useLocation();
    const id = location.state?.id; 

    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) {
                console.error("No movie ID found in location state.");
                return;
            }
            // const config = {
            //     headers: {
            //       Authorization: `Bearer ${authToken}`,
            //     },
            //   };

            // isSubRes = await axios.get("http://localhost:3213/getSubscriptionForUser/"+loggedInId,config);
            // console.log(isSubRes)

            console.log("Fetching movie with ID:", id);
            try {
                const movieData = await getMovieById(id);
                setMovie(movieData.videoURL);
            } catch (error) {
                console.error("Error fetching movie:", error);
            }
        };

        fetchMovie();
        console.log(isSubscribed)
        console.log(role)
        let va = role === 'user' && isSubscribed || role === 'seller' || role === 'admin';
        console.log(va)
    }, [id]);

    return (
        <div>
        {(role === 'user' && isSubscribed) || role === 'seller' || role === 'admin' ? (
            movie ? (
                <video controls style={{ width: '100%' }}>
                    <source src={movie} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Loading video...</p>
            )
        ) : (
            <p>You need a subscription to watch this movie. Please subscribe to gain access.</p>
        )}
    </div>
    

    );
}

export default WatchMovie;
