import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductProvider } from "./context/productContext";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  return (
    <>
      <Header />
      <QueryClientProvider client={client}>
        <ProductProvider>
          <div className='flex px-4 w-full'>
            <Outlet />
          </div>
        </ProductProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
