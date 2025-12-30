import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function removeOldImages({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)
  
  console.log("Fetching all products...")
  
  const products = await productService.listProducts({}, {
    relations: ["images"],
    take: 100
  })
  
  console.log(`Found ${products.length} products`)
  
  for (const product of products) {
    if (product.images && product.images.length > 0) {
      // Filter out old unsplash images
      const oldImages = product.images.filter(img => 
        img.url.includes('unsplash.com')
      )
      
      if (oldImages.length > 0) {
        console.log(`Removing ${oldImages.length} old images from: ${product.title}`)
        
        // Delete old images
        for (const img of oldImages) {
          await productService.deleteProductImages([img.id])
        }
      }
    }
  }
  
  console.log("Done! Old placeholder images removed.")
}
