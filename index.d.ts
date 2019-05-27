/**
 * TODO replace with official one when implemented.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: 'web' | '' | string;
  }>;
}

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
  active: boolean;
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
  beforeInstallPromptEvent: BeforeInstallPromptEvent | null;
  el: HTMLElement;
  initialPomodoroState: PomodoroState;
  onChange: (state: PomodoroState) => void;
  onDone: () => void;
  onInstall: (installed: boolean) => void;
  pomodoroState: PomodoroState;
}

interface PreferencesDialogState {
  installingProgress: 'ready' | 'accepted' | 'dismissed';
}

interface PomodoroToggleButtonProps {
  active: boolean;
  el: SVGSVGElement;
  onClick: () => void;
}
