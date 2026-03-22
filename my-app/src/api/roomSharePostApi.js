import supabase from './supabaseClient';

const roomSharePostApi = {

    // Get all posts
    getAllPosts: async () => {
        const { data, error } = await supabase
            .from('room_share_posts')
            .select('*')
            .order('posted_date', { ascending: false });
        if (error) throw error;
        return data;
    },

    // Create a new post
    createPost: async (post) => {
        const { data, error } = await supabase
            .from('room_share_posts')
            .insert([post])
            .select();
        if (error) throw error;
        return data;
    },

    // Filter posts
    filterPosts: async (filters) => {
        let query = supabase
            .from('room_share_posts')
            .select('*')
            .order('posted_date', { ascending: false });

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