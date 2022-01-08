import ArticlePreview from "./Pages/ArticlePreview/ArticlePreview";
import { NtfPreviewCard } from "./Pages/NtfPreviewCard/NtfPreviewCard";
import { OrderSummary } from "./Pages/OrderSummary/OrderSummary";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { StatsPreview } from "./Pages/statsPreview/StatsPreview";


export default function App() {
  return (
    <Router>
      <div className="absolute top-2 left-2">
              <Link className="block px-3 py-2 bg-sky-500 text-white rounded-md" to="/">Home</Link>
      </div>
      <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/articlePrev" element={<ArticlePreview />}/>
          <Route exact path="/ntf" element={<NtfPreviewCard />}/>
          <Route exact path="/ordersumary" element={<OrderSummary />}/>
          <Route exact path="/statspreview" element={<StatsPreview />}/>
      </Routes>
    </Router>
  );
}