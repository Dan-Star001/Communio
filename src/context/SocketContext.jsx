import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('[SocketContext] No token found in localStorage; socket will not connect');
      return;
    }

    // If a socket already exists (React 18 StrictMode double-mount), reuse it
    if (socketRef.current) {
      // If it's already connected expose it immediately
      if (socketRef.current.connected) setSocket(socketRef.current);
      return;
    }

    // Allow polling as a fallback; websocket-only can fail in some environments
    const apiUrl = import.meta.env.VITE_API_BASE || 'https://backend-e54z.onrender.com';
    const newSocket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    socketRef.current = newSocket;

    // Useful debug logs for connection lifecycle
    const onConnect = () => {
      try {
        setSocket(newSocket);
      } catch (e) {
        console.error('[SocketContext] onConnect error', e);
      }
    };
    const onConnectError = (err) => console.error('[SocketContext] connect_error', err);
    const onError = (err) => console.error('[SocketContext] socket error', err);
    const onDisconnect = (reason) => {
      setSocket(null);
    };

    newSocket.on('connect', onConnect);
    newSocket.on('connect_error', onConnectError);
    newSocket.on('error', onError);
    newSocket.on('disconnect', onDisconnect);

    return () => {
      try {
        if (!newSocket) return;
        // Remove handlers we attached
        newSocket.off('connect', onConnect);
        newSocket.off('connect_error', onConnectError);
        newSocket.off('error', onError);
        newSocket.off('disconnect', onDisconnect);

        // In StrictMode the effect may run twice (mount -> unmount -> mount).
        // Closing a socket while it's still in the connecting state can trigger
        // "WebSocket is closed before the connection is established". Avoid
        // force-closing immediately if it's not connected yet — give it a brief
        // grace period to finish connecting or error out, then disconnect.
        if (newSocket.connected) {
          try { newSocket.disconnect(); } catch (e) { console.warn('[SocketContext] disconnect error', e); }
        } else {
          // Allow a short delay so a pending connection can resolve cleanly
          setTimeout(() => {
            try {
              if (newSocket.connected) newSocket.disconnect();
              else newSocket.close();
            } catch (e) {
              console.warn('[SocketContext] delayed cleanup error', e);
            }
          }, 500);
        }

        // Clear ref and state
        if (socketRef.current === newSocket) socketRef.current = null;
        setSocket(null);
      } catch (cleanupErr) {
        console.error('[SocketContext] cleanup error', cleanupErr);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
