
// Renders the Dialogflow Messenger widget on the page
// The actual chat UI, responses and suggestion chips are
// all handled by Dialogflow — this file just mounts the element

import { useEffect, useRef } from 'react';
import './chatbot.css';



export default function Chatbot() {
  const containerRef = useRef(null);

    // Ref to the container div so we can append df-messenger into it


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if df-messenger already exists anywhere on the page
    const existing = document.querySelector('df-messenger');
    if (existing) return;

    // Create and append df-messenger only once
    const dfMessenger = document.createElement('df-messenger');
    dfMessenger.setAttribute('intent', 'WELCOME');
    dfMessenger.setAttribute('chat-title', 'RUMI Assistant');
    dfMessenger.setAttribute('agent-id', 'b7dcba41-c50d-4663-af82-bd06d3685009');
    dfMessenger.setAttribute('language-code', 'en');

    container.appendChild(dfMessenger);

    return () => {
      // Cleanup — remove df-messenger when component unmounts
      // This prevents duplicates if the component remounts
      const el = document.querySelector('df-messenger');
      if (el) el.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}