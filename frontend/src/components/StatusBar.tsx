// components/StatusBar.tsx
import { User, Calendar} from 'lucide-react';

interface StatusBarProps {
  userName: string;
  currentDate: string;
}

const StatusBar = ({ userName, currentDate}: StatusBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 flex justify-center items-center z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>{userName}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{currentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;