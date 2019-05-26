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
  pomodoroState: PomodoroState;
}

interface PomodoroClockHandProps {
  el: HTMLCanvasElement;
  degree: number;
}

interface PomodoroTimerProps {
  pomodoroState: PomodoroState;
  onStatusChange: (
    status: PomodoroTimerStatus,
    oldStatus: PomodoroTimerStatus,
  ) => void;
  onUpdate: (progress: number) => void;
}

type PomodoroTimerStatus =
  | 'stop'
  | 'working'
  | 'resting';

interface PomodoroTimerState {
  status: PomodoroTimerStatus;
}

interface PreferencesDialogProps {
  el: HTMLElement;
  onChange: (state: PomodoroState) => void;
  onDone: () => void;
  pomodoroState: PomodoroState;
}
