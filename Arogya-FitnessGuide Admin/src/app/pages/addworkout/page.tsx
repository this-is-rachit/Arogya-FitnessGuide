"use client"
import React from 'react'
import './addworkout.css'
import { toast } from 'react-toastify'

interface Workout {
    name: string;
    description: string;
    durationInMinutes: number;
    exercises: Exercise[];
    imageURL: string;
    imageFile: File | null;
}

interface Exercise {
    name: string;
    description: string;
    sets: number;
    reps: number;
    imageURL: string;
    imageFile: File | null;
}

const Page = () => {
    const [workout, setWorkout] = React.useState<Workout>({
        name: '',
        description: '',
        durationInMinutes: 0,
        exercises: [],
        imageURL: '',
        imageFile: null
    });

    const [exercise, setExercise] = React.useState<Exercise>({
        name: '',
        description: '',
        sets: 0,
        reps: 0,
        imageURL: '',
        imageFile: null
    });

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            [e.target.name]: e.target.value
        }));
    };

    const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExercise(prevExercise => ({
            ...prevExercise,
            [e.target.name]: e.target.value
        }));
    };

    const addExerciseToWorkout = () => {
        if (exercise.name === '' || exercise.description === '' || exercise.sets === 0 || exercise.reps === 0) {
            toast.error('Please fill all the fields for the exercise', {
                position: 'top-center',
            });
            return;
        }

        setWorkout(prevWorkout => ({
            ...prevWorkout,
            exercises: [...prevWorkout.exercises, { ...exercise }]
        }));

        setExercise({
            name: '',
            description: '',
            sets: 0,
            reps: 0,
            imageURL: '',
            imageFile: null
        });
    };

    const deleteExerciseFromWorkout = (index: number) => {
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            exercises: prevWorkout.exercises.filter((_, i) => i !== index)
        }));
    };

    const uploadImage = async (image: File) => {
        const formData = new FormData();
        formData.append('myimage', image);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadImage`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return data.imageUrl;
            } else {
                const errorText = await response.text();
                toast.error(`Image upload failed: ${response.status} - ${errorText}`, { position: 'top-center' });
                return null;
            }
        } catch (error) {
            toast.error('Network error during image upload.', { position: 'top-center' });
            return null;
        }
    };

    const checkLogin = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                return true;
            } else {
                window.location.href = '/adminauth/login';
                return false;
            }
        } catch (error) {
            toast.error('Network error during login check.', { position: 'top-center' });
            window.location.href = '/adminauth/login';
            return false;
        }
    };

    const saveWorkout = async () => {
        const isAuthenticated = await checkLogin();
        if (!isAuthenticated) {
            return;
        }

        if (workout.name === '' || workout.description === '' || workout.durationInMinutes === 0 || workout.exercises.length === 0) {
            toast.error('Please fill all workout details and add at least one exercise.', {
                position: 'top-center',
            });
            return;
        }

        let workoutToSend: Workout = {
            ...workout,
            exercises: workout.exercises.map(ex => ({ ...ex }))
        };

        if (workoutToSend.imageFile) {
            const imageURL = await uploadImage(workoutToSend.imageFile);
            if (imageURL) {
                workoutToSend.imageURL = imageURL;
            } else {
                toast.error('Failed to upload main workout image. Please try again.');
                return;
            }
        }

        const exercisesWithImageURLs = await Promise.all(
            workoutToSend.exercises.map(async (exercise) => {
                if (exercise.imageFile) {
                    const imgURL = await uploadImage(exercise.imageFile);
                    if (imgURL) {
                        return { ...exercise, imageURL: imgURL };
                    } else {
                        toast.warn(`Could not upload image for exercise: ${exercise.name}. Proceeding without image.`);
                        return { ...exercise, imageURL: '' };
                    }
                }
                return exercise;
            })
        );
        workoutToSend.exercises = exercisesWithImageURLs;

        workoutToSend.imageFile = null;
        workoutToSend.exercises.forEach(ex => ex.imageFile = null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutToSend),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Workout created successfully', {
                    position: 'top-center',
                });
                setWorkout({
                    name: '',
                    description: '',
                    durationInMinutes: 0,
                    exercises: [],
                    imageURL: '',
                    imageFile: null
                });
                setExercise({
                    name: '',
                    description: '',
                    sets: 0,
                    reps: 0,
                    imageURL: '',
                    imageFile: null
                });
            } else {
                const errorResponse = await response.text();
                toast.error(`Workout creation failed: ${response.status} - ${errorResponse}`, {
                    position: 'top-center',
                });
            }
        } catch (fetchError) {
            toast.error('Network error. Failed to create workout.', {
                position: 'top-center',
            });
        }
    };

    return (
        <div className="formpage">
            <h1 className="title">Add Workout</h1>
            <input
                type="text"
                placeholder="Workout Name"
                name="name"
                value={workout.name}
                onChange={handleWorkoutChange}
            />
            <textarea
                placeholder="Workout Description"
                name="description"
                value={workout.description}
                onChange={handleWorkoutChange}
                rows={5}
                cols={50}
            ></textarea>

            <label htmlFor="durationInMinutes">Duration in Minutes</label>
            <input
                type="number"
                placeholder="Workout Duration"
                name="durationInMinutes"
                value={workout.durationInMinutes}
                onChange={handleWorkoutChange}
            />

            <input
                type="file"
                placeholder="Workout Image"
                name="workoutImage"
                onChange={(e) =>
                    setWorkout(prevWorkout => ({
                        ...prevWorkout,
                        imageFile: e.target.files![0]
                    }))
                }
            />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h2 className="title">Add Exercise to workout</h2>
                <input
                    type="text"
                    placeholder="Exercise Name"
                    name="name"
                    value={exercise.name}
                    onChange={handleExerciseChange}
                />

                <textarea
                    placeholder="Exercise Description"
                    name="description"
                    value={exercise.description}
                    onChange={handleExerciseChange}
                    rows={5}
                    cols={50}
                ></textarea>

                <label htmlFor='sets'>Sets</label>
                <input
                    type='number'
                    placeholder='Sets'
                    name='sets'
                    value={exercise.sets}
                    onChange={handleExerciseChange}
                />

                <label htmlFor='reps'>Reps</label>
                <input
                    type='number'
                    placeholder='Reps'
                    name='reps'
                    value={exercise.reps}
                    onChange={handleExerciseChange}
                />

                <input
                    type='file'
                    placeholder='Exercise Image'
                    name='exerciseImage'
                    onChange={(e) => {
                        setExercise(prevExercise => ({
                            ...prevExercise,
                            imageFile: e.target.files![0]
                        }))
                    }}
                />

                <button
                    onClick={addExerciseToWorkout}
                >Add Exercise</button>

            </div>

            <div className='exercises'>
                {
                    workout.exercises.map((exercise, index) => (
                        <div className='exercise' key={index}>
                            <h2>{exercise.name}</h2>
                            <p>{exercise.description}</p>
                            <p>Sets: {exercise.sets}</p>
                            <p>Reps: {exercise.reps}</p>
                            <img src={
                                exercise.imageFile ?
                                    URL.createObjectURL(exercise.imageFile) :
                                    exercise.imageURL || '/placeholder.png'
                            } alt={exercise.name || "Exercise Image"} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                            <button
                                onClick={() => deleteExerciseFromWorkout(index)}
                            >Delete</button>
                        </div>
                    ))
                }
            </div>

            <button
                onClick={saveWorkout}
            >Add Workout</button>
        </div>
    );
};

export default Page;