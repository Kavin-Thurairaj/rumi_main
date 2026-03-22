import axiosClient from "./rumi_client";

const roomFilterApi = {
    searchRooms: (filters = {}, page = 0, size = 10) => {
        const params = new URLSearchParams();

        if (filters.city) params.append("city", filters.city);
        if (filters.country) params.append("country", filters.country);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.genderAllowed) params.append("genderAllowed", filters.genderAllowed.toUpperCase());
        if (filters.roomStatus) params.append("roomStatus", filters.roomStatus);
        if (filters.roomType) params.append("roomType", filters.roomType);

        params.append("page", page);
        params.append("size", size);

        return axiosClient.get(`/rooms/search?${params.toString()}`);
    },

    getAvailableRooms: (page = 0, size = 10) => {
        return axiosClient.get(`/rooms/available?page=${page}&size=${size}`);
    },

    getRoomCount: () => {
        return axiosClient.get(`/rooms/count`);
    }
};

export default roomFilterApi;