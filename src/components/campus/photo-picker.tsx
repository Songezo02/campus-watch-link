import { useRef, useState } from "react";
import { Camera, ImageUp, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export function PhotoPicker({
  value,
  onChange,
  tone = "primary",
  hint,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  tone?: "primary" | "success";
  hint?: string;
}) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file?: File | null) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/") || !ALLOWED.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG or WEBP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large. Please choose a file under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError("Could not read that image. Please try again.");
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result.startsWith("data:image/")) {
        setError("That file is not a valid image.");
        return;
      }
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const ring = tone === "success" ? "bg-success-soft text-success" : "bg-primary-soft text-primary";

  return (
    <div className="flex flex-col items-center">
      <div className={`flex size-24 items-center justify-center overflow-hidden rounded-full ${ring}`}>
        {value ? (
          <img src={value} alt="Selected profile photo preview" className="size-full object-cover" />
        ) : (
          <Camera className="size-8" />
        )}
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="mt-3 flex gap-2">
        {value ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-xl"
              onClick={() => cameraRef.current?.click()}
            >
              <RefreshCw className="size-4" /> Retake
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                setError(null);
                onChange("");
              }}
            >
              <Trash2 className="size-4" /> Remove
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-xl"
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="size-4" /> Capture
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-xl"
              onClick={() => uploadRef.current?.click()}
            >
              <ImageUp className="size-4" /> Upload
            </Button>
          </>
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-center text-[11px] text-emergency">
          {error}
        </p>
      ) : null}
      {hint && !error ? (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
