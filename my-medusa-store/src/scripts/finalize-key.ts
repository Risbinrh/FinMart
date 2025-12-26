import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows";

export default async function finalizeKey({ container }: ExecArgs) {
    const apiKeyModule = container.resolve(Modules.API_KEY);
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);

    // 1. Get Key
    const apiKeys = await apiKeyModule.listApiKeys({ title: "Direct Key 2" });
    if (apiKeys.length === 0) { console.log("ERROR: Key not found"); return; }
    const key = apiKeys[0];
    console.log(`Using Key: ${key.id}`);

    // 2. Get SC
    const scs = await salesChannelModule.listSalesChannels({});
    if (scs.length === 0) { console.log("ERROR: SC not found"); return; }
    const sc = scs[0];
    console.log(`Using SC: ${sc.id}`);

    // 3. Link via Workflow
    console.log("Linking via Workflow...");
    await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
            id: key.id,
            sales_channel_ids: [sc.id]
        }
    });

    console.log("SUCCESS_TOKEN::" + key.token + "::END_TOKEN");
}
