/**
 * Message from client (main) to controller (service worker).
 */
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
  } | {
    adjusting: boolean;
    type: 'setAdjusting';
  }

/**
 * Message from controller (service worker) to client (main).
 */
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

interface PomodoroPreferences {
  breakTime: number;
  pushNotificationEnabled: boolean;
  sound: string;
  volume: number; // 0.0 - 1.0
  workTime: number;
}
