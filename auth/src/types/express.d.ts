import type { UserDoc } from "../models/user.js";

declare global {
  namespace Express {
    interface Request {
      /**
       * Populated by the `requireAuth` middleware after verifying the JWT.
       * Contains the authenticated Mongoose user document (passwordHash stripped by toJSON).
       */
      currentUser?: UserDoc;
    }
  }
}
