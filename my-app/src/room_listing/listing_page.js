// sx prop is used to override the default styling from the Material UI components.

import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

// Import of Box Material UI
import Box from "@mui/material/Box";

// Import of Card Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// Import the Room slider js 
import RoomSlider from '../components/room_slider';
import supabase from '../api/supabaseClient';

// Import the data from roomdata.json
import roomobject from '../components/roomdata.json';

// Import Typograph from Material UI
import Typography from "@mui/material/Typography";

// Import Grid layout from Material UI
import Grid from '@mui/material/Grid'

// Import link from Material UI
import Link from "@mui/material/Link";

// Import Button from Material UI
import Button from "@mui/material/Button";

// Import lucide-react icons
import {  MapPin, CalendarDays, MessageCircle, CircleDollarSign, ChevronRight, Check , BookText, Info, CircleStar} from 'lucide-react';
import { User } from 'lucide-react';
import Avatar from "@mui/material/Avatar";
import RatingStars from "../components/rating_system/component/ratingStars";
import RateRoom from "../components/rating_system/component/rateRoom";
import RatingDisplay from "../components/rating_system/component/ratingDisplay";
import CircularProgress from "@mui/material/CircularProgress";
import axiosClient from '../api/rumi_client';
import { createBooking, checkExistingBooking } from '../components/rating_system/services/bookingService';


