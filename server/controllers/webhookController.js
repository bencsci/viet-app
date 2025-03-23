import { Webhook } from "svix";
import { supabaseAdmin } from "../config/supabaseClient.js";

const test = async (req, res) => {
  return res.json({ message: "The route is working" });
};

const createUser = async (userData) => {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase.from("profiles").insert({
      user_id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("profiles")
      .delete()
      .match({ user_id: userId });

    if (error) throw error;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const handleUsers = async (req, res) => {
  console.log("Received Clerk webhook");
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  const headers = req.headers;
  const payload = req.body;

  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return void res.status(400).json({
      success: false,
      message: "Error: Missing svix headers",
    });
  }

  let evt;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.log("Error: Could not verify webhook:", err.message);
    return void res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    console.log(
      "User created:",
      id,
      email_addresses[0].email_address,
      first_name,
      last_name
    );

    const email = email_addresses[0].email_address;
    if (!id || !email_addresses) {
      return void res.status(400).json({
        success: false,
        message: "Error: Missing data",
      });
    }

    try {
      await createUser({
        id,
        email,
        first_name,
        last_name,
      });

      return void res.status(200).json({
        success: true,
        message: "User created",
      });
    } catch (error) {
      return void res.status(500).json({
        success: false,
        message: "Error creating user in database",
        error: error.message,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return void res.status(400).json({
        success: false,
        message: "Error: Missing user ID",
      });
    }

    try {
      console.log("Deleting user:", id);  
      await deleteUser(id);
      return void res.status(200).json({
        success: true,
        message: "User deleted",
      });
    } catch (error) {
      return void res.status(500).json({
        success: false,
        message: "Error deleting user from database",
        error: error.message,
      });
    }
  }

  return void res.status(400).json({
    success: false,
    message: `Unhandled event type: ${eventType}`,
  });
};

export { test, handleUsers };
