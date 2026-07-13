const paths = {
  spa: 'M22 54c20-8 31-22 32-44 18 11 26 28 22 48-3 17-17 30-35 34-13-9-20-21-19-38Zm19 38c-5 14-14 24-27 30m27-30c12 11 26 16 43 15',
  dining: 'M32 18v46m16-46v46m-8 0v58m46-104v104m0-104c-16 7-24 20-24 39 0 13 7 22 24 25',
  leisure: 'M18 76c14-20 29-30 46-30s32 10 46 30M28 88h72M35 104h58M42 120h44M22 76c-4 22 6 39 29 51m59-51c4 22-6 39-29 51',
  local: 'M64 18c20 0 36 16 36 36 0 29-36 70-36 70S28 83 28 54c0-20 16-36 36-36Zm0 23a13 13 0 1 0 0 26 13 13 0 0 0 0-26Z',
  bed: 'M18 58h92c8 0 14 6 14 14v36M18 38v70m0-28h106M32 58V42c0-7 5-12 12-12h18c7 0 12 5 12 12v16m10 0V42c0-7 5-12 12-12h18c7 0 12 5 12 12v16',
  meeting: 'M20 92h88M32 36h64v40H32V36Zm16 56v24m32-24v24M46 116h36M24 20h80',
  offer: 'M28 24h44l28 28v52a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12Zm44 0v28h28M42 84l16 16 34-42',
  people: 'M44 56a18 18 0 1 0 0-36 18 18 0 0 0 0 36Zm40 0a18 18 0 1 0 0-36 18 18 0 0 0 0 36ZM16 112c4-26 18-40 42-40s38 14 42 40M58 78c8-4 16-6 26-6 24 0 38 14 42 40',
}

export default function Icon({ name = 'local', className = 'line-icon' }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <path d={paths[name] || paths.local} stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