function ListingPage(){
    const { id } = useParams();
    const mockUserId = 1;  // Should come from auth context
    
    // Room and booking states
    const [room, setRoom] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [booked, setBooked] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingMsg, setBookingMsg] = useState('');

    // Fetch images directly from Supabase storage
    const fetchImagesFromSupabase = async (roomId) => {
        try {
            const { data, error: listError } = await supabase.storage
                .from('RoomImages')
                .list(String(roomId), {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (listError) {
                console.warn('Supabase list error:', listError);
                return [];
            }

            if (!data || data.length === 0) {
                console.warn('No images found in Supabase');
                return [];
            }

            // Generate public URLs for all files
            const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
            const roomImages = data
                .filter(file => !file.name.startsWith('.'))  // Skip metadata files
                .map(file => `${supabaseUrl}/storage/v1/object/public/RoomImages/${roomId}/${file.name}`);

            console.log('Fetched images from Supabase:', roomImages);
            return roomImages;
        } catch (err) {
            console.error('Error fetching from Supabase storage:', err);
            return [];
        }
    };

    // Fetch room data from Supabase
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                setLoading(true);
                const roomIdInt = parseInt(id, 10);
                
                // Fetch from Supabase rooms table - use get() instead of .single()
                const { data: roomsData, error: roomError } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('roomid', roomIdInt);
                
                if (roomError) {
                    console.warn('Supabase room fetch error:', roomError);
                    setError('Room not found');
                } else if (roomsData && roomsData.length > 0) {
                    const fetchedRoom = roomsData[0];
                    setRoom(fetchedRoom);
                    console.log('Room loaded from Supabase:', fetchedRoom);
                } else {
                    setError('Room not found');
                }
                
                // Fetch images from Supabase storage
                const supabaseImages = await fetchImagesFromSupabase(id);
                if (supabaseImages.length > 0) {
                    setImages(supabaseImages);
                } else {
                    setImages(['https://via.placeholder.com/800x600?text=Room+Image']);
                }
                
                // Check if already booked
                const alreadyBooked = await checkExistingBooking(mockUserId, roomIdInt);
                setBooked(alreadyBooked);
                
                setError(null);
            } catch (err) {
                console.error('Error fetching room:', err);
                setError(err.message);
                setImages(['https://via.placeholder.com/800x600?text=Room+Image']);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoomData();
        }
    }, [id]);

    // Handle booking
    const handleBook = async () => {
        setIsBooking(true);
        try {
            const result = await createBooking(mockUserId, room?.roomId || room?.id);
            if (result) {
                setBooked(true);
                setBookingMsg('Room booked successfully!');
                setTimeout(() => setBookingMsg(''), 3000);
            } else {
                setBookingMsg('Failed to book room.');
                setTimeout(() => setBookingMsg(''), 3000);
            }
        } catch (error) {
            setBookingMsg('Error booking room.');
            setTimeout(() => setBookingMsg(''), 3000);
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!room) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Room not found</Typography>
                {error && <Typography color="error">{error}</Typography>}
            </Box>
        );
    }
    
    return(

        <div>
            {/* Master Container */}
            <Box sx={{
                display:'flex',
                flexDirection:{xs:'column', md:'row'}, // the responsiveness is made for the boxes the left and right
                bgcolor:'#F1F5F9',
                color:'#020617',
                p:2, // the spacing between the left and right boxes are given
                minHeight:'100vh',
            }}>

                {/* Left side Box */}
                <Box sx={{
                    display:'flex',
                    flexDirection:'column', // the items inside the box will be like a column
                    flex:1,
                    pt:1, // Padding in all direction are given
                    pl:1,
                    pr:1,
                    pb:0,
                    width:'100%',
                    gap:1,
                    // backgroundColor: 'Red'
                }}>

                    {/* Room Slider Component */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'center', // center the card in the column
                        }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#FFFFFF',
                                borderRadius: 1.5,
                                border: '1px solid #CBD5E1',
                                boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)',
                                width:'100%',  //This gives the card to have a full width
                                maxWidth: '100%', // responsive fallback
                                height: 300,
                                
                            }}
                        >
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: '100%' }}>
                                <RoomSlider/> 
                            </CardContent>
                        </Card>
                    </Box>
                    
                    {/* Room title card */}
                    <Card varient="outlined"
                        sx={{
                            bgcolor:'#ffff',
                            borderRadius:1.5,
                            border:'1px solid #CBD5E1',
                            boxShadow:'0 1px 2px rgba(2, 6, 23, 0.08)'
                        }}
                    >
                        <CardContent sx={{p:1,"&:last-child":{pb:1}}}>
                            <Grid container spacing={0.5}>

                                {/* Room title */}
                                <Grid item size={{xs:12,md:12,lg:12}}>
                                    <Typography
                                        varient="h6"
                                        sx={{fontWeight:550}}
                                        fontSize={18}
                                        color='#1E293B' 
                                    >
                                        {room?.roomTitle || 'Room Details'}
                                    </Typography>
                                </Grid>

                                {/* Review and Location of the Room */}
                                <Grid container direction='row' spacing={3} alignItems={'center'}>
                                    <Grid item>
                                        <Typography variant='caption' sx={{display:'flex',gap:0.2}}> <User size={15}/> {room?.reviewCount || 0} Reviews </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='caption' sx={{display:'flex',gap:0.2}}>
                                            <MapPin size={15}/>
                                            {room?.address?.city || 'City'}, {room?.address?.country || 'Country'}
                                        </Typography>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Rating System - Submission Form (only if booked) */}
                    {booked && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Box sx={{ width: '100%' }}>
                                <RateRoom roomId={room?.roomId || id} userId={mockUserId} />
                            </Box>
                        </Box>
                    )}

                    {/* Rating Statistics Display */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Box sx={{ width: '100%' }}>
                            <RatingDisplay roomId={room?.roomId || id} />
                        </Box>
                    </Box>
                
                </Box>



                {/* Right side Box */}
                <Box sx={{
                    display:'flex',
                    flexDirection:'column',  // The items like Card and grid will be in a column flow
                    flex:1,
                    pt:1,  // The items inside the box will be given padding
                    pl:1,
                    pr:1,
                    pb:0,
                    // border:'2px solid black',
                    // backgroundColor: 'yellow',
                    gap:1
                }}>

                    <Card
                        sx={{
                            bgcolor:'#FFF',
                            borderRadius:1.5,
                            border:'1px solid #CBD5E1',
                            boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)'
                        }}
                    >

                        <CardContent sx={{p:1,'&:last-child':{pb:1}}}>
                            {/* This is the Parent container for the room pricing and Schedule and apply now */}
                            <Grid container direction={'row'} justifyContent={'space-between'} spacing={1}>

                                <Grid container direction={'column'} spacing={1} justifyContent={'center'}>
                                    <Grid item>
                                        <Typography variant="p" fontSize={20} sx={{fontWeight:600}}>
                                            {room?.price?.amount ? `LKR ${room.price.amount.toLocaleString('en-LK')}` : 'Price on request'}
                                        </Typography>
                                        <Typography variant="caption" sx={{color: '#666'}}>
                                            / {room?.price?.billingCycle?.toLowerCase() || 'month'}
                                        </Typography>
                                    </Grid>
                                    <Grid container direction={'column'} spacing={0.2}>
                                        <Grid item>
                                            <Typography variant='p' fontSize={14} sx={{display:'flex', alignItems:'end',gap:0.2}}> <Check size={16}/> All utilities included</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='p' fontSize={14} sx={{display:'flex', alignItems:'end',gap:0.2}}>
                                                <CircleDollarSign size={16} color='green'/> Security deposit: {room?.securityDeposit || 'TBA'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Link sx={{fontSize:13,fontWeight:500,color:'primary.main',textDecoration:'none','&:hover':{textDecoration:'underline'},cursor:'pointer',display:'flex',alignItems:'end',gap:0}}>View full lease term <ChevronRight size={13}/></Link>
                                    </Grid>
                                </Grid>

                                <Grid container direction={'column'} spacing={1} justifyContent={'center'}>
                                    <Grid container spacing={1} sx={{display:'flex',alignItems:'center',justifyContent:'end'}}>
                                        <Grid item>
                                            <Typography variant="p" fontSize={12}>Available from</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography component='p' fontSize={18} sx={{display:'flex', alignItems:'center',gap:0.5}}> 
                                                <CalendarDays size={15}/> {room?.availableFrom || 'TBA'}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container alignItems={{xs:'start',md:'end'}} direction={{xs:'column',sm:'row',md:'column', lg:'row'}} spacing={0.5}>
                                        <Grid item>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                color="black" 
                                                size="large" 
                                                disabled={booked || isBooking}
                                                sx={{
                                                    boxShadow:'0px 1px 2px rgba(0,0,0,0.15)', 
                                                    border:'1px solid gray', 
                                                    fontSize:'13px'
                                                }}
                                                onClick={handleBook}
                                            >
                                                {isBooking ? 'Booking...' : booked ? <><Check size={16} style={{ display: 'inline', marginRight: '4px' }} />Booked!</> : 'Schedule Visit'}
                                            </Button>
                                        </Grid>

                                        <Grid item>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                size="large"
                                                disabled={isBooking || booked}
                                                sx={{
                                                    bgcolor:booked ? '#22c55e' : '#1E293B', 
                                                    boxShadow:'0px 1px 2px rgba(0,0,0,0.15)',
                                                    border:'1px solid gray',
                                                    fontSize:"13px",
                                                    color:'#ffffff', 
                                                    fontWeight:600
                                                }}
                                                onClick={handleBook}
                                            >
                                                {isBooking ? 'Booking...' : booked ? <><Check size={16} style={{ display: 'inline', marginRight: '4px' }} />Booked!</> : 'Book Now'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    
                                    {bookingMsg && (
                                        <Grid item>
                                            <Typography sx={{fontSize: '12px', color: booked ? '#22c55e' : '#ef4444'}}>
                                                {bookingMsg}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Room rule and details */}
                    <Card 
                    sx={{
                        bgcolor:'#FFFF',
                        borderRadius:1.5,
                        border:'1px solid #CBD5E1',
                        boxShadow:'0 1px 2px rgba(2, 6, 23, 0.08)'
                    }}>
                        <CardContent sx={{p:1,'&:last-child': { pb: 1 }}}>
                            <Grid container direction={'column'} gap={0.5}>
                                <Grid item>
                                    <Typography variant="p">Room Details and Rules</Typography>
                                </Grid>

                                {/* Room Details Container */}
                                <Grid container justifyContent={'space-between'}>
                                    <Grid item>
                                        <Typography fontSize={14}><BookText size={13}/> {room?.roomType || 'Private Bedroom'}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography fontSize={14}><BookText size={13}/> {room?.bathroomType || 'Shared Bathroom'}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:{xs:'none' , sm:'block',md:'none', lg:'block'}}}>
                                            <BookText size={13}/> {room?.maxRoommates || '3'} Max Roommate{room?.maxRoommates !== 1 ? 's' : ''}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* Guest Rules container  */}
                                <Grid container justifyContent={'space-between'}>
                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:'flex', alignItems:'center', gap:0.5}}> <Info size={13}/> Quiet hours available</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:'flex', alignItems:'center', gap:0.5}}><Info size={13}/> Guests allowed</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:'flex', alignItems:'center', gap:0.5}}><Info size={13}/> {room?.roomStatus === 'AVAILABLE' ? 'Available Now' : 'Check availability'}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item>
                                    <Link sx={{fontSize: 13,fontWeight: 500,color: 'primary.main',textDecoration: 'none','&:hover': {textDecoration: 'underline'}, cursor:'pointer' ,display: 'flex',alignItems: 'end',gap: 0}}>View all House Rules and Room Details <ChevronRight size={13}/></Link>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Owner profile card and contact button */}
                    <Card variant="outlined"
                        sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)',
                    }}
                    >
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            {/* This container grid holds all the content in the card */}
                            <Grid container direction={'row'} justifyContent={'space-between'} alignItems={'center'}>

                                <Grid container direction={'column'} spacing={1}>
                                    <Grid container alignItems={'center'}>
                                        <Grid item>
                                            <Avatar sx={{bgcolor:'#0057b8'}}>
                                                {room?.rentername?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'LL'}
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{room?.rentername || 'Landlord'}</Typography>
                                        </Grid> 
                                    </Grid>

                                    <Grid item>
                                        <Link sx={{fontSize: 13,fontWeight: 500,color: 'primary.main',textDecoration: 'none','&:hover': {textDecoration: 'underline'}, cursor:'pointer' ,display: 'flex',alignItems: 'end',gap: 0}}>View full profile <ChevronRight size={13}/></Link>
                                    </Grid>
                                </Grid>

                                {/* Contact button where the tenant can contact the owner of the room */}
                                <Grid item>
                                    <Button type='submit' variant='contained'  size='large' sx={{boxShadow: '0 2px 8px rgba(8, 47, 105, 0.2)',border:'1px solid gray',alignItems: 'center', gap:0.5, fontSize:'14px', bgcolor:'#1E293B',color:'#FFFFFF', fontWeight:600, textTransform:'none', borderRadius:2, px:3,py:1.5, '&hover':{bgcolor: '#1E293B',boxShadow: '0 4px 12px rgba(8, 47, 105, 0.3)',}}}><MessageCircle size={13}/>Contact</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Amenities card content */}
                    <Card sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)'
                    }}>
                        <CardContent sx={{p:1, '&:last-child': { pb: 1 } }}>
                            <Grid container direction={'column'} gap={0.5}>
                                {/* Amenities Title */}
                                <Grid item>
                                    <Typography variant="p">Amenities</Typography>
                                </Grid>

                                {/* All Amenities will be displayed */}
                                <Grid container justifyContent={'space-between'}>
                                    {room?.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                                        <Grid item key={idx}>
                                            <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> 
                                                <CircleStar size={13}/> {amenity.name}
                                            </Typography>
                                        </Grid>
                                    ))}
                                    {(!room?.amenities || room.amenities.length === 0) && (
                                        <>
                                            <Grid item>
                                                <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> <CircleStar size={13}/> High-Speed WiFi</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> <CircleStar size={13}/> Free Parking</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> <CircleStar size={13}/> Air Conditioning</Typography>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                                {/* Link to view the Amenities */}
                                <Grid item>
                                    <Link sx={{fontSize: 13,fontWeight: 500,color: 'primary.main',textDecoration: 'none','&:hover': {textDecoration: 'underline'}, cursor:'pointer' ,display: 'flex',alignItems: 'end',gap: 0}}>View all Amenities <ChevronRight size={13}/></Link>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                    <Grid container gap={1} direction={{ xs: 'column', sm: 'column', md:'column' , lg:'column'}}>
                        {/* This container the map of where the room is located */}
                        <Grid item>
                            <Card
                                sx={{
                                bgcolor: '#FFFFFF',
                                borderRadius: 1.5,
                                border: '1px solid #CBD5E1',
                                boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)',
                                height: 285
                                }} 
                            >
                                <CardContent sx={{ p: 0,'&:last-child': { pb: 0 }, height: '100%' }}>
                                    <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5067.662628274249!2d79.852057200656!3d6.894745045165493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bdee494e9d3%3A0x629c2df0a6d82f99!2sIIT%20School%20Of%20Computing!5e0!3m2!1sen!2slk!4v1765260349607!5m2!1sen!2slk"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{
                                        border: 0,
                                        width: '100%',
                                        height: '100%', // fill the CardContent
                                    }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* <Grid container direction={'column'} flex={1} spacing={1}>
                            <Grid item>
                                <Card
                                    sx={{
                                        bgcolor: '#FFFFFF',
                                        borderRadius: 1.5,
                                        border: '1px solid #CBD5E1',
                                        boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)'
                                    }}
                                >
                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                        <Grid container direction={'column'}>
                                            <Grid item>
                                                <Typography variant="p">Your Roommates</Typography>
                                            </Grid>

                                            <Grid container>
                                                <Grid item>
                                                    <Avatar></Avatar>
                                                </Grid>

                                                <Grid container direction={'column'}>

                                                    <Grid item>
                                                        <Typography>Alex,28 - Occupation</Typography>
                                                    </Grid>

                                                    <Grid item>
                                                        <Typography>Clean, quiet works from home.</Typography>
                                                    </Grid>

                                                </Grid>

                                            </Grid>

                                            <Grid item>
                                                <Link sx={{fontSize: 13,fontWeight: 500,color: 'primary.main',textDecoration: 'none','&:hover': {textDecoration: 'underline'}, cursor:'pointer' ,display: 'flex',alignItems: 'end',gap: 0}}>Learn more about your roomates <ChevronRight size={13}/></Link>
                                            </Grid>

                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item>

                            </Grid>
                        </Grid> */}
                    </Grid>
                </Box>


            </Box>
        </div>
    )
}

export default ListingPage;