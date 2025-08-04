import { useState, useEffect, use } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    const unlisten = listen("tauri://ready", (result) => {
      console.log("Tauri is ready!", result);
    });
    const readylistener = listen("app-ready", (event) => {
      console.log("App is ready!", event);
    });
    return () => {
      unlisten.then((f) => f());
      readylistener.then((f) => f());
    };
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
    </main>
  );
}

export default App;
