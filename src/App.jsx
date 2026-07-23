import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Experience from "./pages/Experience";
import Network from "./pages/Network";
import Skills from "./pages/Skills";
import Resume from "./pages/Resume";
import CareerCenter from "./pages/CareerCenter";
import BookAppointment from "./pages/BookAppointment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="experience" element={<Experience />} />
          <Route path="network" element={<Network />} />
          <Route path="skills" element={<Skills />} />
          <Route path="resume" element={<Resume />} />
          <Route path="career-center" element={<CareerCenter />} />
          <Route path="book-appointment" element={<BookAppointment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
