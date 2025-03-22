const getUserProfile = async (supabase, userId) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("language")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return profile;
};

export { getUserProfile };
