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

interface PomodoroPreferences {
  breakTime: number;
  pushNotificationEnabled: boolean;
  sound: string;
  volume: number; // 0.0 - 1.0
  workTime: number;
}

interface PomodoroClockProps {
  active: boolean;
  el: HTMLElement;
  onClick: (active: boolean) => void;
  onTurn: (degree: number) => void;
  preferences: PomodoroPreferences;
  progress: number; // 0.0 - 1.0
}

interface PomodoroCircleProps {
  el: HTMLCanvasElement;
  preferences: PomodoroPreferences;
}

interface PomodoroClockHandProps {
  active: boolean;
  el: HTMLCanvasElement;
  degree: number;
}

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

interface PreferencesDialogProps extends DialogProps {
  beforeInstallPromptEvent: BeforeInstallPromptEvent | null;
  initialPreferences: PomodoroPreferences;
  onChange: (state: PomodoroPreferences) => void;
  onInstall: (installed: boolean) => void;
  onPlayChime: () => void;
  preferences: PomodoroPreferences;
}

interface PreferencesDialogState {
  installingProgress: 'ready' | 'accepted' | 'dismissed';
}

interface PomodoroToggleButtonProps {
  active: boolean;
  el: SVGSVGElement;
}

interface ChimeProps {
  preferences: PomodoroPreferences;
}

interface Pos {
  x: number;
  y: number;
}

// main -> SW
type ClientMessage =
  {
    preferences: PomodoroPreferences;
    type: 'setPreferences';
  } | {
    type: 'startTimer';
  } | {
    type: 'stopTimer';
  } | {
    progress: number; // 0.0 - 1.0
    type: 'setProgress';
  }

// SW -> main
// TODO rename
type ControllerMessage =
  {
    progress: number; // 0.0 - 1.0
    remaining: number;
    type: 'tick';
  } | {
    oldStatus: PomodoroTimerStatus;
    status: PomodoroTimerStatus;
    type: 'statusChange';
  }
