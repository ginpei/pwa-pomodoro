interface PomodoroState {
  restTime: number;
  workTime: number;
}

interface PomodoroFormProps {
  el: HTMLElement;
  onChange: (values: PomodoroState) => void;
  values: PomodoroState;
}

interface PomodoroCircleProps {
  el: HTMLCanvasElement;
  values: PomodoroState;
}

interface PomodoroClockHandProps {
  el: HTMLCanvasElement;
  degree: number;
}

interface PomodoroTimerProps {
  pomodoroStatus: PomodoroState;
  onStatusChange: (status: PomodoroTimerStatus) => void;
  onUpdate: (progress: number) => void;
}

type PomodoroTimerStatus =
  | 'stop'
  | 'working'
  | 'resting';

interface PomodoroTimerState {
  status: PomodoroTimerStatus;
}
