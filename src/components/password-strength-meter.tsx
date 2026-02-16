"use client";

// =============================================================================
// Password Strength Meter - Real-time visual feedback
// =============================================================================

import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (p: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { label: "Ít nhất 8 ký tự", test: (p) => p.length >= 8 },
  { label: "Có chữ hoa (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Có chữ số (0-9)", test: (p) => /[0-9]/.test(p) },
  { label: "Có ký tự đặc biệt (!@#...)", test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, level, color, bgColor } = useMemo(() => {
    if (!password) return { score: 0, level: "", color: "", bgColor: "" };

    const passed = REQUIREMENTS.filter((r) => r.test(password)).length;
    const ratio = passed / REQUIREMENTS.length;

    if (ratio <= 0.25) return { score: passed, level: "Yếu", color: "text-red-500", bgColor: "bg-red-500" };
    if (ratio <= 0.5) return { score: passed, level: "Yếu", color: "text-red-500", bgColor: "bg-red-500" };
    if (ratio <= 0.75) return { score: passed, level: "Trung bình", color: "text-amber-500", bgColor: "bg-amber-500" };
    return { score: passed, level: "Mạnh", color: "text-emerald-500", bgColor: "bg-emerald-500" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-3">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Độ mạnh mật khẩu</span>
          <span className={`text-xs font-semibold ${color}`}>{level}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: REQUIREMENTS.length }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < score ? bgColor : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        {REQUIREMENTS.map((req) => {
          const passed = req.test(password);
          return (
            <div
              key={req.label}
              className={`flex items-center gap-2 text-xs transition-colors ${
                passed ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {passed ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              {req.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
