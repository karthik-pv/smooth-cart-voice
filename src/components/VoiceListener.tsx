import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with Vite environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// Define available functions for Gemini
const availableFunctions = {
  showGymClothes: {
    name: "showGymClothes",
    description:
      "Execute this function if the user is interested in gym clothes or any related activities or equipment associated with the gym only.",
    parameters: {},
  },
  showYogaEquipment: {
    name: "showYogaEquipment",
    description:
      "Execute this function if the user is interested in any yoga activities or asks about yoga in general.",
    parameters: {},
  },
  goToCart: {
    name: "goToCart",
    description: "Navigate to shopping cart",
    parameters: {},
  },
  checkout: {
    name: "checkout",
    description: "Start checkout process",
    parameters: {},
  },
  showRunningGear: {
    name: "showRunningGear",
    description:
      "Execute this function if the user is interested in running, jogging, or any running-related activities or equipment",
    parameters: {},
  },
};

export const VoiceListener = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if ("webkitSpeechRecognition" in window && !isListening) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log("Voice recognition activated");
      };

      recognitionRef.current.onresult = async (event: any) => {
        // Temporarily stop listening while processing
        recognitionRef.current.stop();

        const results = Array.from(event.results);
        for (let result of results) {
          const transcript = result[0].transcript.toLowerCase();
          setTranscript(transcript);
          console.log("Processing command:", transcript);

          // Handle voice commands
          await handleVoiceCommand(transcript);
        }

        // Resume listening after processing
        startListening();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Error occurred in recognition:", event.error);

        if (event.error !== "aborted") {
          setIsListening(false);
          recognitionRef.current = null;
          // Restart listening after error
          setTimeout(startListening, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        // Only restart if we're not actively processing a command
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Restart failed:", error);
            setIsListening(false);
            recognitionRef.current = null;
            setTimeout(startListening, 300);
          }
        }
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        setIsListening(false);
        recognitionRef.current = null;
      }
    }
  };

  const interpretCommand = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a shopping assistant that helps users navigate an e-commerce website.
        Analyze the following voice command and determine which function to call.
        
        User command: "${transcript}"

        Available functions:
        ${Object.values(availableFunctions)
          .map((fn) => `- ${fn.name}: ${fn.description}`)
          .join("\n")}

        Return ONLY the function name that best matches the user's intent, or "unknown" if no function matches.
        Do not include any other text in your response.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text().trim();
      return response;
    } catch (error) {
      console.error("Gemini API error:", error);
      return "unknown";
    }
  };

  // Update the handleVoiceCommand switch statement
  const handleVoiceCommand = async (command: string) => {
    console.log("Processing command:", command);

    const action = await interpretCommand(command);
    console.log("Interpreted action:", action);

    switch (action) {
      case "showGymClothes":
        await navigate("/products/gym");
        break;
      case "showYogaEquipment":
        await navigate("/products/yoga");
        break;
      case "goToCart":
        await navigate("/cart");
        break;
      case "checkout":
        await navigate("/payment");
        break;
      case "showRunningGear":
        await navigate("/products/jogging");
        break;
      default:
        console.log("Unknown command:", command);
    }
  };

  useEffect(() => {
    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return null;
};
