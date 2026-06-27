export const metadata = {
  title: "Privacy Policy — SlideShow AI",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-10 text-sm text-muted">Last updated: June 27, 2026</p>

      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className="mb-2 font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account (email address), content you generate through the Service (slideshow titles, captions, images), and TikTok OAuth credentials (access token, refresh token, TikTok open_id) when you connect your TikTok account.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information solely to provide and improve the Service — including authenticating your account, generating and storing your slideshows, and publishing content to TikTok on your behalf when you request it.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">3. TikTok Data</h2>
          <p>When you connect TikTok, we store only the credentials necessary to post on your behalf (open_id, access token, refresh token). We do not access your TikTok followers, messages, analytics, or any data beyond what is required to publish slideshows. You can disconnect TikTok at any time, which deletes your stored credentials from our system.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">4. Data Storage</h2>
          <p>Your data is stored securely using Supabase with row-level security. Images are stored in Supabase Storage and are accessible only to you. TikTok credentials are stored server-side and never exposed to the browser.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">5. Data Sharing</h2>
          <p>We do not sell or share your personal data with third parties except as required to provide the Service (e.g., OpenAI for caption generation, TikTok for content posting) or as required by law.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">6. Data Retention</h2>
          <p>We retain your data for as long as your account is active. You may delete your account and all associated data at any time by contacting us.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">7. Cookies</h2>
          <p>We use cookies only for session authentication (Supabase auth cookies) and short-lived OAuth state verification (TikTok CSRF protection). We do not use tracking or advertising cookies.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">8. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at slideshowai@gmail.com to make a request.</p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-foreground">9. Contact</h2>
          <p>Questions about this policy? Email slideshowai@gmail.com.</p>
        </div>
      </section>
    </main>
  );
}
