import dotenv from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

dotenv.config();

/**
 * Checks if an authenticated user is an admin. This middleware must be called
 * after authenticateToken
 * @param req
 * @param res
 * @param next
 * @returns
 */
const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const user = res.locals.user;

  // check if user is authenticated
  if (!user) {
    res.sendStatus(401);
    return;
  }

  // check if admin credentials are defined on server
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error("Admin credential are not defined");
    res.sendStatus(403);
    return;
  }

  // compare user credentials with admin credentials
  if (user.email !== process.env.ADMIN_EMAIL) {
    // emails do not match
    res.sendStatus(401);
    return;
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    // passwords do not match
    console.log("Attempted admin password is incorrect");
    res.sendStatus(401);
    return;
  }

  next();
};

export default authenticateAdmin;
