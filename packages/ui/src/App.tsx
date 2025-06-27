import { router } from "@/routes/setup";
import { RouterProvider } from "@tanstack/react-router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
