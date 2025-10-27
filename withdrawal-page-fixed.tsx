"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Wallet } from "lucide-react";

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [withdrawInfo, setWithdrawInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    fetchWithdrawalInfo();
  }, [user]);

  const fetchWithdrawalInfo = async () => {
    try {
      console.log("🔍 Fetching withdrawal info for user:", user._id);
      const res = await apiClient.post("/api/frontend/withdrawal-info", {
        customerId: user._id,
      });

      if (res.data) {
        const data = res.data;
        console.log("✅ Withdrawal data received:", data);
        const withdrawalData = checkWithdrawalEligibility(data);
        setWithdrawInfo(withdrawalData);
      } else {
        console.warn("⚠️ No data received from backend.");
      }
    } catch (err: any) {
      console.error("❌ Error fetching withdrawal info:", err);
      setError("Failed to load withdrawal info. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkWithdrawalEligibility = (data: any) => {
    const {
      user,
      withdrawals,
      canWithdraw,
      trialBalance,
      tasksRemaining,
      tasksCompleted,
    } = data;

    const totalAccountBalance = user.accountBalance || 0;
    const withdrawableAmount = totalAccountBalance - trialBalance;

    if (withdrawableAmount <= 0) {
      return {
        eligible: false,
        message: `You can only withdraw your commission (BDT ${withdrawableAmount}). Trial balance cannot be withdrawn.`,
        maxWithdrawable: withdrawableAmount,
        errorType: "trial_balance_excluded",
      };
    }

    console.log("🌀 Checking last withdrawal status for reapply eligibility...");

    let canReapply = false;
    try {
      if (withdrawals && withdrawals.length > 0) {
        const last = withdrawals[0];
        console.log("📄 Last withdrawal status:", last.status);

        if (last.status === "rejected") {
          canReapply = true;
          console.log("✅ User can reapply because last withdrawal was rejected.");
        }
      }
    } catch (error) {
      console.error("⚠️ Error while checking withdrawal reapply logic:", error);
    }

    if (canWithdraw) {
      return {
        eligible: true,
        message: `You can withdraw BDT ${withdrawableAmount} (excluding trial balance of BDT ${trialBalance}).`,
        maxWithdrawable: withdrawableAmount,
        canReapply,
      };
    } else {
      return {
        eligible: false,
        message: `You must complete ${tasksRemaining} more tasks before making a withdrawal. You have completed ${tasksCompleted} tasks.`,
        errorType: "insufficient_tasks",
        tasksRemaining,
      };
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600 flex items-center justify-center gap-2">
        <AlertCircle size={18} /> {error}
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Wallet className="text-green-600" /> Withdrawal
      </h1>

      <Card className="p-6 rounded-2xl shadow-md">
        {withdrawInfo?.eligible ? (
          <div>
            <p className="text-green-600 font-semibold">
              {withdrawInfo.message}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Max Withdrawable:{" "}
              <strong>BDT {withdrawInfo.maxWithdrawable.toFixed(2)}</strong>
            </p>
            <Button className="mt-4 w-full">Withdraw Now</Button>
          </div>
        ) : (
          <div>
            <p className="text-red-600 font-semibold">
              {withdrawInfo?.message || "You are not eligible yet."}
            </p>
            {withdrawInfo?.errorType === "insufficient_tasks" && (
              <p className="mt-2 text-sm text-gray-500">
                Tasks remaining: {withdrawInfo.tasksRemaining}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
