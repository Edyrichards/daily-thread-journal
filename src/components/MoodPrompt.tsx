
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const MoodPrompt = () => {
  const navigate = useNavigate();

  const handleLogMood = () => {
    navigate("/journal/new");
  };

  return (
    <Card className="border-grace-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-grace-700 font-serif">
          Today's Reflection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4 text-grace-600">
          How are you feeling today?
        </p>
        <p className="text-sm text-grace-500">
          Take a moment to pause, breathe, and reflect on your emotions. God cares about how you feel.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleLogMood}
          className="w-full bg-grace-400 hover:bg-grace-500 text-white"
        >
          Log Your Mood
        </Button>
        <Button 
          onClick={() => navigate("/growth")}
          variant="outline"
          className="w-full border-grace-200 text-grace-600 hover:bg-grace-100"
        >
          View Spiritual Growth
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodPrompt;
