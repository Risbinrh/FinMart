
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function checkProductSc({ container }: ExecArgs) {
    const remoteLink = container.resolve(Modules.LINK);
    const productModule = container.resolve(Modules.PRODUCT);

    const products = await productModule.listProducts({ take: 5 });
    console.log(`Checking ${products.length} products...`);

    for (const p of products) {
        const links = await remoteLink.list({
            [Modules.PRODUCT]: { product_id: p.id }
        });

        console.log(`Product: ${p.title} (${p.id})`);
        links.forEach(l => {
            // The link object structure might vary, but usually has the linked module and its ID
            // e.g. { sales_channel_id: "...", product_id: "..." } if it's a direct link table
            // or nested. Let's print the whole key/value pairs that look like IDs.
            console.log(` - Linked: ${JSON.stringify(l)}`);
        });
    }
}
