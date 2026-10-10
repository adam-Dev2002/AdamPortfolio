import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowUpRight, X } from '@/components/slab'
import ImageLightbox from './ImageLightbox'
import type { PortfolioProject } from '@/data/portfolio'
import { SCROLLER_ID } from '@/hooks/useLenis'

export default function ProjectPreview({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fullscreenTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [frame, setFrame] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const gallery = project.gallery ?? [{ src: project.imageSrc!, alt: project.imageAlt ?? project.title, label: 'Preview' }]
  const previewWidth = gallery[frame].previewWidth ?? project.previewWidth

  useEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement as HTMLElement | null
    const panel = document.getElementById(SCROLLER_ID)
    const root = document.documentElement
    const rootOverflow = root.style.overflow
    const rootBehavior = root.style.scrollBehavior
    const bodyPosition = document.body.style.position
    const bodyTop = document.body.style.top
    const bodyWidth = document.body.style.width
    const mobile = window.innerWidth < 1100
    const scrollY = window.scrollY
    const bodyOverflow = document.body.style.overflow
    const panelOverflow = panel?.style.overflow
    document.body.style.overflow = 'hidden'
    root.style.overflow = 'hidden'
    root.style.scrollBehavior = 'auto'
    if (mobile) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    }
    if (panel) panel.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = bodyOverflow
      document.body.style.position = bodyPosition
      document.body.style.top = bodyTop
      document.body.style.width = bodyWidth
      root.style.overflow = rootOverflow
      if (panel) panel.style.overflow = panelOverflow ?? ''
      if (mobile) window.scrollTo({ top: scrollY, behavior: 'instant' })
      root.style.scrollBehavior = rootBehavior
      trigger?.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`project-preview${fullscreen ? ' project-preview--fullscreen' : ''}`}
      aria-labelledby="preview-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      data-lenis-prevent
    >
      <div className="project-preview__panel" style={{ display: fullscreen ? 'none' : undefined }}>
        <header className="project-preview__header">
          <button className="preview-control" onClick={onClose} autoFocus><ArrowLeft size={18} /> Back</button>
          <h2 id="preview-title">{project.title}</h2>
          <button className="preview-control preview-control--icon" onClick={onClose} aria-label="Close preview"><X size={20} /></button>
        </header>
        {!project.videoId && (
          <div className="project-preview__toolbar">
            <div className="project-preview__tabs" aria-label="Project views">
              {gallery.map((image, index) => (
                <button key={image.src} className="preview-control" aria-pressed={frame === index} onClick={() => { setFrame(index); stageRef.current?.scrollTo({ top: 0, left: 0 }) }}>{image.label}</button>
              ))}
            </div>
            <button className="preview-control" onClick={event => { fullscreenTriggerRef.current = event.currentTarget; setFullscreen(true) }}>Open fullscreen</button>
            <span className="project-preview__pan-hint">Click the image to open fullscreen</span>
          </div>
        )}
        <div ref={stageRef} tabIndex={0} role="region" aria-label="Scrollable project preview" className={`project-preview__stage${project.gallery && project.title === 'Restaurant App' ? ' project-preview__stage--phone' : ''}`}>
          {project.videoId ? (
            <div className="portfolio-video__frame">
              <iframe src={`https://www.youtube-nocookie.com/embed/${project.videoId}`} title={`${project.title} project demo`} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          ) : (
            <div className="project-preview__image" style={{ width: previewWidth ? `${previewWidth}px` : '100%', maxWidth: project.title === 'Restaurant App' ? '600px' : undefined }}>
              <button className="project-preview__open-image" aria-label={`Open ${gallery[frame].label} image fullscreen`} onClick={event => { fullscreenTriggerRef.current = event.currentTarget; setFullscreen(true) }}>
                <img src={gallery[frame].src} alt={gallery[frame].alt} />
              </button>
            </div>
          )}
        </div>
        <footer className="project-preview__footer">
          <p>{project.gallery?.[frame].caption ?? project.details}</p>
          {project.external && <a className="preview-control" href={project.href} target="_blank" rel="noopener noreferrer">{project.linkLabel}<ArrowUpRight size={16} /></a>}
        </footer>
      </div>
      {fullscreen && <ImageLightbox src={gallery[frame].src} alt={gallery[frame].alt} title={`${project.title} · ${gallery[frame].label}`} returnFocus={fullscreenTriggerRef.current} onClose={() => setFullscreen(false)} />}
    </dialog>,
    document.body,
  )
}
