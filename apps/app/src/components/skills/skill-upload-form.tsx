import { useState, useRef, useCallback, type FormEvent, type DragEvent } from "react"
import { useSkillUpload } from "../../hooks/use-skills"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { Badge } from "../ui/badge"
import { useI18n } from "../../i18n"

const MAX_FILE_SIZE = 10 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function SkillUploadForm() {
  const { t } = useI18n()
  const upload = useSkillUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [tags, setTags] = useState("")
  const [version, setVersion] = useState("1.0.0")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  const validateAndSetFile = useCallback((f: File | undefined) => {
    if (!f) return
    if (!f.name.endsWith(".zip")) {
      setError(t.skills.zipOnly)
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError(t.skills.fileTooLarge)
      return
    }
    setError("")
    setFile(f)
  }, [t])

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    validateAndSetFile(e.dataTransfer.files[0])
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (!file) return setError(t.skills.fileRequired)
    if (!name.trim()) return setError(t.skills.nameRequired)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", name.trim())
    formData.append("description", description.trim())
    formData.append("price", String(price))
    formData.append("tags", tags.trim())
    formData.append("version", version.trim())
    upload.mutate(formData)
  }

  const inputClass = "w-full rounded-sm border border-border-subtle bg-surface-base px-2 py-1 font-mono text-xs text-text-primary"
  const labelClass = "mb-1 block font-pixel text-[8px] text-text-secondary"

  return (
    <PixelCard glow="cyan">
      <PixelCardHeader>{t.skills.uploadSkill}</PixelCardHeader>
      <PixelCardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={labelClass}>{t.skills.name} *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t.skills.description}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t.skills.price} (0 = {t.skills.free})</label>
              <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t.skills.version}</label>
              <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.skills.tags} (comma-separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
          </div>

          {/* Drop zone */}
          <div>
            <label className={labelClass}>{t.skills.file} *</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`w-full cursor-pointer rounded-sm border-2 border-dashed px-4 py-6 text-center transition-colors ${
                dragging
                  ? "border-accent-cyan bg-accent-cyan/10"
                  : file
                    ? "border-accent-terminal bg-accent-terminal/5"
                    : "border-border-subtle hover:border-accent-cyan/50"
              }`}
            >
              {file ? (
                <div className="space-y-1">
                  <p className="font-mono text-xs text-accent-terminal">{file.name}</p>
                  <p className="font-mono text-[10px] text-text-muted">{formatBytes(file.size)}</p>
                  <p className="font-pixel text-[8px] text-text-secondary">{t.skills.clickToReplace}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-pixel text-[8px] text-text-secondary">{t.skills.dropZoneHint}</p>
                  <p className="font-mono text-[10px] text-text-muted">.zip &middot; max 10MB</p>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
              className="hidden"
            />
          </div>

          {error && <Badge variant="coral" className="w-full justify-center">{error}</Badge>}
          {upload.isSuccess && <Badge variant="terminal" className="w-full justify-center">{t.skills.uploadSuccess}</Badge>}

          <PixelButton variant="primary" size="md" className="w-full" type="submit" disabled={upload.isPending}>
            {upload.isPending ? t.skills.uploading : t.skills.uploadSkill}
          </PixelButton>
        </form>
      </PixelCardContent>
    </PixelCard>
  )
}
