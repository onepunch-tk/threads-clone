import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { internal } from "@/convex/_generated/api";

const http = httpRouter();

type ClerkWebhookData = {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: Array<{
      id: string;
      email_address: string;
      created_at: number;
      updated_at: number;
      verification: {
        status: string;
        strategy: string;
        attempts: null | number;
        expire_at: null | number;
      };
    }>;
    image_url: string;
    profile_image_url: string;
    username: string | null;
    created_at: number;
    updated_at: number;
    banned: boolean;
    external_accounts: Array<{
      id: string;
      email_address: string;
      username: string | null;
      first_name: string;
      last_name: string;
      picture: string;
      facebook_id?: string;
    }>;
    primary_email_address_id: string;
    private_metadata: Record<string, any>;
    public_metadata: Record<string, any>;
    unsafe_metadata: Record<string, any>;
  };
  object: string;
  type: "user.created" | "user.updated" | "user.deleted";
  timestamp: number;
};

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  // implementation will be here
  const { data, type } = (await request.json()) as ClerkWebhookData;

  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
        username: data.username,
        followersCount: 0,
      });
      break;
    case "user.deleted":
      console.log("user.deleted");
      break;
    case "user.updated":
      console.log("user.updated");
      break;
    default:
      console.log("unknown type");
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

//https://judicious-crane-958.convex.cloud
//https://judicious-crane-958.convex.site/clerk-users-webhook
export default http;
