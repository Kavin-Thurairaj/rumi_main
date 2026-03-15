import axiosClient from  "./rumi_client"

const imageApi = {

    uploadImage: (images, room_id) => {
        const formData = new FormData();
        
        // files.forEach((file) => {
        //     formData.append("image", file);
        // });

        Array.from(images).forEach((image) => {
            formData.append("image", image);
        });

        var token = process.env.REACT_APP_ACCESS_TOKEN

        return axiosClient.post(`/rooms/${room_id}/images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization" : `Bearer ${token}`
            }
        });
    }
    ,
    getImage: (room_id) => {
        return axiosClient.get(`/rooms/${room_id}/images`);
    }


}

export default imageApi