import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

/** Native field leaf for caller-owned labels, hints and compound layouts. */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input {...props} ref={ref} className={["ui-field-input ui-native-input", className].filter(Boolean).join(" ")} />;
  },
);

/** Native multiline field leaf; descriptions, selection and resize remain caller-owned. */
export const TextareaControl = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextareaControl({ className, ...props }, ref) {
    return <textarea {...props} ref={ref} className={["ui-field-input ui-native-input ui-textarea", className].filter(Boolean).join(" ")} />;
  },
);
