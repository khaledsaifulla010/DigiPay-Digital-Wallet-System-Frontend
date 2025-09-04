import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="px-12 mt-12">
        <div className="flex items-center justify-between px-8">
          <h1 className="text-3xl">DigiPay - Digital Wallet System </h1>
          <ModeToggle/>
        </div>
        <Button>Click me</Button>
      </div>
    </>
  );
}

export default App;
