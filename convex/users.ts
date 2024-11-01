//async getAllUsers
import { internalMutation, query } from "./_generated/server";
import { User } from "@/convex/schema";

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const createUser = internalMutation({
  args: User,
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      username: args.username || `${args.first_name}${args.last_name}`,
    });
  },
});
