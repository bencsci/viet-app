import { supabaseClient } from "../config/supabaseClient.js";

const getProfile = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from("profile")
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
      .from("profile")
      .update({ language: language })
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error listing conversations:", error);
    res.status(500).json({ error: "Failed to list conversations" });
  }
};

const updateDifficulty = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { difficulty } = req.body;

    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from("profile")
      .update({ difficulty: difficulty })
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error listing conversations:", error);
    res.status(500).json({ error: "Failed to list conversations" });
  }
};

export { getProfile, updateLanguage, updateDifficulty };
