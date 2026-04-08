import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, emit } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const appWindow = getCurrentWindow();
  async function greet() {
    const message: string = await invoke("greet", { name })
    setGreetMsg(message);
  }

  async function readFile() {
    try {
      const arrayBuffer: ArrayBuffer = await invoke("read_file");
      const decoder = new TextDecoder();
      const content = decoder.decode(new Uint8Array(arrayBuffer));
      console.log("File content:", content);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }

  useEffect(() => {
    const unlisten = listen("tauri://ready", (result) => {
      console.log("Tauri is ready!", result);
    });
    const readylistener = listen("app-ready", (event) => {
      console.log("App is ready!", event);
    });
    const customListener = listen("custom-event", (event) => {
      console.log("Received custom event:", event);
    });
    return () => {
      unlisten.then((f) => f());
      readylistener.then((f) => f());
      customListener.then((f) => f());
    };
  }, []);


  useEffect(() => {
    appWindow.emit('router-changed', { url: window.location.href })
  }, []);

  return (
    <main className="container">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <button onClick={readFile}>Read File</button>
      <button
        onClick={() => {
          emit("custom-event", { message: "Hello from React!" });
        }}
      >
        Emit Custom Event
      </button>
    </main>
  );
}

export default App;
