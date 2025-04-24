import { toast } from "sonner";

export function showToast(
  title: string,
  type: "success" | "error" = "success"
) {
  const colors = {
    success: { bg: "#4CAF50", text: "white" },
    error: { bg: "#F44336", text: "white" },
  };

  toast(title, {
    style: {
      backgroundColor: colors[type].bg,
      color: colors[type].text,
      borderRadius: "8px",
      padding: "12px",
      fontSize: "16px",
      fontWeight: "bold",
    },
  });
}
