"use client";

interface TouchButtonProps {
  index: number;
  keyLabel: string;
  instrumentName: string;
  onPress: () => void;
  onRelease: () => void;
  isPressed: boolean;
}

const BUTTON_COLORS = [
  "bg-red-600 active:bg-red-400",
  "bg-yellow-600 active:bg-yellow-400",
  "bg-green-600 active:bg-green-400",
  "bg-blue-600 active:bg-blue-400",
];

const BUTTON_BORDERS = [
  "border-red-400",
  "border-yellow-400",
  "border-green-400",
  "border-blue-400",
];

export default function TouchButton({
  index,
  keyLabel,
  instrumentName,
  onPress,
  onRelease,
  isPressed,
}: TouchButtonProps) {
  return (
    <button
      className={`flex-1 h-24 rounded-xl mx-1 flex flex-col items-center justify-center
        text-white
        ${BUTTON_COLORS[index]} border-4 ${BUTTON_BORDERS[index]}
        ${isPressed ? "scale-95 brightness-125" : ""}
        transition-transform duration-75 select-none touch-none`}
      onTouchStart={(e) => {
        e.preventDefault();
        onPress();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onRelease();
      }}
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
    >
      <span className="text-xl font-bold">{instrumentName}</span>
      <span className="text-xs opacity-70 uppercase">{keyLabel}</span>
    </button>
  );
}
