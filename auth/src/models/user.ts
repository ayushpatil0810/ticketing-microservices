import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ─── Attribute interfaces (used by the static build() factory) ───────────────

interface UserAttrs {
  username: string;
  email: string;
  password: string;
}

// ─── Document interface (shape of a saved User document) ────────────────────

interface UserDoc extends mongoose.Document {
  /** Mongoose virtual alias for `_id`. */
  id: string;

  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

// ─── Model interface (adds static factory method) ───────────────────────────

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema<UserDoc, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    // Strip sensitive fields from any JSON serialization (responses, logs)
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      },
    },
  },
);

// ─── Pre-save hook: hash password before persisting ─────────────────────────

userSchema.pre("save", async function () {
  // Only re-hash if passwordHash was explicitly modified (first save or password change)
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// ─── Instance method: safe password comparison ───────────────────────────────

userSchema.methods["comparePassword"] = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash as string);
};

// ─── Static factory: enforces attribute typing at build time ─────────────────

userSchema.statics["build"] = (attrs: UserAttrs): UserDoc => {
  return new User({
    username: attrs.username,
    email: attrs.email,
    passwordHash: attrs.password,
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
export type { UserAttrs, UserDoc, UserModel };
