
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <h2 className="devotional-prompt mb-8">
          How has God brought joy into your life recen­tly?
        </h2>
        <Button 
          onClick={handleLogMood}
          className="bg-[#e8e8e0] hover:bg-[#d8d8d0] text-[#333333] font-medium rounded-xl shadow-sm px-8 py-2"
        >
          Asday, devotional prompt
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodPrompt;
