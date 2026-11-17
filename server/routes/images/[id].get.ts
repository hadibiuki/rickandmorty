import sharp from 'sharp'
import { Buffer } from 'node:buffer'

const loadImage = defineCachedFunction(async (id: string) => {
  const bytes = await $fetch<ArrayBuffer>(`https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`, { responseType: 'arrayBuffer', retry: 0 })
  const image = await sharp(Buffer.from(bytes)).resize(300, 300, { withoutEnlargement: true }).webp({ quality: 75 }).toBuffer()
  return image.toString('base64')
}, { maxAge: 86400, name: 'character-images', getKey: (id: string) => id })

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  if (!/^\d+$/.test(id)) throw createError({ statusCode: 404 })
  const image = await loadImage(id)
  setHeader(event, 'Content-Type', 'image/webp')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return Buffer.from(image, 'base64')
})
