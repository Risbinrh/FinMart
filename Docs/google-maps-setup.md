# Google Maps API Setup Guide

## Why Google Maps API?

The zone-based delivery system uses Google Maps Geocoding API to convert user addresses (like "123 Anna Salai, Chennai") into GPS coordinates automatically. This makes it user-friendly - customers don't need to know their latitude/longitude!

---

## Quick Setup (5 minutes)

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Geocoding API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Geocoding API"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

### Step 2: Add to Environment Variables

Add the API key to your storefront `.env.local` file:

```env
# Existing variables
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_427cce2a75049dde35ff19cb44f3fc18cc1109893df8c6870064cf64bbff283e

# Add this new line
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### Step 3: Restart Next.js Server

```powershell
# Stop the server (Ctrl+C)
# Then restart
cd storefront
npm run dev
```

---

## Testing Without API Key

If you don't want to set up Google Maps API right now, you can still test using:

1. **Browser Location**: Click "Use My Location" button (requires location permission)
2. **Manual Coordinates**: Use the coordinate input in the advanced section

---

## API Key Security (Important!)

### Restrict Your API Key

1. Go to Google Cloud Console → Credentials
2. Click on your API key
3. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add: `http://localhost:3000/*` (for development)
   - Add: `https://yourdomain.com/*` (for production)
4. Under "API restrictions":
   - Select "Restrict key"
   - Choose only "Geocoding API"

### Free Tier Limits

- **Free**: $200 credit per month
- **Geocoding API**: $5 per 1000 requests
- **Typical usage**: ~40,000 free requests/month

---

## Alternative: Fallback to Browser Geolocation

The system automatically falls back to browser geolocation if:
- No API key is configured
- API key quota is exceeded
- Geocoding fails

Users can click "Use My Location" to allow browser to detect their location.

---

## Troubleshooting

### "Could not find this address"
- Check if the address is complete (include city, state)
- Try adding more details (landmark, pincode)
- Ensure API key is correctly added to `.env.local`

### "API key not configured"
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is in `.env.local`
- Restart Next.js server after adding the key
- Check for typos in the variable name

### "Quota exceeded"
- You've used your free $200 credit
- Enable billing in Google Cloud Console
- Or wait for monthly reset

---

*For production deployment, always use API key restrictions and monitoring!*
