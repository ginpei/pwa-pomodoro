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

interface DialogProps {
  el: HTMLElement;
  onDone: () => void;
}

// TODO rename to preferences
interface PomodoroState {
  breakTime: number;
  pushNotificationEnabled: boolean;
  sound: string;
  volume: number; // 0.0 - 1.0
  workTime: number;
}

interface PomodoroFormProps {
  el: HTMLElement;
  onChange: (values: PomodoroState) => void;
  values: PomodoroState;
}

interface PomodoroClockProps {
  active: boolean;
  el: HTMLElement;
  onClick: (active: boolean) => void;
  onTurn: (degree: number) => void;
  pomodoroState: PomodoroState;
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
  onUpdate: (progress: number, remainingTime: number) => void;
}

type PomodoroTimerStatus =
  | 'stop'
  | 'working'
  | 'breaking';

interface PomodoroTimerState {
  status: PomodoroTimerStatus;
}

interface PreferencesDialogProps extends DialogProps {
  beforeInstallPromptEvent: BeforeInstallPromptEvent | null;
  initialPomodoroState: PomodoroState;
  onChange: (state: PomodoroState) => void;
  onInstall: (installed: boolean) => void;
  onPlayChime: () => void;
  pomodoroState: PomodoroState;
}

interface PreferencesDialogState {
  installingProgress: 'ready' | 'accepted' | 'dismissed';
}

interface PomodoroToggleButtonProps {
  active: boolean;
  el: SVGSVGElement;
}

interface ChimeProps {
  preferences: PomodoroState;
}

interface Pos {
  x: number;
  y: number;
}
