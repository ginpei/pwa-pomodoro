interface PomodoroState {
  breakTime: number;
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
  | 'breaking';

interface PomodoroTimerState {
  status: PomodoroTimerStatus;
}

interface PreferencesDialogProps {
  el: HTMLElement;
  initialPomodoroState: PomodoroState;
  onChange: (state: PomodoroState) => void;
  onDone: () => void;
  pomodoroState: PomodoroState;
}
