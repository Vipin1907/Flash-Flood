"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import { Bell, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { approveAlert } from "@/lib/api";

interface AlertPanelProps {
  status: string;
  threadId: string;
  draftedMessage: string;
  onStatusChange?: (newStatus: string) => void;
}

export function AlertPanel({
  status,
  threadId,
  draftedMessage,
  onStatusChange,
}: AlertPanelProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  const isWaiting = currentStatus === "awaiting_approval";
  const isDispatched = currentStatus === "dispatched";
  const isRejected = currentStatus === "rejected";

  const handleDecision = async (decision: "approved" | "rejected") => {
    if (!threadId) return;
    setLoading(true);
    try {
      const result = await approveAlert(threadId, decision);
      setCurrentStatus(result.status);
      onStatusChange?.(result.status);
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard
      glowColor={
        isWaiting
          ? "rgba(234,179,8,0.15)"
          : isDispatched
          ? "rgba(34,197,94,0.15)"
          : "rgba(239,68,68,0.1)"
      }
      className={
        isWaiting
          ? "border-yellow-500/30"
          : isDispatched
          ? "border-emerald-500/30"
          : ""
      }
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white/70 tracking-wide uppercase">
          Alert Panel
        </h3>
        {isWaiting && (
          <span className="ml-auto flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
            <span className="text-xs text-yellow-400">Awaiting Approval</span>
          </span>
        )}
        {isDispatched && (
          <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Dispatched
          </span>
        )}
        {isRejected && (
          <span className="ml-auto text-xs text-red-400 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        )}
      </div>

      <div className="bg-white/[0.03] rounded-xl p-4 mb-4">
        <p className="text-xs text-white/40 mb-1">Thread: {threadId}</p>
        <p className="text-sm text-white/80 leading-relaxed">
          {draftedMessage || "No alert drafted yet."}
        </p>
      </div>

      {isWaiting && (
        <div className="flex gap-3">
          <button
            onClick={() => handleDecision("approved")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Approve & Dispatch
          </button>
          <button
            onClick={() => handleDecision("rejected")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
    </GlassCard>
  );
}
