import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import './HomeBanner2.css'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';


const HomeBanner2 = () => {
  const [workouts, setWorkouts] = React.useState<any[] | null>(null)

  const getworkouts = async () => {
    let data: any[] = [
      {
        type: 'Pranayama',
        imageUrl: 'https://images.unsplash.com/photo-1713429204572-8a951faffa74?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 20
      },
      {
        type: 'Surya Namaskar',
        imageUrl: 'https://images.unsplash.com/photo-1491172700640-4f1a131a3670?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 10
      },
      {
        type: 'Balasana',
        imageUrl: 'https://images.unsplash.com/photo-1612732362547-14adf627f24e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 5
      },
      {
        type: 'Bhujangasana',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1664299918352-0ece7a234f0b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 15
      },
      {
        type: 'Padmasana',
        imageUrl: 'https://images.unsplash.com/photo-1602502070119-c2a1fd7432a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 25
      },
      {
        type: 'Trikonasana',
        imageUrl: 'https://images.unsplash.com/photo-1616486436236-f45974d3ba49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 12
      },
      {
        type: 'Virabhadrasana',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1716392169035-895cb3146d9c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 18
      },
      {
        type: 'Shavasana',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1672038312530-7e523a3066d9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        durationInMin: 30
      }
    ];
    setWorkouts(data)
  }
  React.useEffect(() => {
    getworkouts()
  }, [])

  return (
    <div>
      <h1 className='mainhead1'>व्यायाम-Section</h1>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {
          workouts && workouts.map((item, index) => {
            return (
              <SwiperSlide key={index} >
                <div className='swiper-slide'
                  style={{
                    backgroundImage: `url(${item.imageUrl})`,
                  }}
                  onClick={() => {
                    window.location.href = `/VyayamSection/${item.type}`
                  }}
                >
                  <div className='swiper-slide-content'>
                    <h2>{item.type}</h2>
                    <p>{item.durationInMin} min</p>
                  </div>
                </div>
              </SwiperSlide>
            )
          })
        }

      </Swiper>
    </div>
  )
}

export default HomeBanner2