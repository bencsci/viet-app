import { supabaseClient } from "../config/supabaseClient.js";

const getProfile = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error listing conversations:", error);
    res.status(500).json({ error: "Failed to list conversations" });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { language } = req.body;
    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from("profiles")
      .update({ language: language })
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error updating language:", error);
    res.status(500).json({ error: "Failed to update language" });
  }
};

const updateDifficulty = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { language_level } = req.body;
    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from("profiles")
      .update({ language_level: language_level })
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error updating difficulty:", error);
    res.status(500).json({ error: "Failed to update difficulty" });
  }
};

export { getProfile, updateLanguage, updateDifficulty };
