
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows";

export default async function createNewKey({ container }: ExecArgs) {
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);

    // 1. Get Default Sales Channel
    const salesChannels = await salesChannelModule.listSalesChannels({});
    if (salesChannels.length === 0) {
        console.log("ERROR: No Sales Channels found!");
        return;
    }
    const scId = salesChannels[0].id; // Default SC usually first
    console.log(`Using Sales Channel: ${salesChannels[0].name} (${scId})`);

    // 2. Create New Key
    console.log("Creating new publishable key...");
    const { result } = await createApiKeysWorkflow(container).run({
        input: {
            api_keys: [
                {
                    title: "FreshCatch Storefront New",
                    type: "publishable",
                    created_by: "script"
                }
            ]
        }
    });

    const newKey = result[0];
    console.log(`Created New Key: ${newKey.token} (${newKey.id})`);

    // 3. Link to Sales Channel
    console.log("Linking to Sales Channel...");
    await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
            id: newKey.id,
            sales_channel_ids: [scId]
        }
    });

    console.log("SUCCESS_NEW_KEY::" + newKey.token + "::END_KEY");
}
