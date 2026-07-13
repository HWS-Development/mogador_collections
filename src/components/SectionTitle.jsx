export default function SectionTitle({ chapter, title, text, light = false, align = 'left' }) {
  return (
    <div className={`section-title reveal ${light ? 'section-title--light' : ''} section-title--${align}`}>
      {chapter ? <span className="chapter">{chapter}</span> : null}
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  )
}
