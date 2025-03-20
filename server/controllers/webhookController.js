import { Webhook } from "svix";
import { supabaseClient } from "../config/supabaseClient.js";

const createUser = async (userData) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { data, error } = await supabase.from("users").insert({
      user_Id: userData.id,
      email: userData.email_addresses[0].email_address,
      first_name: userData.first_name,
      last_name: userData.last_name,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
const addUser = async (req, res) => {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are no headers, error out
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

    if (!id || !email_addresses) {
      return void res.status(400).json({
        success: false,
        message: "Error: Missing data",
      });
    }

    //create user in supabase
    createUser({
      id,
      email: email_addresses[0].email_address,
      first_name,
      last_name,
    });

    return void res.status(200).json({
      success: true,
      message: "User created",
    });
  }
};

export default addUser;
