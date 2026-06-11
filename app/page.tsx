"use client";

import { useEffect, useState } from "react";

// interface Subscription {
//   id: string;
//   name: string;
//   status: string;
//   primaryContact: string;
//   yourReference: string;
//   billingFrequency: string;
//   startDate: string;
//   endDate: string | null;
// }

interface Subscription {
  contractNumber: string;
  accountNumber: string;
  name: string;
  status: string;
  primaryContact: string;
  yourReference: string;
  contractTermInMonths: string;
  quantity: number;
  startDate: string;
  endDate: string | null;
}

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const statusColor = (status: string) => {
    if (status.toLowerCase().includes("fornyes"))
      return { bg: "#e8f5e9", text: "#2e7d32" };
    return { bg: "#f0f0f0", text: "#888" };
  };

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "#7c6ff7",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          S
        </div>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Simployer</span>
      </header>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "48px 24px 32px" }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "#7c6ff7",
            borderRadius: 12,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 16,
          }}
        >
          S
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            margin: "0 0 12px",
            color: "#111",
          }}
        >
          Subscriptions
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: 15,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          The following subscriptions are tied to your account It displays all
          subscriptions related to your company´s account number
        </p>
      </div>

      {/* Tabell */}
      <div
        style={{
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #eee",
            overflow: "auto",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              Your subscriptions
            </span>
            {/* <span style={{ fontSize: 12, color: "#999" }}>
              Live-data ({subscriptions.length} rader)
            </span> */}
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "#999" }}>
              Loading ...
            </div>
          ) : (
            <table
              style={{
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  {[
                    "Contract No.",
                    "Customer No.",
                    "Description",
                    "Quantity",
                    "Primary Contact",
                    "Your Referens",
                    "Contract Term (months)",
                    "Renewal Status ",
                    "Start Date",
                    "End of current period",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#444",
                        borderBottom: "1px solid #eee",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, i) => (
                  <tr
                    key={`${sub.contractNumber}-${i}`}
                    style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                  >
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.contractNumber}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.accountNumber}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                      {sub.name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.quantity}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.primaryContact}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.yourReference}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.contractTermInMonths}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {(() => {
                        const c = statusColor(sub.status);
                        return (
                          <span
                            style={{
                              background: c.bg,
                              color: c.text,
                              padding: "2px 10px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {sub.status || "—"}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.startDate}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {sub.endDate ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
