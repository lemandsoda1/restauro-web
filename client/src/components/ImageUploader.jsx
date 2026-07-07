import { useState, useRef } from "react";
import { Icon } from "../ds";

export default function ImageUploader({ files, setFiles }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (newFiles) => {
    const images = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images].slice(0, 10));
  };
  const removeFile = (index) => setFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div>
      <div
        className={`rst-uploader${dragOver ? " rst-uploader--drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <Icon name="upload" size={26} style={{ color: "var(--royal-500)", margin: "0 auto 10px" }} />
        <div style={{ fontFamily: "var(--font-grotesque)", fontWeight: 600, fontSize: 15, color: "var(--text)" }}>
          Bilder hierher ziehen oder klicken
        </div>
        <div className="rst-uploader__hint">JPG, PNG, WebP · max. 10 Bilder, je 10 MB</div>
      </div>

      {files.length > 0 && (
        <div className="rst-thumbs">
          {files.map((file, i) => (
            <div key={i} className="rst-thumb">
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <button type="button" className="rst-thumb__x" aria-label="Entfernen" onClick={() => removeFile(i)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
