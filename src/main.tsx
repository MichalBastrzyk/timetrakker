import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { TimeTrackerEnhanced } from "@/components/time-tracker-enhanced"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="grid place-items-center min-h-screen">
      <TimeTrackerEnhanced />
    </main>
  </StrictMode>
)
