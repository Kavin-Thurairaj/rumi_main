
// Import of Swiper and SwiperSlide
import {Swiper,SwiperSlide} from 'swiper/react';

import { useState,useEffect } from 'react';


// importing the swiper css 
import 'swiper/css';  

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// import navigation, pagination, scrollbar modules
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import imageApi from '../api/rumi_image_api';

// Import of the room_slider css file
import '../components/room_slider.css';


function RoomSlider(){

    const [fetchImg, setFetchImg] = useState([])
    const [error, setError]=useState("")

    const [loading, setLoading] = useState(true)  // add loading state

    // Mock images for demo/fallback
    const mockImages = [
      { imageId: 1, imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900' },
      { imageId: 2, imageUrl: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { imageId: 3, imageUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ];

    const handleFetch = async () => {
        try {
            const result = await imageApi.getImage(1) // here we call the getImage method in the imageApi the get endpoint fetch
            console.log("the result: "+result.data)
            if (result.data && result.data.length > 0) {
              setFetchImg(result.data)  // In the state variable fetchImg we save the result data
            } else {
              // Use mock images if API returns empty
              console.log("No images from API, using mock images")
              setFetchImg(mockImages)
            }
        } 
        catch (err) {
            console.log("error: "+err)
            // Use mock images on error
            setFetchImg(mockImages)
            if (err.response?.status === 404) {
                setError("Room not found. Showing demo images.")
            } else if (err.response?.status === 500) {
                setError("Server error. Showing demo images.")
            } else {
                setError("") // Don't show error if we have mock images
            }   
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {handleFetch();}, []);  //This will load the handleFetch automatically

    return(
        <div className="mini-slider">

                <Swiper
                    modules={[Navigation,Pagination,Scrollbar,A11y]}
                    slidesPerView={1}
                    navigation
                    pagination={{clickable:true}}
                    style={{width:'100%', height:'100%'}}
                >

                    {/* Loading slide */}
                    {loading && (
                        <SwiperSlide>
                            <div className='slider-message'>
                                <div className="slider-spinner"></div>
                                <div className="slider-message-text"> Loading... </div>
                            </div>
                        </SwiperSlide>
                    )}

                    {/* Error slide */}
                    {!loading && error && (
                        <SwiperSlide>
                            <div className="slider-message">
                                <div className="slider-message-text">{error}</div>
                            </div>
                        </SwiperSlide>
                    )}

                    {/* No images slide */}
                    {!loading && !error && fetchImg.length === 0 && (
                        <SwiperSlide>
                            <div className='slider-message'>
                                <div className="slider-message-text">No images available</div>
                            </div>
                        </SwiperSlide>
                    )}

                    {fetchImg.length>0 && !error && !loading &&
                        fetchImg.map((img)=>(  // Map means we loop through the array and get the json object img
                            <SwiperSlide key={img.imageId}
                                style={{
                                    display:'flex',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    backgroundColor:'#1E293B'
                                }}
                            >
                                <img src={img.imageUrl} alt={img.imageId} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>  {/*here we set the image url for the json object */}
                            </SwiperSlide>

                            

                        ))
                    }
                    
                </Swiper>
            
        </div>
    )
}

export default RoomSlider;