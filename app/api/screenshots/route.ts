import { readdir } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images', 'screenshots')
    const files = await readdir(imagesDir)
    
    const screenshots = files
      .filter(file => /\.(png|jpe?g|webp|gif)$/i.test(file))
      .sort((a, b) => {
        // Sort theo số nếu file có dạng 1.webp, 2.webp
        const numA = parseInt(a.match(/\d+/)?.[0] || '0')
        const numB = parseInt(b.match(/\d+/)?.[0] || '0')
        return numA - numB
      })
      .map((file, index) => {
        // Tạo title từ tên file
        const nameWithoutExt = file.replace(/\.(png|jpe?g|webp|gif)$/i, '')
        const title = nameWithoutExt
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
        
        return {
          id: index + 1,
          image: `/images/screenshots/${file}`
        }
      })
    
    return NextResponse.json(screenshots)
  } catch (error) {
    console.error('Error reading screenshots:', error)
    return NextResponse.json([])
  }
}