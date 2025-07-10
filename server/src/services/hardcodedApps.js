// Hardcoded interactive apps for quick ideas

module.exports = {
  calculator: {
    files: {
      '/App.js': `import React, { useState } from 'react';
const buttonGrid = [
  ["MC", "MR", "M+", "M-", "MS"],
  ["%", "CE", "C", "⌫", "/"],
  ["7", "8", "9", "*", "√"],
  ["4", "5", "6", "-", "x²"],
  ["1", "2", "3", "+", "²√x"],
  ["+/-", "0", ".", "=", "Mv"]
];
const opMap = {"÷": "/", "x²": "**2", "²√x": "**0.5", "*": "*"};
function format(val) { return val.toString().length > 12 ? Number(val).toExponential(6) : val; }
export default function App() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(0);
  const [expr, setExpr] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const handleClick = (val) => {
    if (["+", "-", "*", "/", "%", "÷"].includes(val)) {
      setExpr(expr + display + (opMap[val] || val));
      setOverwrite(true);
    } else if (val === "=") {
      try {
        const result = eval(expr + display);
        setDisplay(format(result));
        setExpr("");
        setOverwrite(true);
      } catch { setDisplay("Error"); setExpr(""); setOverwrite(true); }
    } else if (val === "C") {
      setDisplay("0"); setExpr("");
    } else if (val === "CE") {
      setDisplay("0");
    } else if (val === "⌫") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    } else if (val === "%") {
      setDisplay((parseFloat(display) / 100).toString());
      setOverwrite(true);
    } else if (val === "MC") {
      setMemory(0);
    } else if (val === "MR") {
      setDisplay(memory.toString());
      setOverwrite(true);
    } else if (val === "M+") {
      setMemory(memory + parseFloat(display));
      setOverwrite(true);
    } else if (val === "M-") {
      setMemory(memory - parseFloat(display));
      setOverwrite(true);
    } else if (val === "MS") {
      setMemory(parseFloat(display));
      setOverwrite(true);
    } else if (val === "Mv") {
      // No-op for now
    } else if (val === "√") {
      setDisplay(Math.sqrt(parseFloat(display)).toString());
      setOverwrite(true);
    } else if (val === "x²") {
      setDisplay((parseFloat(display) ** 2).toString());
      setOverwrite(true);
    } else if (val === "²√x") {
      setDisplay((parseFloat(display) ** 0.5).toString());
      setOverwrite(true);
    } else if (val === "+/-") {
      setDisplay((parseFloat(display) * -1).toString());
    } else {
      if (overwrite || display === "0") {
        setDisplay(val === "." ? "0." : val);
        setOverwrite(false);
      } else {
        setDisplay(display + val);
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-[#23272F] rounded-2xl shadow-2xl p-6 w-[380px]">
        <div className="flex flex-col mb-2">
          <span className="text-gray-400 text-xs h-4">{expr}</span>
          <div className="text-right text-white text-5xl font-light h-16 flex items-end justify-end">{display}</div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {buttonGrid.flat().map((btn, i) => (
            <button
              key={btn + i}
              onClick={() => handleClick(btn)}
              className={"h-12 rounded-lg text-lg font-medium " +
                (btn === "=" ? "bg-blue-500 text-white col-span-1" :
                btn === "C" || btn === "CE" ? "bg-gray-700 text-red-400" :
                btn === "+" || btn === "-" || btn === "*" || btn === "/" || btn === "÷" ? "bg-gray-700 text-blue-400" :
                "bg-[#2D3037] text-white") +
                " hover:brightness-125 transition-all"}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Calculator</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black">
  <div id="root"></div>
  <script type="text/babel">
    const buttonGrid = [
      ["MC", "MR", "M+", "M-", "MS"],
      ["%", "CE", "C", "⌫", "/"],
      ["7", "8", "9", "*", "√"],
      ["4", "5", "6", "-", "x²"],
      ["1", "2", "3", "+", "²√x"],
      ["+/-", "0", ".", "=", "Mv"]
    ];
    const opMap = {"÷": "/", "x²": "**2", "²√x": "**0.5", "*": "*"};
    function format(val) { return val.toString().length > 12 ? Number(val).toExponential(6) : val; }
    function App() {
      const [display, setDisplay] = React.useState("0");
      const [memory, setMemory] = React.useState(0);
      const [expr, setExpr] = React.useState("");
      const [overwrite, setOverwrite] = React.useState(false);
      const handleClick = (val) => {
        if (["+", "-", "*", "/", "%", "÷"].includes(val)) {
          setExpr(expr + display + (opMap[val] || val));
          setOverwrite(true);
        } else if (val === "=") {
          try {
            const result = eval(expr + display);
            setDisplay(format(result));
            setExpr("");
            setOverwrite(true);
          } catch { setDisplay("Error"); setExpr(""); setOverwrite(true); }
        } else if (val === "C") {
          setDisplay("0"); setExpr("");
        } else if (val === "CE") {
          setDisplay("0");
        } else if (val === "⌫") {
          setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
        } else if (val === "%") {
          setDisplay((parseFloat(display) / 100).toString());
          setOverwrite(true);
        } else if (val === "MC") {
          setMemory(0);
        } else if (val === "MR") {
          setDisplay(memory.toString());
          setOverwrite(true);
        } else if (val === "M+") {
          setMemory(memory + parseFloat(display));
          setOverwrite(true);
        } else if (val === "M-") {
          setMemory(memory - parseFloat(display));
          setOverwrite(true);
        } else if (val === "MS") {
          setMemory(parseFloat(display));
          setOverwrite(true);
        } else if (val === "Mv") {
          // No-op for now
        } else if (val === "√") {
          setDisplay(Math.sqrt(parseFloat(display)).toString());
          setOverwrite(true);
        } else if (val === "x²") {
          setDisplay((parseFloat(display) ** 2).toString());
          setOverwrite(true);
        } else if (val === "²√x") {
          setDisplay((parseFloat(display) ** 0.5).toString());
          setOverwrite(true);
        } else if (val === "+/-") {
          setDisplay((parseFloat(display) * -1).toString());
        } else {
          if (overwrite || display === "0") {
            setDisplay(val === "." ? "0." : val);
            setOverwrite(false);
          } else {
            setDisplay(display + val);
          }
        }
      };
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="bg-[#23272F] rounded-2xl shadow-2xl p-6 w-[380px]">
            <div className="flex flex-col mb-2">
              <span className="text-gray-400 text-xs h-4">{expr}</span>
              <div className="text-right text-white text-5xl font-light h-16 flex items-end justify-end">{display}</div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {buttonGrid.flat().map((btn, i) => (
                <button
                  key={btn + i}
                  onClick={() => handleClick(btn)}
                  className={"h-12 rounded-lg text-lg font-medium " +
                    (btn === "=" ? "bg-blue-500 text-white col-span-1" :
                    btn === "C" || btn === "CE" ? "bg-gray-700 text-red-400" :
                    btn === "+" || btn === "-" || btn === "*" || btn === "/" || btn === "÷" ? "bg-gray-700 text-blue-400" :
                    "bg-[#2D3037] text-white") +
                    " hover:brightness-125 transition-all"}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>`
    },
    summary: "A fully interactive, modern calculator app with Windows Calculator style, built with React and Tailwind CSS."
  },
  todo: {
    files: {
      '/App.js': `import React, { useState } from 'react';
export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <form onSubmit={e => {e.preventDefault(); if(input){setTodos([...todos, {text:input,done:false}]); setInput("");}}}>
          <input className="border p-2 w-2/3" value={input} onChange={e=>setInput(e.target.value)} placeholder="Add a todo" />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" type="submit">Add</button>
        </form>
        <ul className="mt-4">
          {todos.map((todo,i) => (
            <li key={i} className="flex items-center mb-2">
              <input type="checkbox" checked={todo.done} onChange={()=>setTodos(todos.map((t,j)=>j===i?{...t,done:!t.done}:t))} />
              <span className={"ml-2 " + (todo.done ? "line-through text-gray-400" : "")}>{todo.text}</span>
              <button className="ml-auto text-red-500" onClick={()=>setTodos(todos.filter((_,j)=>j!==i))}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
`,
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Todo List</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div id="root"></div>
  <script type="text/babel">
    function App() {
      const [todos, setTodos] = React.useState([]);
      const [input, setInput] = React.useState("");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded shadow w-96">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <form onSubmit={e => {e.preventDefault(); if(input){setTodos([...todos, {text:input,done:false}]); setInput("");}}}>
              <input className="border p-2 w-2/3" value={input} onChange={e=>setInput(e.target.value)} placeholder="Add a todo" />
              <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" type="submit">Add</button>
            </form>
            <ul className="mt-4">
              {todos.map((todo,i) => (
                <li key={i} className="flex items-center mb-2">
                  <input type="checkbox" checked={todo.done} onChange={()=>setTodos(todos.map((t,j)=>j===i?{...t,done:!t.done}:t))} />
                  <span className={"ml-2 " + (todo.done ? "line-through text-gray-400" : "")}>{todo.text}</span>
                  <button className="ml-auto text-red-500" onClick={()=>setTodos(todos.filter((_,j)=>j!==i))}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>`
    },
    summary: "A simple, interactive todo list app with add, complete, and delete features, built with React and Tailwind CSS."
  },
  timer: {
    files: {
      '/App.js': `import React, { useState, useRef } from 'react';
export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef();
  const start = () => { if (!running) { setRunning(true); interval.current = setInterval(()=>setSeconds(s=>s+1),1000); }};
  const stop = () => { setRunning(false); clearInterval(interval.current); };
  const reset = () => { setSeconds(0); setRunning(false); clearInterval(interval.current); };
  React.useEffect(()=>()=>clearInterval(interval.current),[]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Timer</h1>
        <div className="text-5xl font-mono mb-6">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div>
        <div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={start} disabled={running}>Start</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded mr-2" onClick={stop} disabled={!running}>Stop</button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
`,
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Timer</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div id="root"></div>
  <script type="text/babel">
    function App() {
      const [seconds, setSeconds] = React.useState(0);
      const [running, setRunning] = React.useState(false);
      const interval = React.useRef();
      const start = () => { if (!running) { setRunning(true); interval.current = setInterval(()=>setSeconds(s=>s+1),1000); }};
      const stop = () => { setRunning(false); clearInterval(interval.current); };
      const reset = () => { setSeconds(0); setRunning(false); clearInterval(interval.current); };
      React.useEffect(()=>()=>clearInterval(interval.current),[]);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded shadow w-80 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Timer</h1>
            <div className="text-5xl font-mono mb-6">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div>
            <div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={start} disabled={running}>Start</button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded mr-2" onClick={stop} disabled={!running}>Stop</button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={reset}>Reset</button>
            </div>
          </div>
        </div>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>`
    },
    summary: "A simple timer app with start, stop, and reset, built with React and Tailwind CSS."
  },
  weather: {
    files: {
      '/App.js': `import React, { useState } from 'react';
export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const fetchWeather = async () => {
    if (!city) return;
    setWeather("Loading...");
    try {
      const res = await fetch(\`https://wttr.in/\${city}?format=%C+%t+%w\`);
      const text = await res.text();
      setWeather(text);
    } catch {
      setWeather("Error fetching weather.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4">Weather App</h1>
        <input className="border p-2 w-2/3" value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter city" />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchWeather}>Get Weather</button>
        <div className="mt-4 text-lg">{weather && <span>{weather}</span>}</div>
      </div>
    </div>
  );
}
`,
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weather App</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-blue-100">
  <div id="root"></div>
  <script type="text/babel">
    function App() {
      const [city, setCity] = React.useState("");
      const [weather, setWeather] = React.useState(null);
      const fetchWeather = async () => {
        if (!city) return;
        setWeather("Loading...");
        try {
          const res = await fetch(\`https://wttr.in/\${city}?format=%C+%t+%w\`);
          const text = await res.text();
          setWeather(text);
        } catch {
          setWeather("Error fetching weather.");
        }
      };
      return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
          <div className="bg-white p-8 rounded shadow w-96">
            <h1 className="text-2xl font-bold mb-4">Weather App</h1>
            <input className="border p-2 w-2/3" value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter city" />
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchWeather}>Get Weather</button>
            <div className="mt-4 text-lg">{weather && <span>{weather}</span>}</div>
          </div>
        </div>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>`
    },
    summary: "A simple weather app that fetches current weather for a city using wttr.in, built with React and Tailwind CSS."
  },
  notes: {
    files: {
      '/App.js': `import React, { useState } from 'react';
export default function App() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <form onSubmit={e => {e.preventDefault(); if(input){setNotes([...notes, input]); setInput("");}}}>
          <input className="border p-2 w-2/3" value={input} onChange={e=>setInput(e.target.value)} placeholder="Add a note" />
          <button className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded" type="submit">Add</button>
        </form>
        <ul className="mt-4">
          {notes.map((note,i) => (
            <li key={i} className="mb-2 p-2 bg-yellow-100 rounded">{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
`,
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes App</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-yellow-50">
  <div id="root"></div>
  <script type="text/babel">
    function App() {
      const [notes, setNotes] = React.useState([]);
      const [input, setInput] = React.useState("");
      return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
          <div className="bg-white p-8 rounded shadow w-96">
            <h1 className="text-2xl font-bold mb-4">Notes</h1>
            <form onSubmit={e => {e.preventDefault(); if(input){setNotes([...notes, input]); setInput("");}}}>
              <input className="border p-2 w-2/3" value={input} onChange={e=>setInput(e.target.value)} placeholder="Add a note" />
              <button className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded" type="submit">Add</button>
            </form>
            <ul className="mt-4">
              {notes.map((note,i) => (
                <li key={i} className="mb-2 p-2 bg-yellow-100 rounded">{note}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>`
    },
    summary: "A simple notes app to add and view notes, built with React and Tailwind CSS."
  }
}; 