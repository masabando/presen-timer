import { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import { database } from "../../firebase";

interface TimerProps {
  admin: boolean;
}

export default function Timer({ admin }: TimerProps) {
  const [time, setTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const presenTationTime = 3 * 60; // 3 minutes in seconds
  const defenseTime = 2 * 60; // 2 minutes in seconds

  useEffect(() => {
    const timerRef = ref(database, 'timer');
    onValue(timerRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.time && data.time !== time) {
        setTime(data.time);
      }
    });
  }, []);

  useEffect(() => {
    if (time !== null) {
      set(ref(database, 'timer'), { time });
    }
    const interval = setInterval(() => {
      const now = new Date();
      if (time !== null) {
        const diff = Math.floor((now.getTime() - time) / 1000);
        setRemainingTime((presenTationTime + defenseTime) - diff);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="flex flex-col items-center justify-center h-svh gap-2">
      <div className="text-4xl">
        {remainingTime > defenseTime
          ? "発表"
          : remainingTime > 0
            ? "質疑応答"
            : "終了"}
      </div>
      <div className="aura aura-silver">
        <div className="card bg-base-100">
          <div
            className={`card-body text-8xl font-mono ${remainingTime < 0 ? "text-error" : ""}`}
          >
            <p>
              {Math.floor(Math.abs(remainingTime) / 60)
                .toString()
                .padStart(1, "0")}
              {""}:{""}
              {(Math.abs(remainingTime) % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
      <div hidden={!admin} className="flex gap-4 mt-10">
        <button
          className="btn btn-primary"
          onClick={() => setTime(new Date().getTime())}
        >
          Start
        </button>
      </div>
    </div>
  );
}