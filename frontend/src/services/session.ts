// TODO: create a pending queue for when socket connection isn't made on time
export class Session {
  private static _socket: WebSocket | null = null;
  private static _messageQueue: CustomEvent<{
    data: any;
  }>[] = [];
  public static _history: Record<string, unknown>[] = [];
  private static _connecting = false;
  public static providers: string[] = [];
  public static _isReady: boolean = false;

  private static _disconnecting = false;
  private static _eventTarget = new EventTarget();
  static _intervalId: NodeJS.Timeout;
  static _intervalReset: NodeJS.Timeout;

  public static restoreOrStartNewSession() {
    if (Session.isConnected()) {
      Session.disconnect();
    }
    Session._connect();
  }

  public static startNewSession() {
    Session.restoreOrStartNewSession();
  }

  static isConnected(): boolean {
    return (
      Session._socket !== null && Session._socket.readyState === WebSocket.OPEN
    );
  }

  static disconnect(): void {
    Session._disconnecting = true;
    if (Session._socket) {
      Session._socket.close();
    }
    Session._socket = null;
  }

  private static _connect(): void {
    if (Session.isConnected()) return;
    Session._connecting = true;
    let wsURL = "ws://localhost:3001/ws";
    Session._socket = new WebSocket(wsURL);
    Session._setupSocket();
  }

  static send = (message: string) => {
    if (Session.isConnected()) {
      Session._socket?.send(message);
      return true;
    } else {
      return false;
    }
  };

  static dispatchEvent(eventType: string, data: any) {
    const event = new CustomEvent(eventType, {
      detail: { data },
    });

    if (Session._isReady) {
      Session._eventTarget.dispatchEvent(event);
    } else {
      // Queue the event if not ready
      Session._messageQueue.push(event);
    }
  }

  private static _setupSocket(): void {
    if (!Session._socket) {
      throw new Error("no socket");
    }

    Session._socket.onmessage = (e) => {
      let data = null;
      try {
        data = JSON.parse(e.data);
        Session._history.push(data);

        if (data.finished) {
          const event = new CustomEvent("finished", {
            detail: { data },
          });
          Session._eventTarget.dispatchEvent(event);
        } else if (data.config) {
          Session.providers = data.config;

          const event = new CustomEvent("sessionConfig", {
            detail: { data },
          });
          Session._eventTarget.dispatchEvent(event);
        } else {
          const event = new CustomEvent("sessionMessage", {
            detail: { data },
          });
          Session._messageQueue.push(event);
        }
      } catch (err) {
        console.log(err);
      }
    };
  }

  static setReady(isReady: boolean) {
    /**
     * Waits for event listener to mount before dispatching agent messages
     * Removes dispatcher after message queue is emptied and agent has finished
     */
    if (isReady) {
      Session._isReady = isReady;
      Session._startDispatch();
    } else {
      setInterval(() => {
        if (Session._messageQueue.length == 0) {
          Session._isReady = isReady;
          if (Session._intervalReset) {
            clearInterval(Session._intervalReset);
          }
        }
      }, 100);
    }
  }

  static _startDispatch() {
    /**
     * Dispatch agent messages from queue at set interval
     */
    Session._intervalId = setInterval(() => {
      if (Session._isReady && Session._messageQueue.length > 0) {
        const event = Session._messageQueue.shift();
        if (event) {
          Session._eventTarget.dispatchEvent(event);
        }
      } else if (!Session._isReady) {
        if (Session._intervalId) {
          clearInterval(Session._intervalId);
        }
      }
    }, 100); // 100 ms interval
  }

  public static addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {
    Session._eventTarget.addEventListener(type, listener);
  }

  public static removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {
    Session._eventTarget.removeEventListener(type, listener);
  }
}
