import { useState, type FormEvent } from "react"
import { useSkillUpload } from "../../hooks/use-skills"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { Badge } from "../ui/badge"
import { useI18n } from "../../i18n"

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function SkillUploadForm() {
  const { t } = useI18n()
  const upload = useSkillUpload()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [tags, setTags] = useState("")
  const [version, setVersion] = useState("1.0.0")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (!file) return setError("File required")
    if (file.size > MAX_FILE_SIZE) return setError("File too large (max 10MB)")
    if (!name.trim()) return setError("Name required")

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
            <label className={labelClass}>{t.skills.name}</label>
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
          <div>
            <label className={labelClass}>{t.skills.file}</label>
            <input type="file" accept=".zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="font-mono text-xs text-text-secondary" />
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
