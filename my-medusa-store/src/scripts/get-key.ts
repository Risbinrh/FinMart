
import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function getApiKey({ container }: ExecArgs) {
    const apiKeyModule = container.resolve(Modules.API_KEY);
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);

    // List all publishable keys
    const apiKeys = await apiKeyModule.listApiKeys({
        type: "publishable",
    }, {
        relations: ["sales_channels"]
    });

    console.log("Found " + apiKeys.length + " publishable keys.");

    for (const key of apiKeys) {
        console.log(`Key: ${key.token}`);
        console.log(`Title: ${key.title}`);
        console.log(`ID: ${key.id}`);
        console.log(`Revoked At: ${key.revoked_at}`);
        // Check sales channels
        if (key.sales_channels && key.sales_channels.length > 0) {
            console.log(`Sales Channels: ${key.sales_channels.map(sc => sc.name + " (" + sc.id + ")").join(", ")}`);
        } else {
            console.log("Sales Channels: NONE");
        }
        console.log("------------------------------------------------");
    }

    // Also list sales channels to see what's available
    const salesChannels = await salesChannelModule.listSalesChannels({});
    console.log("Available Sales Channels:");
    salesChannels.forEach(sc => {
        console.log(`- ${sc.name} (${sc.id})`);
    });
}
