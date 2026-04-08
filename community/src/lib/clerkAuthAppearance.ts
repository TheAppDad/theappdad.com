import type { Appearance } from "@clerk/types";

/** Shared SignIn / SignUp card styling; OAuth rows use a light surface so they don’t read as black blobs. */
export const clerkAuthAppearance: Appearance = {
  variables: {
    colorPrimary: "#4a7c59",
    colorBackground: "#1c1c1a",
    colorInput: "#121211",
    colorInputBackground: "#121211",
    colorInputForeground: "#f5f4f0",
    colorText: "#f5f4f0",
    colorTextSecondary: "#9c9890",
    borderRadius: "0.75rem",
  },
  elements: {
    formFieldInput: {
      color: "#f5f4f0",
      caretColor: "#f5f4f0",
      "&::placeholder": {
        color: "#9c9890",
        opacity: 1,
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: "#edeae4",
      color: "#1c1c1a",
      border: "1px solid #bfbab0",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#e2ded6",
      },
    },
    socialButtonsBlockButtonText: {
      color: "#1c1c1a",
    },
  },
};
