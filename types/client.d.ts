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

interface PomodoroClockProps {
  active: boolean;
  el: HTMLElement;
  onClick: (active: boolean) => void;
  onTurn: (degree: number) => void;
  onTurnEnd: () => void;
  onTurnStart: () => void;
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
