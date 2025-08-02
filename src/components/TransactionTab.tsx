

// components/TransactionTabs.tsx
"use client";
import { useState } from "react";
import { Transaction } from "@/types/TransactionType";
import TransactionCard from "./TransactionCard";

type Props = {
  transactions: Transaction[];
};

const TransactionTabs = ({ transactions }: Props) => {
  const [activeTab, setActiveTab] = useState<"all" | "sell" | "swap">("all");

  const filtered = transactions.filter((t) =>
    activeTab === "all" ? true : t.type === activeTab
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {(["all", "sell", "swap"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-1 rounded-full border ${
              activeTab === tab
                ? "bg-btn-color text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filtered Transactions */}
      <div className="space-y-4">
        {filtered.length ? (
          filtered.map((tx) => (
            <TransactionCard key={tx.transactionId} transaction={tx} />
          ))
        ) : (
          <p className="text-gray-500">No {activeTab} transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionTabs;
