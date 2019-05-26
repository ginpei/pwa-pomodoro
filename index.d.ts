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
  cycle: number;
  onUpdate: (progress: number) => void;
}
