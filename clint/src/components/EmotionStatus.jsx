import React from "react";

function EmotionStatus({ emotion }) {
  const EMOJI = {
    joy: "😊",
    neutral: "😐",
    sadness: "😞",
    anger: "😡",
    fear: "😨",
    surprise: "😲",
    disgust: "🤢",
  };

  const AR_LABEL = {
    joy: "السعادة",
    neutral: "محايد",
    sadness: "الحزن",
    anger: "الغضب",
    fear: "الخوف",
    surprise: "الدهشة",
    disgust: "الاشمئزاز",
  };

  const GRADIENT = {
    joy: "linear-gradient(90deg,#FACC15,#F59E0B)",
    neutral: "linear-gradient(90deg,#9CA3AF,#6B7280)",
    sadness: "linear-gradient(90deg,#3B82F6,#1D4ED8)",
    anger: "linear-gradient(90deg,#F87171,#DC2626)",
    fear: "linear-gradient(90deg,#8B5CF6,#6D28D9)",
    surprise: "linear-gradient(90deg,#22D3EE,#06B6D4)",
    disgust: "linear-gradient(90deg,#10B981,#047857)",
  };

  const toPercent = (v) => `${(v * 100).toFixed(1)}%`;

  const normalizeEmotion = (emotion = {}) => {
    const entries = Object.entries(emotion).map(([k, v]) => [k, Number(v) || 0]);
    if (!entries.length) return [];
    const scale100 = entries.some(([, v]) => v > 1.0001);
    const scaled = entries.map(([k, v]) => [k, scale100 ? v / 100 : v]);
    const clamped = scaled.map(([k, v]) => [k, Math.max(0, Math.min(1, v))]);
    return clamped.sort((a, b) => b[1] - a[1]);
  };

  const items = normalizeEmotion(emotion);
  if (!items.length) return null;

  const [topKey, topVal] = items[0];
  const topLabel = AR_LABEL[topKey] || topKey;
  const topEmoji = EMOJI[topKey] || "🧠";

  const sum = items.reduce((s, [, v]) => s + v, 0);

  return (
    <div dir="rtl" className="mt-3 space-y-3">
      {/* Top badge */}
      <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2">
        <span className="text-xl">{topEmoji}</span>
        <span className="font-semibold">{topLabel}</span>
        <span className="ms-auto text-sm bg-white/20 rounded-xl px-2 py-1">
          {toPercent(topVal)}
        </span>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-2">
        {items.map(([key, val]) => {
          const label = AR_LABEL[key] || key;
          const emoji = EMOJI[key] || "🔹";
          return (
            <div key={key} className="w-full">
              <div className="flex justify-between text-xs mb-1 opacity-90">
                <span className="flex items-center gap-1">
                  <span className="text-sm">{emoji}</span>
                  <span>{label}</span>
                </span>
                <span className="tabular-nums">{toPercent(val)}</span>
              </div>
              <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-[width] duration-500"
                  style={{
                    width: `${val * 100}%`,
                    background: GRADIENT[key] || GRADIENT.neutral,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {sum < 0.95 || sum > 1.05 ? (
        <p className="text-[11px] opacity-80 mt-1">
          ٪ النسب تمثل ثقة النموذج (قد لا تجمع ١٠٠٪ بالضبط).
        </p>
      ) : null}
    </div>
  );
}

export default EmotionStatus;
