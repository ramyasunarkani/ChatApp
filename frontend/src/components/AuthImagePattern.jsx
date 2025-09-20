import { MessageSquare, Users, Heart, Star } from "lucide-react";

const icons = [MessageSquare, Users, Heart, Star];

const AuthImagePattern = ({ title, subtitle }) => {
  return (
            <div className="hidden lg:flex items-center justify-center bg-base-200 p-6">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3 mb-8">
        {icons.concat(icons).map((Icon, i) => (
            <div
            key={i}
            className="aspect-square rounded-2xl bg-primary/10 flex items-center justify-center"
            >
            <Icon className="size-6 text-primary" />
            </div>
        ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;