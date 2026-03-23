import supabase from './supabaseClient';

const roomSharePostApi = {

    getAllPosts: async () => {
        console.log("Supabase URL:", process.env.REACT_APP_SUPABASE_URL);
        const { data, error } = await supabase
            .from('room_share_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    createPost: async (post) => {
        console.log("Creating post:", post);
        const { data, error } = await supabase
            .from('room_share_posts')
            .insert([post])
            .select();
        if (error) throw error;
        return data;
    },

    filterPosts: async (filters) => {
        let query = supabase
            .from('room_share_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.genderPreference) {
            query = query.eq('gender_preference', filters.genderPreference);
        }
        if (filters.maxRent) {
            query = query.lte('rent_per_person', filters.maxRent);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }
};

export default roomSharePostApi;