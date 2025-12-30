
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function verifyKeyLink({ container }: ExecArgs) {
    const apiKeyModule = container.resolve(Modules.API_KEY);

    // Try retrieving with relations? ApiKeyService might not support it directly in list.
    // But we can check if we can query links.

    // Find by Title to be safe
    const apiKeys = await apiKeyModule.listApiKeys({ title: "Direct Key 2" });
    if (apiKeys.length === 0) { console.log("Key NOT found!"); return; }
    const key = apiKeys[0];
    console.log(`Key Found: ${key.id}`);

    // Check RemoteLink?
    // If we can't resolve link module, we can't check links easily via script.
    // But we can try to resolve it.

    try {
        const remoteLink = container.resolve(Modules.LINK);
        console.log("Resolved Modules.LINK successfully.");

        const links = await remoteLink.list({
            [Modules.API_KEY]: { publishable_key_id: key.id }
        });

        console.log("Found Links: " + links.length);
        links.forEach(l => console.log(JSON.stringify(l)));
    } catch (e) {
        console.log("Failed to resolve Link Module: " + e.message);
    }
}
