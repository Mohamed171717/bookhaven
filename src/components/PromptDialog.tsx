import React, { useState, useEffect } from "react";

interface PromptDialogProps {
  open: boolean;
  title?: string;
  message: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const PromptDialog: React.FC<PromptDialogProps> = ({
  open,
  title = "Enter Information",
  message,
  placeholder = "Type here...",
  confirmText = "Submit",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState("");

  // Reset value when dialog opens
  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#4A4947]/50">
      <div className="bg-[#FAF7F0] rounded-2xl shadow-xl max-w-sm w-full p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-[#4A4947] mb-2">{title}</h2>

        {/* Message */}
        <p className="text-sm text-[#4A4947]/80 mb-4">{message}</p>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border border-[#D8D2C2] bg-white text-[#4A4947] focus:outline-none focus:ring-2 focus:ring-[#B17457] mb-6"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#D8D2C2] text-[#4A4947] bg-white hover:bg-[#D8D2C2] transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="px-4 py-2 rounded-lg bg-[#B17457] text-white font-medium hover:bg-[#4A4947] transition disabled:opacity-50"
            disabled={!value.trim()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptDialog;
