import { useMemo } from 'react'

/**
 * ToolsMarquee
 *
 * A horizontally scrolling strip of tools from Adam's resume and projects.
 * The strip lives on the cream shader page, NOT inside a dark section.
 *
 * The list is duplicated to make the marquee loop seamlessly. The moving
 * track is hidden from assistive technology; a static list provides the
 * accessible tool names.
 */

type Tool = {
  name: string
  mark: string
}

const tools: Tool[] = [
  { name: 'n8n', mark: 'n8n' },
  { name: 'WordPress', mark: 'W' },
  { name: 'Python', mark: 'Py' },
  { name: 'OpenCV', mark: 'CV' },
  { name: 'YOLO', mark: 'Y' },
  { name: 'GoDaddy', mark: 'Go' },
]

export default function ToolsMarquee() {
  // Duplicate the list so the -50% translate lands on a seamless seam.
  // useMemo keeps the doubled array reference-stable across renders.
  const doubled = useMemo(() => [...tools, ...tools], [])

  return (
    <section className="tools-marquee" aria-label="Tools I work with" data-reveal>
      <div className="tools-marquee__track" aria-hidden="true">
        {doubled.map((tool, i) => (
          <div key={`${tool.name}-${i}`} className="tools-marquee__item">
            <span className="tools-marquee__tile">
              <span className="tools-marquee__mark" aria-hidden="true">{tool.mark}</span>
            </span>
            <span className="tools-marquee__label">{tool.name}</span>
          </div>
        ))}
      </div>

      {/* Real semantic list for screen readers, dedupes the visual loop. */}
      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </section>
  )
}
