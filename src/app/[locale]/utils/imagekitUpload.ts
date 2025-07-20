
// app/[locale]/utils/uploadImageToImageKit.ts
"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
  upload,
} from "@imagekit/next";

/**
 * Uploads an image file to ImageKit and returns the uploaded image URL.
 * @param file The image File to be uploaded
 * @returns {Promise<string | null>} The uploaded image URL, or null if failed
 */
export async function uploadImageToImageKit(file: File): Promise<string | null> {
  try {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed auth: ${errText}`);
    }

    const { signature, token, expire, publicKey } = await res.json();
    
    const result = await upload({
      file,
      fileName: file.name,
      signature,
      token,
      expire,
      publicKey,
      onProgress: (e) => {
        console.log(`Upload Progress: ${((e.loaded / e.total) * 100).toFixed(2)}%`);
      },
    });

    return result?.url ?? null;
  } catch (error) {
    if (error instanceof ImageKitAbortError) {
      console.error("Upload aborted:", error.reason);
    } else if (error instanceof ImageKitInvalidRequestError) {
      console.error("Invalid upload request:", error.message);
    } else if (error instanceof ImageKitUploadNetworkError) {
      console.error("Network error during upload:", error.message);
    } else if (error instanceof ImageKitServerError) {
      console.error("Server error:", error.message);
    } else {
      console.error("Unexpected upload error:", error);
    }
    return null;
  }
}
