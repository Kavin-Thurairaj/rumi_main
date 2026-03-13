import { supabase } from "../supabaseClient"

export async function submitRating(userId, roomId, stars) {

  const { data, error } = await supabase
    .from("ratings")
    .insert([
      {
        user_id: userId,
        room_id: roomId,
        stars: stars
      }
    ])

  if (error) {
    console.error("Rating submission error:", error)
    return null
  }

  return data
}