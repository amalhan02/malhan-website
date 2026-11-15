// Public settings for the website. Everything here is safe to publish:
// the key is Supabase's *publishable* (anon) key, never a secret key.
window.MALHAN_SITE = {
  supabaseUrl: "https://ivongycdwxxpeurrhkpj.supabase.co",
  supabaseAnonKey: "sb_publishable_2_ydRdpAkqK36vePWyA3Aw_UFS81hiE",
  enquiryUrl: "https://ivongycdwxxpeurrhkpj.supabase.co/functions/v1/enquiry",
  turnstileSiteKey: "",   // owner fills in; when empty, skip loading Turnstile widget and send token ""
  appUrl: "https://amalhan02.github.io/malhan-trading-company/",

  // Switches the owner can flip in GitHub's editor:
  showRates: false,   // false = no prices anywhere ("Our products" list only); true = MRP per pack, "Today's rates"
  showStock: false,   // false = every product shows "Available"; true = real Available / Out of stock from the app
  enquiries: false    // false = no "Keep aside" buttons or booking form; true = farmers can send keep-aside requests
};
