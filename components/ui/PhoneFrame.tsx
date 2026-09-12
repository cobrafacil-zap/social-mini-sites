export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto" style={{ width: 340, height: 640, position: "relative" }}>
      <div
        style={{
          width: 340, height: 640, borderRadius: 34, border: "9px solid #181A17",
          overflow: "hidden", position: "relative", background: "#000",
        }}
      >
        <div
          style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 110, height: 18, background: "#181A17", borderRadius: "0 0 12px 12px", zIndex: 5,
          }}
        />
        <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}