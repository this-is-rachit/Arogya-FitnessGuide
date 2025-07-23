"use client"
import React from 'react'
import './workoutPage.css'
import { useSearchParams } from 'next/navigation'

const Page = () => {
    const [workout, setWorkout] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const searchParams = useSearchParams();
    const workoutid = searchParams.get('id');

    const getWorkoutData = async () => {
        if (!workoutid) {
            setError("Workout ID is missing from the URL.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts/${workoutid}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch workout: ${response.status}`);
            }

            const data = await response.json();
            if (data.ok) {
                setWorkout(data.data);
            } else {
                setError(data.message || "Failed to load workout data.");
                setWorkout(null);
            }
        } catch (err: any) {
            setError(err.message || "Network error while fetching workout.");
            setWorkout(null);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getWorkoutData();
    }, [workoutid]);

    if (isLoading) {
        return (
            <div className='workout-page-message'>
                <p>Loading workout details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='workout-page-message'>
                <p style={{ color: 'red' }}>Error: {error}</p>
            </div>
        );
    }

    if (!workout) {
        return (
            <div className='workout-page-message'>
                <p>No workout found or data is unavailable.</p>
            </div>
        );
    }

    return (
        <div className='workout-page-container'>
            <h1 className='mainhead1'> {workout?.name}</h1> {/* Heading will be styled in CSS */}
            
            {/* REMOVED: Workout description and duration */}
            {/* <p className='workout-description'>{workout?.description}</p> */}
            {/* <p className='workout-duration'>Duration: {workout?.durationInMinutes} min</p> */}

            <div className='workout__exercises'>
                {workout?.exercises.length > 0 ? (
                    workout.exercises.map((item: any, index: number) => {
                        return (
                            <div className={
                                index % 2 === 0 ? 'workout__exercise' : 'workout__exercise workout__exercise--reverse'
                            } key={item._id || index}>
                                <h3>{index + 1}</h3>
                                <div className='workout__exercise__image'>
                                    <img src={item.imageURL || '/placeholder-exercise.gif'} alt={item.name || "Exercise Image"} />
                                </div>
                                <div className='workout__exercise__content'>
                                    <h2>{item.name}</h2>
                                    <span>{item.sets} sets X {item.reps} reps</span>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className='no-exercises-message'>No exercises found for this workout.</p>
                )}
            </div>
        </div>
    );
};

export default Page;