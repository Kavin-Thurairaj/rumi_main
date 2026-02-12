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


function listing_page(){
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
                    backgroundColor: 'Red'
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
                                width: 500
                            }}
                        >
                            {/* <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: '100%' }}>
                                <SlidePage slides={slides}/>
                            </CardContent> */}
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
                                        <Typography varient='caption' sx={{display:'flex',gap:0.2}}> <User size={15}/> 23 Reviews</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography varient='caption' sx={{display:'flex',gap:0.2}}> <MapPin size={15}/>Colombo, City Center</Typography>
                                    </Grid>

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
                    pb:1,
                    border:'2px solid black',
                    backgroundColor: 'yellow'
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

                </Box>


            </Box>
        </div>
    )
}

export default listing_page;