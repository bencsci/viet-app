import { verifyToken } from "@clerk/express";

export default async function onboardingCheck(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const session = await verifyToken(token);
    if (!session || !session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.session = session;
    const metadata = session.sessionClaims?.metadata || {};

    if (!metadata.onboardingComplete) {
      return res.status(401).json({ message: "Onboarding not complete" });
    }

    next();
  } catch (error) {
    console.log("Error in onboardingCheck middleware", error);
    return res.status(401).json({ message: "Internal server error" });
  }
}
