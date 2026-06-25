"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  return { supabase, user };
}

// Save = cheap flip from draft → saved. Called from the Generator (client).
export async function saveSlideshow(id: string): Promise<{ ok: boolean }> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("slideshows")
    .update({ status: "saved" })
    .eq("id", id); // RLS scopes to the owner
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/slideshows");
  return { ok: true };
}

export async function renameSlideshow(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const title =
    String(formData.get("title") ?? "").trim() || "Untitled slideshow";
  const { error } = await supabase
    .from("slideshows")
    .update({ title })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/slideshows/${id}`);
  revalidatePath("/dashboard/slideshows");
}

export async function deleteSlideshow(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") ?? "");

  // Remove Storage objects under `${userId}/${id}/` first.
  const prefix = `${user.id}/${id}`;
  const { data: files } = await supabase.storage
    .from("slideshows")
    .list(prefix);
  if (files && files.length > 0) {
    await supabase.storage
      .from("slideshows")
      .remove(files.map((f) => `${prefix}/${f.name}`));
  }

  // Delete the row (cascades to slides).
  const { error } = await supabase.from("slideshows").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/slideshows");
  redirect("/dashboard/slideshows");
}
