import { Loader2 } from "lucide-react";

function Spinner({ text = "" }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      {"    "}
      <p className="text-lg font-normal text-foreground">{text}</p>
    </div>
  );
}

export { Spinner };
