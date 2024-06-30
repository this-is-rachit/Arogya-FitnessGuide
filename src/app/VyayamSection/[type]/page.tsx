"use client"
import React from 'react'
import './workoutPage.css'
const page = () => {
    const [workout, setWorkout] = React.useState<any>(null)


    const getworkout = async () => {
        let data: any = {
            type: 'Pranayama',
            imageUrl: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with appropriate image URL
            durationInMin: 20, // Adjust duration as needed
            exercises: [
              {
                exercise: 'Nadi Shodhana Pranayama',
                videoUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEih6g-mFJGndDu2BaOeX7Q_23hNDOY3lj0gwfsTaq8pSL9KwX5csuB9UYMCdspoZliX2Q7cbB7pZ2BbvOjWLmvxs-_Uru9QHajp62-Y8XvKlgBOSvt903zuKyoast94Mh27AxOsh8Hq4Dw/s1600/Anulom+Vilom+Pranayama.gif', // Replace with video URL if available
                sets: 1, // Typically done in sets of 1 for a specific duration
                reps: '10 cycles', // Represents the number of cycles rather than repetitions
                rest: 0, // No specific rest period between cycles
                description: 'Sit in a comfortable position. Close your eyes. Place your left hand on your left knee and your right thumb on your right nostril. Inhale deeply through your left nostril, then close it with your ring finger. Open and exhale slowly through your right nostril. Repeat, alternating nostrils for 10 cycles.'
              },
              {
                exercise: 'Bhramari Pranayama',
                videoUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGnWEn0bJmuWLaa4txXMR5F9RL_da6zSOoZTdPTZX4YDU1TkgMzF0ts5dKmUCe7mWvyNlo_uOaIYBl6ytz8utEZJFM-Dg5Kl93f4uJpWUYvC445lCO3ngYBKIaCSl-7IP1MT9DiOLdhQw/w300-h245-no/Bharamari+Pranayama.gif', // Replace with video URL if available
                sets: 1, // Typically done in sets of 1 for a specific duration
                reps: '5 rounds', // Represents the number of rounds rather than repetitions
                rest: 0, // No specific rest period between rounds
                description: 'Sit in a comfortable position with your eyes closed. Inhale deeply through your nostrils. Exhale slowly, making a deep, steady humming sound like a bee. Repeat for 5 rounds.'
              },
              {
                exercise: 'Kapalabhati Pranayama',
                videoUrl: 'https://lh6.googleusercontent.com/-k1tngB1Z3pg/VYE_uWHxEVI/AAAAAAAABnw/HlH8o8DRX3A/w300-h245-no/Kapal%2BBhati%2BPranayama.gif', // Replace with video URL if available
                sets: 3, // Typically done in sets of 3 for a specific duration
                reps: '30 breaths per set', // Represents the number of breaths per set
                rest: 30, // Rest for 30 seconds between sets
                description: 'Sit comfortably with your spine erect. Take a deep breath in, then forcefully exhale in short bursts from your lower belly (diaphragm). Let inhalation happen passively. Repeat for 30 breaths, then rest for 30 seconds. Do 3 sets in total.'
              }
            ]
          };

        setWorkout(data)
    }

    React.useEffect(() => {
        getworkout()
    }, [])
    return (
        <div className='workout'>
            <h1 className='mainhead2'> {workout?.type}</h1>
            <div className='workout__exercises'>
                {
                    workout?.exercises.map((item: any, index: number)=>{
                        return (
                            <div className={
                                index % 2 === 0 ? 'workout__exercise' : 'workout__exercise workout__exercise--reverse'
                            }>
                                <h3>{index+1}</h3>
                                <div className='workout__exercise__image'>
                                    <img src={item.videoUrl} alt="" />
                                </div>
                                <div className='workout__exercise__content'>
                                    <h2>{item.exercise}</h2>
                                    <span>{item.sets} sets X {item.reps}</span>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default page