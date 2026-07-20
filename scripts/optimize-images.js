import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const imgDir = './public/images'
const files = fs.readdirSync(imgDir)

async function run() {
  console.log('Starting image WebP conversion...')
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const inputPath = path.join(imgDir, file)
      const outputPath = path.join(imgDir, file.replace(new RegExp(`${ext}$`, 'i'), '.webp'))
      
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath)
        
        const inputStat = fs.statSync(inputPath)
        const outputStat = fs.statSync(outputPath)
        const diffKB = Math.round((inputStat.size - outputStat.size) / 1024)
        const percent = Math.round((1 - (outputStat.size / inputStat.size)) * 100)
        
        console.log(`Converted: ${file} -> ${path.basename(outputPath)} (${percent}% reduction, saved ${diffKB} KB)`)
      } catch (err) {
        console.error(`Error converting ${file}:`, err)
      }
    }
  }
  console.log('Conversion complete!')
}

run()
