export default function YoutubeDemo() {
  return (
    <div className="portfolio-video">
      <div className="portfolio-video__copy">
        <span className="pgrid__eyebrow">Project video</span>
        <h2>FU Media — AI-powered file management</h2>
        <p>
          A demo of my Foundation University capstone project: a media file
          manager with AI-assisted classification, automated tags, and keyword
          search.
        </p>
        <a
          className="portfolio-video__link"
          href="https://www.youtube.com/watch?v=Q8s3rW9jc6Q"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on YouTube
        </a>
      </div>
      <div className="portfolio-video__frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/Q8s3rW9jc6Q"
          title="FU Media AI-powered file management system demo"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}
