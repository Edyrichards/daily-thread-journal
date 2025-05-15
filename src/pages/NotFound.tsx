
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <Layout title="Not Found">
      <div className="flex flex-col items-center justify-center h-full mt-12">
        <h2 className="text-2xl font-serif text-[#333] mb-4">Page Not Found</h2>
        <p className="text-[#666] mb-8">
          The page you are looking for does not exist.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-6 shadow-sm"
        >
          Go Home
        </Button>
      </div>
    </Layout>
  );
}
