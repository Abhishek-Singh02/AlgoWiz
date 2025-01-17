import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PathfinderPage, SortingPage } from "@pages";
import { Layout } from "@components";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<PathfinderPage />} />
                    <Route path="sorting" element={<SortingPage />} />
                    <Route path="pathfinding" element={<PathfinderPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
