import { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import { database } from "../../firebase";

interface TimerProps {
  admin: boolean;
}

interface TimerState {
  now: number | null;
  presentationTime: number;
  defenseTime: number;
}

export default function Timer({ admin }: TimerProps) {
  const [time, setTime] = useState<TimerState>({
    now: null,
    presentationTime: 3 * 60, // 3 minutes in seconds
    defenseTime: 2 * 60, // 2 minutes in seconds
  });
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const timerRef = ref(database, "timer");
    onValue(timerRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.time && data.time !== time.now) {
        setTime({
          ...time,
          ...data,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (time.now !== null) {
      set(ref(database, "timer"), time);
    }
    const interval = setInterval(() => {
      const now = new Date();
      if (time.now === null) {
        setRemainingTime(0);
      } else {
        const diff = Math.floor((now.getTime() - time.now) / 1000);
        setRemainingTime(time.presentationTime + time.defenseTime - diff);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="flex flex-col items-center justify-center h-svh gap-2">
      <div className="text-4xl">
        {remainingTime > time.defenseTime
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
          onClick={() => setTime({ ...time, now: new Date().getTime() })}
        >
          Start
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setTime({ ...time, now: null })}
        >
          Reset
        </button>
      </div>
      <div hidden={!admin} className="flex gap-4 mt-5">
        <div className="flex flex-col gap-2 justify-center items-center">
          発表
          <select
            defaultValue={time.presentationTime}
            className="select"
            onChange={(e) =>
              setTime({ ...time, presentationTime: parseInt(e.target.value) })
            }
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={`presen-${num}`} value={num * 60}>
                {num} min
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          質疑応答
          <select
            defaultValue={time.defenseTime}
            className="select"
            onChange={(e) =>
              setTime({ ...time, defenseTime: parseInt(e.target.value) })
            }
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={`defense-${num}`} value={num * 60}>
                {num} min
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
