import { useEffect } from "react";

interface VapiConfig {
  position?: "bottom-right" | "bottom-left";
  size?: "small" | "medium" | "large";
  backgroundColor?: string;
  iconColor?: string;
}

interface VapiProps {
  config?: VapiConfig;
}

declare global {
  interface Window {
    vapiSDK: {
      run: (config: {
        apiKey: string;
        assistant: string;
        config?: VapiConfig;
      }) => any;
    };
    vapiInstance: any;
  }
}

export const VapiAssistant = ({ config }: VapiProps) => {
  useEffect(() => {
    const ASSISTANT_ID = "2da73376-dfd6-4be9-a9f7-9436017c0840";
    const API_KEY = "feb971be-64a5-40b9-bc66-cf6d9c6ef341";

    const buttonConfig = {
      position: "bottom-right",
      size: "medium",
      backgroundColor: "#007bff",
      iconColor: "#ffffff",
      ...config,
    };

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;

    script.onload = () => {
      window.vapiInstance = window.vapiSDK.run({
        apiKey: API_KEY,
        assistant: ASSISTANT_ID,
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.vapiInstance) {
        // Cleanup if needed
        window.vapiInstance = null;
      }
    };
  }, [config]);

  return null;
};
