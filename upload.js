import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { name, file } = req.body; // file = base64 dataURL
    const base64Data = file.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const filename = Date.now() + "-" + name;

    const { error } = await supabase.storage
      .from("uploads") // pastikan bucket bernama 'uploads'
      .upload(filename, buffer, {
        contentType: "application/octet-stream",
      });

    if (error) throw error;

    const { data } = supabase.storage.from("uploads").getPublicUrl(filename);

    res.json({ success: true, url: data.publicUrl });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}