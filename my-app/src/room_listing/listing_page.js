// sx prop is used to override the default styling from the Material UI components.

// Import of Box Material UI
import Box from "@mui/material/Box";

// Import of Card Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// Import the Room slider js
import RoomSlider from '../components/room_slider';

// Import the data from roomdata.json
import roomobject from '../components/roomdata.json';

// Import Typograph from Material UI
import Typography from "@mui/material/Typography";

// Import Grid layout from Material UI
import Grid from '@mui/material/Grid';

// Import link from Material UI
import Link from "@mui/material/Link";

// Import Button from Material UI
import Button from "@mui/material/Button";

// Import lucide-react icons
import { MapPin, CalendarDays, MessageCircle, CircleDollarSign, ChevronRight, Check, BookText, Info, CircleStar } from 'lucide-react';
import { User } from 'lucide-react';
import Avatar from "@mui/material/Avatar";

import Map_distance from "../map/Map_distance";


function listing_page() {

    return (
        <div>
            {/*  Master Container */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                bgcolor: '#F1F5F9',
                color: '#020617',
                p: 2,
                minHeight: '100vh',
                gap: 1,
            }}>

                {/*  LEFT COLUMN  */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: 1,
                    minWidth: 0,
                }}>

                    {/* Room Image Slider*/}
                    <Card variant="outlined" sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                        height: 300,
                    }}>
                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: '100%' }}>
                            <RoomSlider />
                        </CardContent>
                    </Card>

                    {/* Room Title */}
                    <Card variant="outlined" sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                    }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18, color: '#1E293B', mb: 0.5 }}>
                                Private Room in Modern Shared Apartment
                            </Typography>
                            <Grid container direction="row" spacing={2} alignItems="center">
                                <Grid item>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                        <User size={14} /> 23 Reviews
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                        <MapPin size={14} /> Colombo, City Center
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Pricing  */}
                    <Card sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                    }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Grid container direction="row" justifyContent="space-between" alignItems="center">

                                
                                <Grid item>
                                    <Typography fontSize={22} fontWeight={700} sx={{ mb: 0.5 }}>$850/month</Typography>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mb: 0.3 }}>
                                        <Check size={14} /> All utilities included
                                    </Typography>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mb: 0.5 }}>
                                        <CircleDollarSign size={14} color="green" /> Security deposit: $850
                                    </Typography>
                                    <Link sx={{ fontSize: 12, fontWeight: 500, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }}>
                                        View full lease term <ChevronRight size={12} />
                                    </Link>
                                </Grid>

                                {/* Available from*/}
                                <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                    <Typography fontSize={12} color="text.secondary">Available from</Typography>
                                    <Typography fontSize={16} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarDays size={14} /> Jan 15, 2025
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="contained" color="inherit" size="small" sx={{ boxShadow: '0px 1px 2px rgba(0,0,0,0.15)', border: '1px solid #CBD5E1', fontSize: 12, textTransform: 'none' }}>
                                            Schedule Visit
                                        </Button>
                                        <Button variant="contained" size="small" sx={{ bgcolor: '#1E293B', color: '#FFF', fontWeight: 600, fontSize: 12, textTransform: 'none', border: '1px solid #1E293B', '&:hover': { bgcolor: '#334155' } }}>
                                            Apply Now
                                        </Button>
                                    </Box>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Tenant Reviews*/}
                    <Card variant="outlined" sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                    }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography fontWeight={600} fontSize={14} sx={{ mb: 1 }}>
                                Tenant Reviews
                            </Typography>
                            <Grid container alignItems="flex-start" spacing={1.5} sx={{ mb: 0.5 }}>
                                <Grid item>
                                    <Avatar sx={{ width: 35, height: 35, bgcolor: 'orange' }}>NJ</Avatar>
                                </Grid>
                                <Grid item sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        Nathan Johnson
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1.2, mb: 0.5 }}>
                                        Stayed 12 months · 6 months ago
                                    </Typography>
                                    <Typography fontSize={12} sx={{
                                        lineHeight: 1.3,
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        The empty space just means your content isn't tall enough to fill the viewport — it doesn't break anything.
                                        Add more text here to test if the ellipsis appears after two lines.
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Link sx={{ fontSize: 12, fontWeight: 500, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }}>
                                Read all 23 reviews <ChevronRight size={12} />
                            </Link>
                        </CardContent>
                    </Card>

                    {/*  Owner Profile + Contact  */}
                    <Card variant="outlined" sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                    }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 36, height: 36 }}>YG</Avatar>
                                        <Typography fontWeight={600} fontSize={14}>Yohan</Typography>
                                    </Box>
                                    <Link sx={{ fontSize: 12, fontWeight: 500, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }}>
                                        View full profile <ChevronRight size={12} />
                                    </Link>
                                </Box>
                                <Button variant="contained" size="large" sx={{
                                    bgcolor: '#1E293B', color: '#FFF', fontWeight: 600,
                                    textTransform: 'none', borderRadius: 2, px: 3, py: 1.5,
                                    fontSize: 14, display: 'flex', alignItems: 'center', gap: 0.5,
                                    boxShadow: '0 2px 8px rgba(8,47,105,0.2)',
                                    '&:hover': { bgcolor: '#334155' },
                                }}>
                                    <MessageCircle size={14} /> Contact
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>

                </Box>


                {/* 
                    RIGHT COLUMN */}
                <Box sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    position: { md: 'sticky' },
                    top: { md: 16 },
                    alignSelf: { md: 'flex-start' },
                }}>

                    {/* ── Room Details & Rules ── */}
                    <Card sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                    }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography fontWeight={600} fontSize={14} sx={{ mb: 1 }}>Room Details and Rules</Typography>
                            <Grid container spacing={1} sx={{ mb: 0.5 }}>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <BookText size={13} /> Private Bedroom
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <BookText size={13} /> Shared Bathroom
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <BookText size={13} /> 3 Bed, 2 Bath
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <Info size={13} /> Quiet hours: 10PM–8AM
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <Info size={13} /> Guests with notice
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <Info size={13} /> No smoking
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Link sx={{ fontSize: 12, fontWeight: 500, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }}>
                                View all House Rules and Room Details <ChevronRight size={12} />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* ── Amenities ── */}
                    <Card sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                    }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography fontWeight={600} fontSize={14} sx={{ mb: 1 }}>Amenities</Typography>
                            <Grid container spacing={1} sx={{ mb: 0.5 }}>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <CircleStar size={13} /> High-Speed WiFi
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <CircleStar size={13} /> Free Parking
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography fontSize={13} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <CircleStar size={13} /> Air Conditioning
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Link sx={{ fontSize: 12, fontWeight: 500, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }}>
                                View all Amenities <ChevronRight size={12} />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Map_distance */}
                    <Card sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: 1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2,6,23,0.08)',
                        overflow: 'hidden',
                        height: { xs: 500, md: 600 },
                    }}>
                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: '100%' }}>
                            <Map_distance />
                        </CardContent>
                    </Card>

                </Box>

            </Box>
        </div>
    );
}

export default listing_page;