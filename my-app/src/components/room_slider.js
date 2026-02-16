// Import of Swiper and SwiperSlide
import {Swiper,SwiperSlide} from 'swiper/react';

// importing the swiper css 
import 'swiper/css';  

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// import navigation, pagination, scrollbar modules
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import of the room_slider css file
import '../components/room_slider.css';

function room_slider({rooms}){
    return(
        <div class="mini-slider" style={{width:"100%", height:"100%"}}>

            <Swiper
                modules={[Navigation,Pagination,Scrollbar,A11y]}
                slidesPerView={1}
                navigation
                pagination={{clickable:true}}
                style={{width:'100%', height:'100%'}}
            >

                {/* Here from the rooms is array of room object, so i loop through the rooms and get single room */}

                {rooms.map((room)=>(
                    <SwiperSlide key={room.image}
                        style={{
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:'#1E293B'
                        }}
                    >
                        <img src={room.image} alt={room.title} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    )
}

export default room_slider;