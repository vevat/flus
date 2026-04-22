import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pengebingen – Bygg formue med små beløp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#c9a84c",
              letterSpacing: "-2px",
            }}
          >
            Pengebingen
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a09882",
              maxWidth: "700px",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Se hva små daglige beløp blir til over tid.
            Gratis spare- og investeringsguide.
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: 18,
              color: "#6b6555",
              display: "flex",
              gap: "24px",
            }}
          >
            <span>Sparekalkulator</span>
            <span>·</span>
            <span>Investeringsguide</span>
            <span>·</span>
            <span>Velprøvde strategier</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
