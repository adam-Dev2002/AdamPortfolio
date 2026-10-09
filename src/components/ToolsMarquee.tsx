/**
 * ToolsMarquee
 *
 * A wrapping list of tools with colored brand icons. Each tool appears
 * once, so labels stay visible with enlarged text or reduced motion.
 */

type Tool = {
  name: string
  icon: string
  description?: string
}

const tools: Tool[] = [
  { name: 'n8n', icon: 'n8n' },
  { name: 'WordPress', icon: 'wordpress' },
  { name: 'Python', icon: 'python' },
  { name: 'OpenCV', icon: 'opencv' },
  { name: 'YOLO', icon: 'yolo' },
  { name: 'GoDaddy', icon: 'godaddy' },
  { name: 'Vercel', icon: 'vercel', description: 'Vercel — project deployment' },
]

export default function ToolsMarquee() {
  return (
    <section className="tools-marquee" aria-label="Tools I work with" data-reveal>
      <ul className="tools-marquee__track">
        {tools.map((tool) => (
          <li key={tool.name} className="tools-marquee__item" title={tool.description ?? tool.name}>
            <span className="tools-marquee__tile">
              <img className="tools-marquee__img" src={`/icons/tools/${tool.icon}.svg`} alt="" width={24} height={24} />
            </span>
            <span className="tools-marquee__label">{tool.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
