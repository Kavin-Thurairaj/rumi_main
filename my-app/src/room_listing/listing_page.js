// sx prop is used to override the default styling from the Material UI components.


// Import of Box Material UI
import Box from "@mui/material/Box";

// Import of Card Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//Import the Room slider js 
import RoomSlider from '../components/room_slider';

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
import { useState } from "react";


function ListingPage(){
    const [rating, setRating] = useState(4.2);
    const [showRatingInput, setShowRatingInput] = useState(false);
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
                                maxWidth: '100%', // responsive fallback
                                height: 300,
                               
                            }}
                        >
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: '100%' }}>
                                <RoomSlider rooms={roomobject}/>
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
                                        Private Room in Modern Shared Apartment
                                    </Typography>
                                </Grid>

                                {/* Review and Location of the Room */}
                                <Grid container direction='row' spacing={3} alignItems={'center'}>

                                    <Grid item>
                                        <Typography variant='caption' sx={{display:'flex',gap:0.2}}> <User size={15}/> 23 Reviews </Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography variant='caption' sx={{display:'flex',gap:0.2}}><MapPin size={15}/>Colombo, City Center</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='caption' sx={{display:'flex', flexDirection:'column', gap:0.2}}>
                                            <span style={{ fontWeight:600, fontSize:'0.7rem' }}>Rating</span>
                                            <span><RatingStars rating={rating} /></span>
                                        </Typography>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            variant='outlined'
                                            size='small'
                                            onClick={() => setShowRatingInput((prev) => !prev)}
                                            sx={{ textTransform: 'none', fontSize: 11 }}
                                        >
                                            {showRatingInput ? 'Hide rating' : 'Rate this room'}
                                        </Button>
                                    </Grid>

                                    {showRatingInput && (
                                        <Grid item xs={12}>
                                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <span style={{ fontWeight: 500, fontSize: '0.75rem' }}>Select stars:</span>
                                                <RatingStars rating={rating} onRate={setRating} />
                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    onClick={() => {
                                                        setShowRatingInput(false)
                                                        // placeholder for submit
                                                    }}
                                                    sx={{ textTransform: 'none', bgcolor: '#1E293B', color: '#fff', '&:hover': { bgcolor: '#16283f' } }}
                                                >
                                                    Save
                                                </Button>
                                            </Typography>
                                        </Grid>
                                    )}

                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                    {/* User review and tenant Review */}
                    <Card variant='outlined'
                    sx={{
                        bgcolor:'#FFFF',
                        borderRadius:1.5,
                        border:'1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)'
                    }}
                    >

                        <CardContent sx={{p:1 ,"&:last-child":{pb:1}}}>  {/*padding for the card content is given and last child bottom of the card content a padding will be given of 1  */}

                            <Grid container direction={'column'} spacing={0.5}>
                                {/* Tenant Reviews title */}
                                <Grid item>
                                    <Typography variant= 'p' color='#1E293B'>Tenant Reviews</Typography>
                                </Grid>

                                {/* Number of user reviews */}
                                <Grid container spacing={3}>

                                    <Grid item sx={{display:'flex',alignItems:'center',gap:0.5}}>
                                        <User size={15} />
                                        <Typography variant='body2' sx={{ fontSize: 12 }}>
                                            23 Reviews
                                        </Typography>
                                    </Grid>

                                </Grid>

                                {/* Avater, Name and Review from the customers */}
                                <Grid container alignItems="flex-start" spacing={1.5}>
                                    <Grid item>
                                        <Avatar sx={{width:35, height:35,bgcolor:'orange',p:2}}>NJ</Avatar>
                                    </Grid>

                                    {/* Name, how long customer stayed and review */}
                                    <Grid item sx={{flex:1, minWidth:0}}>
                                        <Grid container direction={'column'} spacing={0}>
                                            <Grid item>
                                                <Typography sx={{
                                                    fontSize:'0.75rem', //font size of the text
                                                    fontWeight: 400,
                                                    textTransform: 'uppercase',  // Convert all the letter to uppercase
                                                    letterSpacing: '0.8',
                                                    lineHeight: 1,  // THe height of the line
                                                    m: 0,
                                                    p: 0,
                                                }}>
                                                    Nehthan Johnson
                                                </Typography>
                                            </Grid>

                                            <Grid item>
                                                <Typography color="gray" sx={{
                                                    fontSize:'0.625rem',
                                                    textTransform:'none',
                                                    lineHeight:1,
                                                    letterSpacing:0,
                                                    p:0,
                                                    mb:0.5
                                                }}>
                                                    Stayed 12 months 6 months ago</Typography>
                                            </Grid>

                                            {/* Review from the customers */}
                                            <Grid item>
                                                <Typography fontSize={12}
                                                    sx={{
                                                        maxWidth:'96%',
                                                        mb:0,
                                                        lineHeight:1.2,
                                                        display: '-webkit-box', 
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,   // maximum 2 lines if the line goes beyone the 2 lines, it will be ...
                                                        overflow: 'hidden',   // hide extra text
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    The empty space just means your content isn't tall enough to fill the viewport — it doesn't break anything. 
                                                    Add more text here to test if the ellipsis appears after two lines.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                {/* Link to read all the links */}
                                <Grid item>
                                    <Link sx={{fontSize: 13,fontWeight: 500,color: 'primary.main',textDecoration: 'none','&:hover': {textDecoration: 'underline'}, cursor:'pointer' ,display: 'flex',alignItems: 'end',gap: 0}}> Read all 23 reviews <ChevronRight size={13}/> </Link>
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
                                            <Avatar>YG</Avatar>
                                        </Grid>
                                        
                                        <Grid item>
                                            <Typography>Yohan</Typography>
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
                                        <Typography variant="p" fontSize={20} sx={{fontWeight:600}}>$850/month</Typography>
                                    </Grid>
                                    <Grid container direction={'column'} spacing={0.2}>
                                        <Grid item>
                                            <Typography variant='p' fontSize={14} sx={{display:'flex', alignItems:'end',gap:0.2}}> <Check size={16}/> All utilities included</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='p' fontSize={14} sx={{display:'flex', alignItems:'end',gap:0.2}}><CircleDollarSign size={16} color='green'/> Security deposit: $850</Typography>
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
                                            <Typography component='p' fontSize={18} sx={{display:'flex', alignItems:'center',gap:0.5}}> <CalendarDays size={15}/> Jan 15, 2025 </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container alignItems={{xs:'start',md:'end'}} direction={{xs:'column',sm:'row',md:'column', lg:'row'}}>
                                        <Grid item>
                                            <Button type="submit" variant="contained" color="black" size="large" sx={{boxShadow:'0px 1px 2px rgba(0,0,0,0.15)', border:'1px solid gray', fontSize:'13px'}}>Schedule Visit</Button>
                                        </Grid>

                                        <Grid item>
                                            <Button type="submit" variant="contained" size="large" sx={{bgcolor:'#1E293B', boxShadow:'0px 1px 2px rgba(0,0,0,0.15)',border:'1px solid gray',fontSize:"13px",color:'#ffffff', fontWeight:600}}>Apply Now</Button>
                                        </Grid>
                                    </Grid>
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
                                        <Typography fontSize={14}><BookText size={13}/> Private Bedroom</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography fontSize={14}><BookText size={13}/> Shared Bathroom</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography fontSize={14}  sx={{display:{xs:'none' , sm:'block',md:'none', lg:'block'}}}><BookText size={13}/> 3 Bed, 2 Bath</Typography>
                                    </Grid>
                                </Grid>

                                {/* Guest Rules container  */}
                                <Grid container justifyContent={'space-between'}>
                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:'flex', alignItems:'center', gap:0.5}}> <Info size={13}/> Quiet hours: 10PM - 8PM</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:'flex', alignItems:'center', gap:0.5}}><Info size={13}/> Guests allowed with notice</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography fontSize={14} sx={{display:'flex', alignItems:'center', gap:0.5}}><Info size={13}/> No smoking</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item>
                                    <Link sx={{fontSize: 13,fontWeight: 500,color: 'primary.main',textDecoration: 'none','&:hover': {textDecoration: 'underline'}, cursor:'pointer' ,display: 'flex',alignItems: 'end',gap: 0}}>View all House Rules and Room Details <ChevronRight size={13}/></Link>
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

                                    <Grid item>
                                        <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> <CircleStar size={13}/> High-Speed WiFi</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> <CircleStar size={13}/> Free Parking</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography fontSize={14} sx={{ display:'flex', alignItems:'center',gap:0.5}}> <CircleStar size={13}/> Air Conditioning</Typography>
                                    </Grid>

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