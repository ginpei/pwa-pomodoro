interface PomodoroTimerProps {
  preferences: PomodoroPreferences;
  onStatusChange: (
    status: PomodoroTimerStatus,
    oldStatus: PomodoroTimerStatus,
  ) => void;
  onUpdate: (progress: number, remainingTime: number) => void;
}

type PomodoroTimerStatus =
  | 'stop'
  | 'working'
  | 'breaking';

interface PomodoroTimerState {
  status: PomodoroTimerStatus;
}

