import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ParentDashboard from "./components/ParentDashboard";
import NurseryDashboard from "./components/NurseryDashboard";
import BrowseNurseries from "./components/BrowseNurseries";
import NurseryDetail from "./components/NurseryDetail";
import ChildSpace from "./components/ChildSpace";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: Login },
      { path: "signup", Component: SignUp },
      { path: "parent/dashboard", Component: ParentDashboard },
      { path: "nursery/dashboard", Component: NurseryDashboard },
      { path: "nurseries", Component: BrowseNurseries },
      { path: "nurseries/:id", Component: NurseryDetail },
      { path: "children/:childId", Component: ChildSpace },
      { path: "*", Component: NotFound },
    ],
  },
]);
