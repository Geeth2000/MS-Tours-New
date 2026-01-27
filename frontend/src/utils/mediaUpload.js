import { createClient } from "@supabase/supabase-js";

// Use environment variables for security
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(url, key);

export default function uploadfile(file) {
  return new Promise((resolve, reject) => {
    // Create a unique file name to prevent overwriting
    const timeStamp = Date.now();
    // Sanitize filename to remove spaces/special chars
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${timeStamp}-${sanitizedFileName}`;

    supabase.storage
      .from("images") // Make sure you created a bucket named 'images' in Supabase
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(({ data, error }) => {
        if (error) {
          reject(error);
          return;
        }
        // Get the public URL
        const { data: publicData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        resolve(publicData.publicUrl);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
