"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const businessName = String(formData.get("business_name") ?? "");

  if (!email || !password) {
    redirect(
      "/signup?error=" + encodeURIComponent("Email and password are required."),
    );
  }

  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret || secret.includes("REPLACE_ME")) {
    redirect(
      "/signup?error=" +
        encodeURIComponent(
          "Signups need SUPABASE_SECRET_KEY in .env.local (then restart the dev server) — or create a user in the Supabase dashboard and log in.",
        ),
    );
  }

  // Create an already-confirmed user via the Admin API (sends NO email, so it
  // can't hit email confirmation / rate limits), then sign them in so the
  // session cookie is set.
  const admin = createAdminClient();
  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { business_name: businessName },
  });
  if (createErr) {
    redirect(`/signup?error=${encodeURIComponent(createErr.message)}`);
  }

  const supabase = await createClient();
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr) {
    redirect(`/login?error=${encodeURIComponent(signInErr.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
