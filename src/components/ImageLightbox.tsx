import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@/components/slab'

const clampZoom = (value: number) => Math.min(8, Math.max(0.25, value))

export default function ImageLightbox({
  src,
  alt,
  title,
  onClose,
}: {
  src: string
  alt: string
  title: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [width, setWidth] = useState(0)
  const [zoom, setZoom] = useState(1)
  const zoomRef = useRef(1)
  const anchorRef = useRef<{ x: number; y: number; imageX: number; imageY: number } | null>(null)
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const imageGestureRef = useRef(false)

  function changeZoom(value: number, x?: number, y?: number) {
    const stage = stageRef.current!
    const image = imageRef.current!
    const rect = image.getBoundingClientRect()
    const bounds = stage.getBoundingClientRect()
    const next = clampZoom(value)
    if (next === zoomRef.current || !rect.width) return
    const pointX = x ?? bounds.left + bounds.width / 2
    const pointY = y ?? bounds.top + bounds.height / 2
    anchorRef.current = {
      x: pointX,
      y: pointY,
      imageX: (pointX - rect.left) / rect.width,
      imageY: (pointY - rect.top) / rect.height,
    }
    zoomRef.current = next
    setZoom(next)
  }

  function resetZoom() {
    anchorRef.current = null
    zoomRef.current = 1
    setZoom(1)
    stageRef.current?.scrollTo({ left: 0, top: 0 })
  }

  useEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement as HTMLElement | null
    dialog.showModal()
    const stage = stageRef.current!
    const measure = () => setWidth(Math.max(1, stage.clientWidth - 48))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      changeZoom(zoomRef.current * Math.exp(-event.deltaY * 0.002), event.clientX, event.clientY)
    }
    dialog.addEventListener('wheel', wheel, { passive: false })
    return () => {
      observer.disconnect()
      dialog.removeEventListener('wheel', wheel)
      dialog.close()
      trigger?.focus({ preventScroll: true })
    }
  }, [])

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor || !imageRef.current || !stageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    stageRef.current.scrollLeft += rect.left + anchor.imageX * rect.width - anchor.x
    stageRef.current.scrollTop += rect.top + anchor.imageY * rect.height - anchor.y
    anchorRef.current = null
  }, [zoom])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="image-lightbox"
      aria-label={`${title} fullscreen image`}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
    >
      <div className="image-lightbox__controls">
        <span className="image-lightbox__title">{title}</span>
        <div className="image-lightbox__actions">
          <button
            className="preview-control preview-control--icon"
            aria-label="Zoom out"
            disabled={zoom <= 0.25}
            onClick={() => changeZoom(zoomRef.current - 0.25)}
          >
            <MagnifyingGlassMinus size={20} />
          </button>
          <span className="image-lightbox__percentage" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="preview-control preview-control--icon"
            aria-label="Zoom in"
            disabled={zoom >= 8}
            onClick={() => changeZoom(zoomRef.current + 0.25)}
          >
            <MagnifyingGlassPlus size={20} />
          </button>
          <button className="preview-control" onClick={resetZoom}>
            Fit width
          </button>
          <button
            className="preview-control preview-control--icon"
            aria-label="Close fullscreen image"
            autoFocus
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
      </div>
      <div
        ref={stageRef}
        className="image-lightbox__stage"
        tabIndex={0}
        role="region"
        aria-label="Zoomable fullscreen image"
        onClick={(event) => {
          if (imageGestureRef.current) {
            imageGestureRef.current = false
            return
          }
          if (
            event.target === event.currentTarget ||
            (event.target as HTMLElement).classList.contains('image-lightbox__canvas')
          )
            onClose()
        }}
        onPointerDown={(event) => {
          if (
            event.pointerType !== 'mouse' ||
            event.button !== 0 ||
            event.target !== imageRef.current
          )
            return
          event.preventDefault()
          imageGestureRef.current = true
          dragRef.current = {
            x: event.clientX,
            y: event.clientY,
            left: event.currentTarget.scrollLeft,
            top: event.currentTarget.scrollTop,
          }
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.dataset.dragging = 'true'
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (drag)
            event.currentTarget.scrollTo({
              left: drag.left + drag.x - event.clientX,
              top: drag.top + drag.y - event.clientY,
            })
        }}
        onPointerUp={(event) => {
          dragRef.current = null
          delete event.currentTarget.dataset.dragging
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onLostPointerCapture={(event) => {
          dragRef.current = null
          delete event.currentTarget.dataset.dragging
        }}
      >
        <div className="image-lightbox__canvas">
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            draggable={false}
            style={{ width: width ? `${width * zoom}px` : '100%' }}
          />
        </div>
      </div>
      <p className="image-lightbox__hint">
        Ctrl + scroll to zoom · Drag or scroll to explore · Esc to close
      </p>
    </dialog>,
    document.body,
  )
}
