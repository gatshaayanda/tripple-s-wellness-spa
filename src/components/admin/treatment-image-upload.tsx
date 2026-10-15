"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { auth } from "@/lib/firebase/client";

type Props = { value: string; onChange: (url: string) => void; onError: (message: string) => void };

export default function TreatmentImageUpload({ value, onChange, onError }: Props) {
  const [localError, setLocalError] = useState("");
  const { startUpload, isUploading } = useUploadThing("treatmentImageUploader", {
    headers: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Your Admin session has expired. Sign in again before uploading.");
      return { Authorization: `Bearer ${token}` };
    },
    onClientUploadComplete: (files) => {
      const url = files[0]?.ufsUrl || files[0]?.url;
      if (!url) {
        const message = "Upload finished but no image URL was returned. Please try again.";
        setLocalError(message);
        onError(message);
        return;
      }
      onChange(url);
      setLocalError("");
    },
    onUploadError: (error) => {
      const message = error.message || "The image could not be uploaded. Check your connection and try again.";
      setLocalError(message);
      onError(message);
    },
  });

  async function chooseFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      const message = "Choose an image file (JPG, PNG, WebP or another supported image type).";
      setLocalError(message);
      onError(message);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      const message = "Choose an image smaller than 4 MB.";
      setLocalError(message);
      onError(message);
      return;
    }
    setLocalError("");
    try {
      const uploaded = await startUpload([file]);
      if (!uploaded?.length) {
        const message = "No image was uploaded. Please try again.";
        setLocalError(message);
        onError(message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "The image could not be uploaded.";
      setLocalError(message);
      onError(message);
    }
  }

  return <div className="treatmentUploadControl">
    {value ? <img className="treatmentUploadPreview" src={value} alt="Treatment image preview" /> : <div className="treatmentUploadEmpty"><strong>No treatment photo selected</strong><span>Upload an approved clinic image up to 4 MB.</span></div>}
    <div className="treatmentUploadActions">
      <label className="button buttonLight">{isUploading ? "Uploading image…" : value ? "Replace image" : "Upload image"}<input type="file" accept="image/*" hidden disabled={isUploading} onChange={event => void chooseFile(event)} /></label>
      {value && <button type="button" className="button buttonLight" disabled={isUploading} onClick={() => { onChange(""); setLocalError(""); }}>Remove image</button>}
      {isUploading && <span className="treatmentUploadStatus" role="status">Uploading securely… keep this screen open.</span>}
    </div>
    {localError && <p role="alert" className="formError">{localError}</p>}
    <p className="treatmentUploadStatus">The photo is attached when you save this treatment. Removing it here clears the catalogue image; it does not delete the file from UploadThing storage.</p>
  </div>;
}
