/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Wallet } from "lucide-react";

interface WithdrawalInfo {
  customerId: string;
  amount: number;
  method: string;
  status?: string;
  message?: string;
}

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [withdrawalInfo, setWithdrawalInfo] = useState<WithdrawalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    fetchWithdrawalInfo();
  }, [user?._id]);

  const fetchWithdrawalInfo = async () => {
    try {
      console.log("🔄 Fetching withdrawal info for user:", user?._id);
      const res = await apiClient.post("/api/frontend/withdrawal-info", {
        customerId: user._id,
      });

      if (res.data) {
        console.log("✅ Withdrawal data received:", res.data);
        setWithdrawalInfo(res.data);
      } else {
        console.warn("⚠️ No withdrawal data found for user");
      }
    } catch (err: any) {
      console.error("❌ Error fetching withdrawal info:", err);
      setError("Failed to fetch withdrawal data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Eligibility logic fix
  function checkWithdrawalEligibility(
    canWithdraw: boolean,
    withdrawableAmount: number,
    trialBalance: number,
    tasksRemaining: number,
    tasksCompleted: number
  ) {
    if (withdrawableAmount <= 0) {
      return {
        eligible: false,
        message: `You can only withdraw your commission (BDT ${withdrawableAmount}). Trial balance cannot be withdrawn.`,
        maxWithdrawable: withdrawableAmount,
        errorType: "trial_balance_excluded"
      };
    }

    if (canWithdraw) {
      return {
        eligible: true,
        message: `You can withdraw BDT ${withdrawableAmount} (excluding trial balance of BDT ${trialBalance})`,
        maxWithdrawable: withdrawableAmount
      };
    } else {
      return {
        eligible: false,
        message: `You must complete ${tasksRemaining} more tasks before making a withdrawal. You have completed ${tasksCompleted} tasks.`,
        errorType: "insufficient_tasks",
        tasksRemaining: tasksRemaining
      };
    }
  }

  if (loading) {
    return <p className="p-6 text-center">Loading withdrawal data...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <AlertCircle className="inline-block mr-2" />
        {error}
      </div>
    );
  }

  if (!withdrawalInfo) {
    return <p className="p-6 text-center">No withdrawal data available.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Wallet className="mr-2" /> Withdrawal Info
          </h2>
          <Button variant="outline" onClick={fetchWithdrawalInfo}>
            Refresh
          </Button>
        </div>

        <p><strong>Amount:</strong> BDT {withdrawalInfo.amount}</p>
        <p><strong>Method:</strong> {withdrawalInfo.method}</p>
        <p><strong>Status:</strong> {withdrawalInfo.status || "Pending"}</p>
        <p className="mt-4 text-sm text-gray-500">
          {withdrawalInfo.message || "Ensure you’ve completed all required tasks before withdrawal."}
        </p>
      </Card>
    </div>
  );
}
