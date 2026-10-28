/** vite-imagetools `as=picture` output: one srcset per format plus a fallback <img>. */
interface ImagePicture {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

declare module '*&as=picture' {
  const picture: ImagePicture
  export default picture
}
