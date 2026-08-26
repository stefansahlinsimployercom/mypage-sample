# Intercom: nuvarande snippet vs. med JWT + attribut (referens)

Detta är en **referensfil, inte kopplad till appen**. Den körs inte och byggs inte in
av Next.js — den ligger bara här som jämförelse bredvid [layout.tsx](./layout.tsx)
för att visa hur koden skulle förändras när vi går från anonym till
identitetsverifierad Messenger. Källor: [Authenticating users with JWTs](https://www.intercom.com/help/en/articles/10589769-authenticating-users-in-the-messenger-with-json-web-tokens-jwts),
[JS attributes & objects](https://developers.intercom.com/installing-intercom/web/attributes-objects).

---

## 1. Nuvarande version (det som faktiskt är deployat i `layout.tsx`)

Anonym besökare — inget `user_id`, inget JWT, ingen profildata. Alla besökare på
sajten blir en anonym "Lead" i Intercom, oavsett vem de är.

```tsx
<Script id="intercom-settings" strategy="afterInteractive">
  {`window.intercomSettings = {
    api_base: "https://api-iam.eu.intercom.io",
    app_id: "caclgobw",
  };`}
</Script>
```

---

## 2. Med JWT + attribut (hur det skulle se ut)

### 2a. Backend — där nyckeln faktiskt används (exempel, inte riktig kod ännu)

Det här körs på servern, ALDRIG i webbläsaren. Ett API-anrop frontend gör efter
inloggning, som svarar med ett färskt JWT för just den inloggade användaren.

```ts
// app/api/intercom-token/route.ts  (EXEMPEL — kräver riktig inloggad session)
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  // I verkligheten: hämta den inloggade användaren från sessionen/token,
  // inte hårdkodat som här.
  const user = {
    id: "usr_12345",
    email: "stefan.sahlin@simployer.com",
    name: "Stefan Sahlin",
    companyId: "simployer",
    companyName: "Simployer",
    plan: "Enterprise",
  };

  const token = jwt.sign(
    {
      user_id: user.id, // obligatoriskt claim
      email: user.email, // rekommenderat claim
    },
    process.env.INTERCOM_MESSENGER_SECRET!, // hemligheten — bara här, bara server-side
    { algorithm: "HS256", expiresIn: "10m" }, // kort livslängd
  );

  return NextResponse.json({ jwt: token, user });
}
```

### 2b. Frontend — vad som skickas till Messenger

```tsx
<Script id="intercom-settings" strategy="afterInteractive">
  {`window.intercomSettings = {
    api_base: "https://api-iam.eu.intercom.io",
    app_id: "caclgobw",

    // --- Identitetsbevis (signerat, kan inte förfalskas) ---
    // Värdet hämtas från er backend, t.ex. /api/intercom-token ovan.
    intercom_user_jwt: "<TOKEN FRÅN BACKEND, se 2a>",

    // --- Standardattribut om användaren (osignerade, bara beskrivande) ---
    user_id: "usr_12345",
    email: "stefan.sahlin@simployer.com",
    name: "Stefan Sahlin",
    created_at: 1735689600, // unix-timestamp, när användaren skapades

    // --- Företag: kräver minst company_id + name ---
    company: {
      company_id: "simployer",
      name: "Simployer",
      plan: "Enterprise",   // standardfält Intercom känner igen
    },

    // --- Eget attribut (custom) ---
    // OBS: måste FÖRST skapas som en "Custom Data Attribute" i
    // Intercom (Settings → Data → Custom Data Attributes) innan
    // värdet sparas. Läggs som top-level-nyckel, INTE nästlat i
    // ett "custom_attributes"-objekt — Messenger struntar tyst i
    // sådana och sparar aldrig värdet.
    portal: "mypage-sample",
  };`}
</Script>
```

---

## Sammanfattning av skillnaderna

| | Nuvarande (deployat) | Med JWT + attribut |
|---|---|---|
| Vem är besökaren? | Okänd, anonym Lead | Verifierad, namngiven person |
| Kan förfalskas i webbläsarkonsolen? | N/A (ingen identitet att förfalska) | Nej — signaturen kräver servernyckeln |
| Kopplad till företag/organisation? | Nej | Ja, via `company` |
| Extra fält om personen? | Nej | Ja, valfria standard- eller custom-attribut |
| Kräver backend-ändring? | Nej | Ja — en endpoint som signerar JWT per inloggad användare |
