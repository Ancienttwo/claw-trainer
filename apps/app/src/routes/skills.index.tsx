import { createFileRoute } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalText } from "../components/ui/terminal-text"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { SkillGrid } from "../components/skills/skill-grid"
import { SkillUploadForm } from "../components/skills/skill-upload-form"
import { useSkills } from "../hooks/use-skills"
import { useI18n } from "../i18n"
import { useAccount } from "wagmi"

function SkillsHeader() {
  const { data: skills, isLoading } = useSkills()
  const { t } = useI18n()

  return (
    <div className="mb-10 space-y-2">
      <h1 className="font-pixel text-xl text-amber">{t.skills.title}</h1>
      {isLoading ? (
        <TerminalLoader text={t.skills.fetching} />
      ) : (
        <TerminalText color="green">
          &gt; {t.skills.subtitle} ({skills?.length ?? 0} available)
        </TerminalText>
      )}
    </div>
  )
}

function SkillsPage() {
  const { isConnected } = useAccount()

  return (
    <GridBackground>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SkillsHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkillGrid />
          </div>
          <div>
            {isConnected && <SkillUploadForm />}
          </div>
        </div>
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/skills/")({
  component: SkillsPage,
})
