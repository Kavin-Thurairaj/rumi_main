import React from 'react'
import { useState } from 'react';
import imageApi from '../api/rumi_image_api';

function RoomImageUpload(){

    const [images, setImages] = useState([]);
    const [error,setError]=useState("");

    const handleChange=(e)=>{    

        if (e.target.files.length > 6) {
            alert("You can only upload a maximum of 6 images.");
            e.target.value = ""; // Clear the input so they must re-select
            return;
        }
        else{
            const selectedFiles= e.target.files;
            console.log("Files selected:", selectedFiles);
            console.log(images)
            setImages(Array.from(selectedFiles));
        }

    }

    const handleUpload = async () => {
        try {
            
            await imageApi.uploadImage(images,4);
            console.log("sending")
            alert("Upload successful");
        } 
        catch (err) {
            // console.log(err);
            // alert("Upload failed" +err);
            if (err.response) {
            // Backend returned an error
            const errorMsg = err.response.data?.error || "Unknown server error";
            alert("Upload failed: " + errorMsg);
            setError(errorMsg);
            } 
            else {
            // Network error or CORS issue
            alert("Upload failed: Network error");
        }
        }
    };

    return(
        <div>
            <input type='file' multiple name='file' accept="image/*" onChange={(e)=>handleChange(e)}/>
            <button onClick={handleUpload}>Submit</button>
            {/* <p>{images}</p> */}
            <p>{error}</p>
           
        </div>
        
    )
}

export default RoomImageUpload;