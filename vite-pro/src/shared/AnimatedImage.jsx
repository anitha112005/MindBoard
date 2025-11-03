import ImageX from './ImageX.jsx'

export default function AnimatedImage({ src, alt, dir = 'center', duration = 18 }) {
  return (
    <div className={`kb kb-${dir}`} style={{ ['--kb-dur']: `${duration}s` }}>
      <ImageX src={src} alt={alt} width={1200} height={800} />
    </div>
  )
}