
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

const AdminStatCard = ({ title, value, icon: Icon, bgColor, textColor }: AdminStatCardProps) => {
  return (
    <Card className={`border-0 shadow-lg ${bgColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`${textColor} text-sm font-medium`}>{title}</p>
            <p className={`text-2xl font-bold ${textColor.replace('text-', 'text-').replace('400', '300')}`}>
              {value}
            </p>
          </div>
          <Icon className={`h-8 w-8 ${textColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStatCard;
