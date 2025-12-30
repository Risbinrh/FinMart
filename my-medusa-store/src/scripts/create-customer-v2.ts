import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import Scrypt from "scrypt-kdf"

export default async function createCustomerV2({ container }: ExecArgs) {
  const customerService = container.resolve(Modules.CUSTOMER)
  const authService = container.resolve(Modules.AUTH)

  const email = "demo@freshcatch.in"
  const password = "demo1234"

  console.log("Creating customer with proper Medusa v2 auth...")

  try {
    // Check if customer already exists
    const existingCustomers = await customerService.listCustomers({
      email: email,
    })

    if (existingCustomers.length > 0) {
      console.log("Customer already exists with this email")
      console.log("Deleting existing customer...")
      await customerService.deleteCustomers([existingCustomers[0].id])
    }

    // Hash password using scrypt (Medusa v2 default)
    const passwordBuffer = await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
    const hashedPassword = passwordBuffer.toString("base64")

    console.log("Password hashed successfully")

    // Create auth identity with hashed password
    const [authIdentity] = await authService.createAuthIdentities({
      provider_identities: [
        {
          provider: "emailpass",
          entity_id: email,
          provider_metadata: {
            password: hashedPassword,
          },
        },
      ],
    })

    console.log("Auth identity created:", authIdentity.id)

    // Create customer
    const customer = await customerService.createCustomers({
      email: email,
      first_name: "Demo",
      last_name: "User",
      phone: "9876543210",
    })

    console.log("Customer created:", customer.id)

    // Link customer to auth identity
    await authService.updateAuthIdentities([
      {
        id: authIdentity.id,
        app_metadata: {
          customer_id: customer.id,
        },
      },
    ])

    console.log("\n✅ Customer created successfully!")
    console.log("\nLogin credentials:")
    console.log("  Email:", email)
    console.log("  Password:", password)
  } catch (error) {
    console.error("Error:", error)
  }
}
