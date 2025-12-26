
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows";

export default async function fixApiKey({ container }: ExecArgs) {
    const apiKeyModule = container.resolve(Modules.API_KEY);
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);

    const KEY_TOKEN = "pk_8cc1109893df8c6870064cf64bbff283e";

    // 1. Find by Title
    const apiKeysByTitle = await apiKeyModule.listApiKeys({
        title: "FreshCatch Storefront",
    });

    let targetKey = apiKeysByTitle.length > 0 ? apiKeysByTitle[0] : null;

    if (!targetKey) {
        // Fallback to listing all
        const allKeys = await apiKeyModule.listApiKeys({});
        targetKey = allKeys.find(k => k.token === KEY_TOKEN);
    }

    if (!targetKey) {
        console.log("CRITICAL ERROR: Could not find key by Title or Token!");
        return;
    }
    const keyId = targetKey.id;
    console.log(`Found Key ID: ${keyId} (Title: ${targetKey.title})`);

    // 2. Get Default Sales Channel
    const salesChannels = await salesChannelModule.listSalesChannels({
        name: "Default Sales Channel" // Trying standard name, or just take first one
    });

    let scId = "";
    if (salesChannels.length > 0) {
        scId = salesChannels[0].id;
        console.log(`Found Sales Channel: ${salesChannels[0].name} (${scId})`);
    } else {
        // Just list all and take first
        const allSc = await salesChannelModule.listSalesChannels({});
        if (allSc.length > 0) {
            scId = allSc[0].id;
            console.log(`Fallback: Using first available Sales Channel: ${allSc[0].name} (${scId})`);
        } else {
            console.log("ERROR: No Sales Channels found!");
            return;
        }
    }

    // 3. Link them
    console.log("Linking Sales Channel to API Key...");

    try {
        await linkSalesChannelsToApiKeyWorkflow(container).run({
            input: {
                id: keyId,
                sales_channel_ids: [scId]
            }
        });
        console.log("SUCCESS: Key linked to Sales Channel.");
    } catch (e) {
        console.error("Workflow Error:", e);
    }
}
