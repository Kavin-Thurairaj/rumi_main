import axiosClient from "./rumi_client";

const imageApi = {

    uploadImage: (images, room_id, authToken) => {
        const formData = new FormData();

        Array.from(images).forEach((image) => {
            formData.append("image", image);
        });

        return axiosClient.post(`/rooms/${room_id}/images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${authToken}`
            }
        });
    },

    getImage: (room_id) => {
        return axiosClient.get(`/rooms/${room_id}/images`);
    }
};

export default imageApi;
