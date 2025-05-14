
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const MoodPrompt = () => {
  const navigate = useNavigate();
  const today = new Date();

  const handleLogMood = () => {
    navigate("/journal/new");
  };

  return (
    <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
      <CardContent className="p-8 text-center">
        <p className="text-sm font-serif text-[#888888] mb-2">
          {format(today, "MMMM d")}
        </p>
        <h2 className="text-2xl mb-8 font-serif leading-relaxed text-[#333333]">
          How has God brought joy into your life recently?
        </h2>
        <Button 
          onClick={handleLogMood}
          className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333333] font-medium rounded-xl shadow-sm px-8 py-2"
        >
          Share your thoughts
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodPrompt;
