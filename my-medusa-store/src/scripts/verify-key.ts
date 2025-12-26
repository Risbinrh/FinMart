
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function verifyKey({ container }: ExecArgs) {
    const apiKeyModule = container.resolve(Modules.API_KEY);

    const KEY_TOKEN = "pk_29ad5c8484d4c921263d4ff04e2a02f80c383ab162bdd01be78cebbf";

    // 1. Find the key
    const apiKeys = await apiKeyModule.listApiKeys({
        type: "publishable",
    });

    const targetKey = apiKeys.find(k => k.token === KEY_TOKEN);

    if (!targetKey) {
        console.log("ERROR: Key NOT found in backend!");
        return;
    }
    console.log(`Key Found: ${targetKey.id} (${targetKey.title})`);
    console.log(`Sales Channels linked: (fetching details...)`);

    // 2. We need to check the link. 
    // ApiKeyDTO usually doesn't have sales_channels expanded unless requested.
    // But listApiKeys might not support relations in all versions.
    // Let's try retrieving with relations if possible, or querying the link.

    const keyWithSc = await apiKeyModule.retrieveApiKey(targetKey.id, {
        relations: ["sales_channels"]
    });

    if (keyWithSc.sales_channels && keyWithSc.sales_channels.length > 0) {
        console.log("SUCCESS: Linked Sales Channels:");
        keyWithSc.sales_channels.forEach(sc => console.log(` - ${sc.name} (${sc.id})`));
    } else {
        console.log("FAILURE: No Sales Channels linked to this key!");

        // Attempt to list all links for debugging if needed, but for now just report status.
    }
}
