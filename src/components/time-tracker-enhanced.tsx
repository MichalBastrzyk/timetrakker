import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Square, Trash2, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TimeEntry {
  id: number
  duration: number
  startTime: Date
  endTime: Date
}

export function TimeTrackerEnhanced() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    const storedEntries = localStorage.getItem("timeEntries")
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries, (key, value) => {
        if (key === "startTime" || key === "endTime") {
          return new Date(value)
        }
        return value
      })
      setEntries(parsedEntries)
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("timeEntries", JSON.stringify(entries))
    }
  }, [entries])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (!isRunning && time !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time])

  const handleStartStop = () => {
    if (isRunning) {
      const endTime = new Date()
      setEntries((prevEntries) => [
        {
          id: Date.now(),
          duration: time,
          startTime: startTime!,
          endTime: endTime,
        },
        ...prevEntries,
      ])
      setTime(0)
      setStartTime(null)
    } else {
      setStartTime(new Date())
    }
    setIsRunning(!isRunning)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const deleteEntry = (id: number) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-6 md:mb-0">
            <Clock className="w-12 h-12 text-gray-400" />
            <div className="text-5xl font-bold text-gray-700 dark:text-gray-300 font-mono">
              {formatTime(time)}
            </div>
          </div>
          <Button
            className="w-full md:w-auto text-lg py-6 px-8"
            onClick={handleStartStop}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <Square className="mr-2 h-6 w-6" />
            ) : (
              <Play className="mr-2 h-6 w-6" />
            )}
            {isRunning ? "Stop" : "Start"}
          </Button>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-gray-50 dark:bg-gray-800">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg mb-3 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-700"
                    : "bg-gray-100 dark:bg-gray-600"
                } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
              >
                <div className="flex flex-col mb-2 md:mb-0">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {entry.startTime.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {formatDateTime(entry.startTime)} -{" "}
                    {formatDateTime(entry.endTime)}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-0 font-mono">
                  {formatTime(entry.duration)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry(entry.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete entry</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
