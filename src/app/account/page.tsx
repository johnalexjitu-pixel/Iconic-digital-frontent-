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
      console.log("📡 Fetching withdrawal info for user:", user?._id);
      const res = await apiClient.post("/api/frontend/withdrawal-info", {
        customerId: user._id,
      });

      if (res.data) {
        console.log("✅ Withdrawal data received:", res.data);
        setWithdrawalInfo(res.data);
      } else {
        console.warn("⚠️ No data received from backend.");
        setError("No data received from backend");
      }
    } catch (err: any) {
      console.error("❌ Error fetching withdrawal info:", err);
      setError("Failed to load withdrawal info");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading withdrawal information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center border-red-500">
        <AlertCircle className="mx-auto text-red-500 w-8 h-8 mb-2" />
        <p className="text-red-600 font-semibold">{error}</p>
      </Card>
    );
  }

  if (!withdrawalInfo) {
    return (
      <Card className="p-6 text-center">
        <Wallet className="mx-auto text-gray-500 w-8 h-8 mb-2" />
        <p className="text-gray-700">No withdrawal data available.</p>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">Withdrawal Information</h1>

      <Card className="p-6 space-y-3">
        <p>
          <strong>Customer ID:</strong> {withdrawalInfo.customerId}
        </p>
        <p>
          <strong>Amount:</strong> {withdrawalInfo.amount} BDT
        </p>
        <p>
          <strong>Method:</strong> {withdrawalInfo.method}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              withdrawalInfo.status === "completed"
                ? "text-green-600 font-semibold"
                : withdrawalInfo.status === "pending"
                ? "text-yellow-600 font-semibold"
                : "text-gray-600"
            }
          >
            {withdrawalInfo.status || "N/A"}
          </span>
        </p>
        {withdrawalInfo.message && (
          <p className="text-sm text-gray-500 italic">
            {withdrawalInfo.message}
          </p>
        )}
      </Card>

      <div className="flex justify-center">
        <Button onClick={fetchWithdrawalInfo}>🔄 Refresh</Button>
      </div>
    </div>
  );
}
