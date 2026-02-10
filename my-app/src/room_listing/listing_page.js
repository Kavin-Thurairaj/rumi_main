// Import of Box Material UI
import Box from "@mui/material/Box";

// Import of Card Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//Import the Room slider js 
import RoomSlider from '../components/room_slider';

function listing_page(){
    return(

        // Master Container
        <Box sx={{
            display:'flex',
            flexDirection:{xs:'column', md:'row'}, // the responsiveness is made for the boxes the left and right
            bgcolor:'#F1F5F9',
            color:'#020617',
            p:2, // the spacing between the left and right boxes are given
            minHeight:'100vh'
        }}>

            {/* Left side Box */}
            <Box sx={{
                display:'flex',
                flexDirection:'column', // the items inside the box will be like a column
                flex:1,
                pt:1, // Padding in all direction are given
                pl:1,
                pr:1,
                pb:1,
                width:'100%',
                gap:1
            }}>

                {/* Room Slider Component */}
                <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    gap:1,
                    alignItems:'center' // center the card in the column
                }}>

                    <Card varient ="outlined" 
                    sx={{
                        bgcolor:'#fffff',
                        borderRadius:1.5,
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 2px rgba(2, 6, 23, 0.08)',
                        maxWidth: '100%', 
                        height: 300,
                    }}>
                        <CardContent sx={{p:0, '&last-child':{pb:0}, height:'100%'}}>
                            <RoomSlider/>
                        </CardContent>

                    </Card>
                </Box>
               
            </Box>



            {/* Right side Box */}
            <Box>

            </Box>


        </Box>
    )
}

export default listing_page;