import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowUpRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@/components/slab'
import type { PortfolioProject } from '@/data/portfolio'
import { SCROLLER_ID } from '@/hooks/useLenis'

export default function ProjectPreview({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState(0)
  const [zoom, setZoom] = useState(1)
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
      className="project-preview"
      aria-labelledby="preview-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      data-lenis-prevent
    >
      <div className="project-preview__panel">
        <header className="project-preview__header">
          <button className="preview-control" onClick={onClose} autoFocus><ArrowLeft size={18} /> Back</button>
          <h2 id="preview-title">{project.title}</h2>
          <button className="preview-control preview-control--icon" onClick={onClose} aria-label="Close preview"><X size={20} /></button>
        </header>
        {!project.videoId && (
          <div className="project-preview__toolbar">
            <div className="project-preview__tabs" aria-label="Project views">
              {gallery.map((image, index) => (
                <button key={image.src} className="preview-control" aria-pressed={frame === index} onClick={() => { setFrame(index); setZoom(1); stageRef.current?.scrollTo({ top: 0, left: 0 }) }}>{image.label}</button>
              ))}
            </div>
            <div className="project-preview__zoom" aria-label="Image zoom">
              <button className="preview-control preview-control--icon" aria-label="Zoom out" disabled={zoom <= 0.5} onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}><MagnifyingGlassMinus size={18} /></button>
              <button className="preview-control" aria-label="Reset image zoom" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
              <button className="preview-control preview-control--icon" aria-label="Zoom in" disabled={zoom >= 2} onClick={() => setZoom(z => Math.min(2, z + 0.25))}><MagnifyingGlassPlus size={18} /></button>
            </div>
            {previewWidth && <span className="project-preview__pan-hint">Scroll to explore the image</span>}
          </div>
        )}
        <div ref={stageRef} tabIndex={0} role="region" aria-label="Scrollable project preview" className={`project-preview__stage${project.gallery && project.title === 'Restaurant App' ? ' project-preview__stage--phone' : ''}`}>
          {project.videoId ? (
            <div className="portfolio-video__frame">
              <iframe src={`https://www.youtube-nocookie.com/embed/${project.videoId}`} title={`${project.title} project demo`} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          ) : (
            <div className="project-preview__image" style={{ width: previewWidth ? `${previewWidth * zoom}px` : `${zoom * 100}%`, maxWidth: project.title === 'Restaurant App' ? `${600 * zoom}px` : undefined }}>
              <img src={gallery[frame].src} alt={gallery[frame].alt} />
            </div>
          )}
        </div>
        <footer className="project-preview__footer">
          <p>{project.gallery?.[frame].caption ?? project.details}</p>
          {project.external && <a className="preview-control" href={project.href} target="_blank" rel="noopener noreferrer">{project.linkLabel}<ArrowUpRight size={16} /></a>}
        </footer>
      </div>
    </dialog>,
    document.body,
  )
}
