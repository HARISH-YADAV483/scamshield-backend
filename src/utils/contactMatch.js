export const detectContactType = (input) => {
  if (!input) return "unknown";

  const v = input.toLowerCase().trim();

  if (v.includes("http") || v.includes("www.") || v.includes(".com")) return "url";
  if (v.includes("@")) return "email";
  if (/^\d{10,15}$/.test(v.replace(/\D/g, ""))) return "phone";
  if (v.includes("@upi")) return "upi";

  return "social";
};

export const normalizeContact = (input) => {
  if (!input) return "";

  let v = input.toLowerCase().trim();


  v = v.replace(/\s+/g, "");
  v = v.replace(/[-()]/g, "");

  if (v.startsWith("http")) {
    v = v.replace(/\/$/, "");
  }

  return v;
};